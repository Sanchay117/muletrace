"""
Conformance tests for all 4 Meterless Engines in MuleTrace:
1. Scout Intent
2. World Model (including optimistic locking & convergence detection)
3. Markovian (O(1) hop capsule vs O(k^2) naive token growth)
4. H-MEM (cross-session ring fingerprint persistence & recall)
"""

import tempfile
import unittest
from pathlib import Path

from agent.engines import (
    ConcurrencyConflictError,
    HMemEngine,
    MarkovianEngine,
    ScoutIntentEngine,
    WorldModelEngine,
)


class TestMeterlessEngines(unittest.TestCase):
    def test_01_scout_intent_typology_and_lane_routing(self) -> None:
        scout = ScoutIntentEngine(
            fast_model="nvidia/nemotron-3.5-lightning-30b-a3b",
            deep_model="nvidia/nemotron-3.5-super-vl-120b-a12b",
        )
        route = scout.evaluate(
            "Trace hijacked $240,000 vendor wire SCAM-9218 across deep 7-hop automated peel chain within 240s.",
            stolen_usd=240000,
        )
        self.assertEqual(route.scam_id, "SCAM-9218")
        self.assertEqual(route.typology, "BEC_DEEP_PEEL_CHAIN")
        self.assertGreaterEqual(route.urgency_score, 90)
        self.assertEqual(route.fast_scout_model, "nvidia/nemotron-3.5-lightning-30b-a3b")
        self.assertEqual(route.deep_arbiter_model, "nvidia/nemotron-3.5-super-vl-120b-a12b")

    def test_02_world_model_convergence_and_optimistic_lock(self) -> None:
        wm = WorldModelEngine()
        wm.seed_victim_root("ACCT-VIC-1", 100000, "Planner", expected_version=0)
        wm.record_hop_edge(
            {
                "tx_id": "TX-1",
                "hop": 1,
                "branch": "A",
                "from_acct": "ACCT-VIC-1",
                "to_acct": "ACCT-HUB-9",
                "amount_usd": 60000,
                "tainted_fifo_usd": 60000,
                "elapsed_sec": 20,
                "rail": "RTP",
            },
            "Scout_A",
            expected_version=1,
        )
        wm.record_hop_edge(
            {
                "tx_id": "TX-2",
                "hop": 1,
                "branch": "C",
                "from_acct": "ACCT-VIC-1",
                "to_acct": "ACCT-HUB-9",
                "amount_usd": 40000,
                "tainted_fifo_usd": 40000,
                "elapsed_sec": 24,
                "rail": "FEDNOW",
            },
            "Scout_C",
            expected_version=2,
        )
        snap = wm.snapshot()
        self.assertEqual(len(snap["convergence_hubs"]), 1)
        self.assertEqual(snap["convergence_hubs"][0]["converged_taint_usd"], 100000)

        with self.assertRaises(ConcurrencyConflictError):
            wm.prune_and_backtrack_branch(
                account_id="ACCT-SAFE",
                branch="B",
                holder_name="Clinic Payroll",
                protected_bystanders=42,
                bystander_label="42 nurses",
                legit_pool_usd=294000,
                reason="Verified payroll",
                agent_name="Stale_Agent",
                expected_version=1,
            )

    def test_03_markovian_hop_capsule_compression(self) -> None:
        mk = MarkovianEngine(max_capsule_tokens=210)
        for hop in range(1, 7):
            raw = ("LEDGER_ROW_JSON_DUMP " * 110) + f"hop={hop}"
            cap = mk.transition(
                step_name=f"Hop {hop}",
                agent_name="HopScout",
                raw_step_transcript=raw,
                active_frontier=[f"ACCT-MULE-{hop}01", f"ACCT-MULE-{hop}03"],
                pruned_safe_accounts=["ACCT-PAY-402"],
                tracked_taint_usd=101500,
                open_directives=[f"Advance to Hop {hop + 1}"],
            )
            self.assertLessEqual(cap.bounded_capsule_tokens, 210)

        summary = mk.telemetry_summary()
        self.assertEqual(summary["steps_completed"], 6)
        self.assertGreater(summary["compression_ratio_pct"], 88.0)

    def test_04_hmem_ring_fingerprint_persistence(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            store = Path(tmp) / "hmem.json"
            hmem1 = HMemEngine(storage_path=store)
            committed = hmem1.commit_ring_signature(
                tier="PRECEDENT",
                emulator_hash="EMU-TEST-99",
                asn="AS99999",
                split_cadence_sec=17,
                known_exit_hub_pattern="ACCT-HUB-X -> OFFRAMP-X",
                shortcut_hops_saved=4,
                lesson="Synthetic test ring pattern.",
            )
            hmem2 = HMemEngine(storage_path=store)
            hits = hmem2.recall_by_fingerprint(emulator_hash="EMU-TEST-99")
            self.assertEqual(len(hits), 1)
            self.assertEqual(hits[0].memory_id, committed.memory_id)


if __name__ == "__main__":
    unittest.main()
