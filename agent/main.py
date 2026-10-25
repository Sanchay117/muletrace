"""
MuleTrace CLI & Local Reasoning Lab Server (agent/main.py).
Usage:
  python3 -m agent.main --case CASE-01
  python3 -m agent.main --all-cases
  python3 -m agent.main --benchmark
  python3 -m agent.main --serve --port 8055
"""

import argparse
import json
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from typing import Any, Dict
from urllib.parse import parse_qs, urlparse

from .config import MuleTraceConfig, ROOT_DIR
from .orchestrator import MuleTraceOrchestrator


def format_markdown_brief(result: Dict[str, Any]) -> str:
    v = result["verdict"]
    mk = result["sponsor_technology_evidence"]["meterless_engines"]["markovian"]
    wm = result["sponsor_technology_evidence"]["meterless_engines"]["world_model"]
    ns = result["sponsor_technology_evidence"]["meterless_nightshift_and_nvidia_nemotron"]

    lines = [
        f"# MuleTrace Surgical Freeze Dossier: {result['case_id']} ({result['scam_id']})",
        "",
        f"- **Incident:** {result['title']}",
        f"- **Victim:** {result['victim_name']} (`{result['victim_account']}`)",
        f"- **Stolen Principal:** `${result['stolen_usd']:,}`",
        f"- **Verdict Action:** `{v['action']}` on `{v['target_order_id']}` ({v['exchange_desk']})",
        f"- **Recovered / Ring-Fenced:** `${v['recoverable_usd']:,}` (`{v['recovery_rate_pct']}%`)",
        f"- **Intercept Clock:** `{v['elapsed_sec']}s` elapsed (`{v['remaining_sec_to_finality']}s` buffer before 240s finality)",
        f"- **Innocent Bystanders Protected via Backtracking:** `{v['innocent_bystanders_protected']}` (`0` false freezes)",
        f"- **Markovian Token Reduction:** `{mk['compression_ratio_pct']}%` (`{mk['naive_total_prompt_tokens']:,}` naive tok -> `{mk['markovian_total_capsule_tokens']:,}` capsule tok)",
        "",
        "## 1. Pruned Innocent Bystander Branches (Backtracked)",
    ]
    for p in wm["pruned_branches"]:
        lines.append(
            f"- `{p['account_id']}` (**{p['holder_name']}**): `{p['action']}` -> {p['reason']}"
        )
    lines.extend(["", "## 2. Six-Step NVIDIA Nemotron Reasoning Receipts (Meterless Nightshift)"])
    for r in ns["receipts"]:
        lines.append(
            f"- `{r['receipt_id']}` | **{r['step_name']}** | `{r['model_handled_by']}` ({r['lane']}) | `{r['latency_ms']} ms`"
        )
    return "\n".join(lines) + "\n"


def write_case_outputs(orch: MuleTraceOrchestrator, case_id: str) -> Dict[str, Any]:
    res = orch.run_case(case_id)
    out_dir = ROOT_DIR / "output_examples"
    out_dir.mkdir(parents=True, exist_ok=True)
    slug = case_id.lower().replace("-", "_")
    (out_dir / f"{slug}_trace.json").write_text(
        json.dumps(res, indent=2), encoding="utf-8"
    )
    (out_dir / f"{slug}_brief.md").write_text(
        format_markdown_brief(res), encoding="utf-8"
    )
    return res


def run_benchmark(orch: MuleTraceOrchestrator) -> None:
    print("\nMuleTrace Track 3 Reasoning Architecture vs Naive Linear Agent Benchmark")
    print("=" * 98)
    print(
        f"{'Case':<9} {'Hops':<6} {'Naive Tok':<11} {'Markov Tok':<12} {'Saved':<8} "
        f"{'FalseFrz (N->M)':<17} {'Intercept':<11} {'Recovered'}"
    )
    print("-" * 98)
    for idx in range(1, 6):
        cid = f"CASE-0{idx}"
        res = write_case_outputs(orch, cid)
        v = res["verdict"]
        nv = res["naive_vs_architecture_benchmark"]["naive_linear_agent"]
        mv = res["naive_vs_architecture_benchmark"]["muletrace_reasoning_architecture"]
        print(
            f"{cid:<9} {mv['hops_traversed']:<6} "
            f"{nv['prompt_tokens_cumulative']:<11,} {mv['capsule_tokens_cumulative']:<12,} "
            f"{mv['token_reduction_pct']:>5.1f}%  "
            f"{nv['false_freezes_triggered']} -> {mv['false_freezes_triggered']:<12} "
            f"{mv['elapsed_sec_at_intercept']:>3}s/240s   "
            f"${mv['recovered_usd']:,} ({mv['recovery_rate_pct']}%)"
        )
    print("=" * 98)


def serve_web(orch: MuleTraceOrchestrator, port: int = 8055) -> None:
    class Handler(SimpleHTTPRequestHandler):
        def do_GET(self) -> None:
            parsed = urlparse(self.path)
            if parsed.path == "/api/cases":
                cases = [orch.run_case(f"CASE-0{i}") for i in range(1, 6)]
                self._json(cases)
                return
            if parsed.path == "/api/ablate":
                qs = parse_qs(parsed.query)
                cid = qs.get("case_id", ["CASE-01"])[0]
                bt = qs.get("backtrack", ["1"])[0] == "1"
                mk = qs.get("markovian", ["1"])[0] == "1"
                hm = qs.get("hmem", ["1"])[0] == "1"
                self._json(orch.simulate_architecture_ablation(cid, bt, mk, hm))
                return
            if parsed.path in ("/", "/index.html"):
                self._serve_file(ROOT_DIR / "web" / "index.html", "text/html")
                return
            if parsed.path == "/deck":
                self._serve_file(ROOT_DIR / "docs" / "deck.html", "text/html")
                return
            super().do_GET()

        def _json(self, obj: Any) -> None:
            raw = json.dumps(obj).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(raw)))
            self.end_headers()
            self.wfile.write(raw)

        def _serve_file(self, fpath: Path, mime: str) -> None:
            raw = fpath.read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", f"{mime}; charset=utf-8")
            self.send_header("Content-Length", str(len(raw)))
            self.end_headers()
            self.wfile.write(raw)

    print(f"MuleTrace Reasoning Architecture Lab running at http://127.0.0.1:{port}")
    HTTPServer(("127.0.0.1", port), Handler).serve_forever()


def main() -> None:
    parser = argparse.ArgumentParser(description="MuleTrace Reasoning Architecture CLI")
    parser.add_argument("--case", default="CASE-01", help="Case ID (CASE-01..CASE-05)")
    parser.add_argument("--all-cases", action="store_true", help="Run all 5 benchmark cases")
    parser.add_argument("--benchmark", action="store_true", help="Print Naive vs Architecture table")
    parser.add_argument("--serve", action="store_true", help="Start local web UI server")
    parser.add_argument("--port", type=int, default=8055, help="Web UI port")
    args = parser.parse_args()

    orch = MuleTraceOrchestrator(MuleTraceConfig.from_env())
    if args.serve:
        serve_web(orch, args.port)
    elif args.benchmark or args.all_cases:
        run_benchmark(orch)
    else:
        res = write_case_outputs(orch, args.case)
        print(format_markdown_brief(res))


if __name__ == "__main__":
    main()
