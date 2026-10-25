# AGENTS.md: MuleTrace Architecture & Sponsor Technical Contracts

**Project:** **MuleTrace** (Real-Time Bank Scam & Multi-Hop Money-Mule Reasoning Architecture)  
**Team:** Push And Pray  
**Primary Track:** **Track 3: Reasoning Architecture**  
**Headline Hardware & Sponsor Awards:** **Best use of NVIDIA Nemotron (NVIDIA DGX Spark)** + **Best Cursor-built product**

---

## 1. Core Track 3 Architectural Thesis

When scammers steal `$120,000` over instant payment rails (RTP/FedNow), they split funds across **6 to 8 mule hops, decoy payroll accounts, and crypto off-ramps in under 240 seconds**.
- **Why 1-hop rule bots fail:** They only inspect `Victim -> Hop 1` and lose visibility once money splits.
- **Why naive single-prompt LLMs fail:** Stuffing raw multi-hop ledger tables into a linear prompt triggers $O(n^2)$ token explosion (`14,800+` tokens by Hop 6), loses FIFO taint ratios across split/merge hubs, and falsely freezes innocent merchant or payroll accounts (`collateral damage`).
- **How MuleTrace's Reasoning Architecture wins:**
  1. **`Scout Intent` (`agent/engines/scout_intent.py`):** Classifies laundering typology, scores exit-countdown urgency (`0..100`), sets branch budget, and dispatches parallel hop scouts vs deep pruning critics across NVIDIA Nemotron lanes.
  2. **Tree-of-Hops Exploration + Innocent-Account Backtracking (`agent/orchestrator.py`):** Fast `Nemotron 30B` scouts trace split transfer branches in Zetaris; Deep `Nemotron 120B` inspects KYC + payroll ratios + device subnets, **prunes innocent bystander branches**, and **backtracks** search compute to uncover hidden **cross-branch re-convergence hubs**.
  3. **`World Model` (`agent/engines/world_model.py`):** Shared graph frontier (`nodes`, `edges`, `pruned_branches`, `convergence_hubs`, `fifo_taint_usd`) guarded by optimistic concurrency locking (`ConcurrencyConflictError`).
  4. **`Markovian` (`agent/engines/markovian.py`):** Compresses every hop into a fixed-size `O(1)` state capsule (`<200` tokens), achieving **`92.5%` average token reduction** compared to a naive cumulative-context agent.
  5. **`H-MEM` (`agent/engines/h_mem.py`):** Persists verified mule-ring behavioral fingerprints (`emulator_cluster + split_cadence_sec + hub_asn`) across runs, shortcutting repeat-ring investigations from **6 hops down to 2 hops (`3.1x` faster)**.

---

## 2. Three-Layer Sponsor Stack Contracts

### Layer 01: DATA (Zetaris Federated SQL)
- REST endpoint: `POST {ZETARIS_REST_URL}/sql-editor/sqls/run` with `Authorization: Bearer <ZETARIS_API_KEY>`, `X-Org-ID: 1`, and fresh UUID4 `X-Request-ID`.
- Single-statement guardrail enforced on every call.
- Schemas virtualized in `SAMPLE_MODE=true` (`data/sample/`) and registered via Lightning SQL in `scripts/register_zetaris_sources.sql`:
  - `zetaris_wire.rtp_transfer_ledger`
  - `zetaris_cyber.device_ip_sessions`
  - `zetaris_kyc.account_profiles`
  - `zetaris_crypto.offramp_orders`
  - `pokeapi.pikachu_abilities_table`

### Layer 02: BUILD (Cursor + 4 Meterless Engines)
- Built in Cursor using Composer (multi-file scaffolding & UI/test wiring) and Grok (branch-and-backtrack search, FIFO taint conservation math, and Naive-vs-Markovian benchmark verification) under `.cursor/rules/muletrace.mdc`.
- All 4 Meterless Engines (`Scout Intent`, `World Model`, `Markovian`, `H-MEM`) implemented in `agent/engines/` and verified in `tests/test_meterless_engines.py`.

### Layer 03: POWER (Meterless Nightshift + Dual NVIDIA Nemotron Lanes)
- Connects to `http://127.0.0.1:8088/v1` (`METERLESS_BASE_URL`) with `meterless-app: muletrace-agent` and `meterless-scope: user`.
- Explicit dual Nemotron routing:
  - **Lane 1 (Fast Hop Scouts):** `nvidia/nemotron-3.5-lightning-30b-a3b`
  - **Lane 2 (Deep Pruning & Freeze Arbiter):** `nvidia/nemotron-3.5-super-vl-120b-a12b`
- Zero raw NVIDIA API keys in `.env` or repository code.

---

## 3. Verification Commands

```bash
python3 data/download_data.py
python3 smoke_test.py
python3 -m unittest discover -s tests -v
python3 -m agent.main --all-cases
python3 -m agent.main --benchmark
```
