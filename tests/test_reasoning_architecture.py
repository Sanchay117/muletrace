"""
End-to-end Track 3 Reasoning Architecture tests:
1. CASE-01: Prunes 42-nurse innocent payroll branch & intercepts Hop-6 re-convergence ($101,500)
2. CASE-03: H-MEM ring fingerprint shortcuts trace to 2 hops in 48s ($79,900)
3. CASE-04: Licensed title-escrow 64% confidence gate abstains from full freeze -> sub-ledger hold
4. Architecture Ablation Lab: Disabling Backtrack or Markovian degrades safety/deadline
"""

import tempfile
import unittest
from pathlib import Path

from agent.config import MuleTraceConfig
from agent.orchestrator import MuleTraceOrchestrator


class TestReasoningArchitecture(unittest.TestCase):
    def _make_orch(self, tmpdir: str) -> MuleTraceOrchestrator:
        cfg = MuleTraceConfig.from_env(force_sample_mode=True)
        return MuleTraceOrchestrator(config=cfg, hmem_storage_path=Path(tmpdir) / "hmem.json")

    def test_01_case_01_innocent_payroll_backtrack_and_convergence(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            orch = self._make_orch(tmp)
            res = orch.run_case("CASE-01")
            v = res["verdict"]
            self.assertEqual(v["action"], "SURGICAL_INSTANT_FREEZE")
            self.assertEqual(v["recoverable_usd"], 101500)
            self.assertEqual(v["false_freezes"], 0)
            self.assertEqual(v["innocent_bystanders_protected"], 42)
            self.assertEqual(v["hops_traversed"], 6)

            mk = res["sponsor_technology_evidence"]["meterless_engines"]["markovian"]
            self.assertGreater(mk["compression_ratio_pct"], 90.0)

            ns = res["sponsor_technology_evidence"]["meterless_nightshift_and_nvidia_nemotron"]
            self.assertEqual(ns["total_nemotron_calls"], 6)
            self.assertEqual(
                ns["models_used_summary"]["nvidia/nemotron-3.5-lightning-30b-a3b"], 3
            )
            self.assertEqual(
                ns["models_used_summary"]["nvidia/nemotron-3.5-super-vl-120b-a12b"], 3
            )

    def test_02_case_03_hmem_two_hop_shortcut(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            orch = self._make_orch(tmp)
            res = orch.run_case("CASE-03")
            v = res["verdict"]
            self.assertTrue(v["hmem_fastpath_used"])
            self.assertEqual(v["hops_traversed"], 2)
            self.assertEqual(v["elapsed_sec"], 48)
            self.assertEqual(v["recoverable_usd"], 79900)

    def test_03_case_04_escrow_confidence_gate_subledger_hold(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            orch = self._make_orch(tmp)
            res = orch.run_case("CASE-04")
            v = res["verdict"]
            self.assertEqual(v["action"], "RING_FENCED_SUBLEDGER_HOLD")
            self.assertLess(v["attribution_confidence"], v["confidence_gate"])
            self.assertEqual(v["false_freezes"], 0)

    def test_04_architecture_ablation_proves_component_necessity(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            orch = self._make_orch(tmp)
            full = orch.simulate_architecture_ablation("CASE-01", True, True, True)
            no_bt = orch.simulate_architecture_ablation("CASE-01", False, True, True)
            no_mk = orch.simulate_architecture_ablation("CASE-01", True, False, True)

            self.assertEqual(full["simulated_outcome"]["architecture_grade"], "OPTIMAL_SURGICAL_INTERCEPT")
            self.assertGreater(no_bt["simulated_outcome"]["false_freezes_triggered"], 0)
            self.assertEqual(no_bt["simulated_outcome"]["innocent_bystanders_harmed"], 42)
            self.assertFalse(no_mk["simulated_outcome"]["beat_settlement_clock"])
            self.assertEqual(no_mk["simulated_outcome"]["recovered_usd"], 0)


if __name__ == "__main__":
    unittest.main()
