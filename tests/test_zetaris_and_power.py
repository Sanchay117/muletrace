"""
Tests for Layer 01 (Zetaris single-statement SQL + multi-schema federation)
and Layer 03 (Meterless Nightshift dual NVIDIA Nemotron lane receipts).
"""

import unittest

from agent.config import MuleTraceConfig
from agent.llm import NightshiftNemotronClient
from agent.tools_zetaris import ZetarisClient, ZetarisGuardrailError


class TestZetarisAndPower(unittest.TestCase):
    def test_01_zetaris_single_statement_guardrail_and_federated_join(self) -> None:
        cfg = MuleTraceConfig.from_env(force_sample_mode=True)
        z = ZetarisClient(cfg)

        with self.assertRaises(ZetarisGuardrailError):
            z.run_sql("SELECT 1; SELECT * FROM zetaris_wire.rtp_transfer_ledger")

        joined = z.run_sql(
            "SELECT w.tx_id, w.to_acct, k.holder_name, k.protected_bystanders "
            "FROM zetaris_wire.rtp_transfer_ledger w "
            "JOIN zetaris_kyc.account_profiles k ON w.to_acct = k.account_id "
            "WHERE w.case_id = 'CASE-01' AND k.is_innocent_bystander = 1"
        )
        self.assertEqual(joined.row_count, 1)
        self.assertEqual(joined.rows[0]["to_acct"], "ACCT-PAY-402")
        self.assertEqual(joined.rows[0]["protected_bystanders"], 42)

    def test_02_nightshift_dual_nemotron_receipts(self) -> None:
        cfg = MuleTraceConfig.from_env(force_sample_mode=True)
        ns = NightshiftNemotronClient(cfg)

        _, r_fast = ns.run_agent_step(
            step_name="Scout Step",
            agent_name="Fast Scout",
            lane="fast",
            system_prompt="Scout hops",
            user_prompt="CASE-01",
            deterministic_builder=lambda: "scouted",
        )
        _, r_deep = ns.run_agent_step(
            step_name="Prune Step",
            agent_name="Deep Critic",
            lane="deep",
            system_prompt="Prune bystanders",
            user_prompt="CASE-01",
            deterministic_builder=lambda: "pruned",
        )
        self.assertEqual(r_fast.model_handled_by, "nvidia/nemotron-3.5-lightning-30b-a3b")
        self.assertEqual(r_deep.model_handled_by, "nvidia/nemotron-3.5-super-vl-120b-a12b")
        self.assertEqual(ns.summary()["total_nemotron_calls"], 2)


if __name__ == "__main__":
    unittest.main()
