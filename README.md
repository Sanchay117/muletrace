# MuleTrace

**Intercept 8-hop instant-payment money-mule rings before the 240-second crypto exit clock runs out, with zero innocent accounts frozen.**

MuleTrace is a speculative branch-and-backtrack reasoning architecture built for the **Open Agent Hackathon 2026** (**Track 3: Reasoning Architecture**, **Best use of NVIDIA Nemotron / DGX Spark**, and **Best Cursor-built product**).

> **One-Sentence Problem Statement (APPROACH Format):**  
> We built an agent system (**MuleTrace**) that helps a **Bank Real-Time Fraud & Financial-Crimes Operator** intercept split wire-scam laundering chains inside a 240-second settlement window by querying **four federated Zetaris schemas** (`zetaris_wire`, `zetaris_cyber`, `zetaris_kyc`, `zetaris_crypto`), exploring parallel hop branches while **pruning and backtracking away from innocent payroll and merchant accounts** in a shared **Meterless World Model**, bounding per-hop prompt growth to `O(1)` capsules with **Markovian** (`92.2%` avg token savings), and shortcutting repeat rings from 6 hops to 2 hops with **H-MEM**, powered by **NVIDIA Nemotron (`nvidia/nemotron-3.5-lightning-30b-a3b` and `nvidia/nemotron-3.5-super-vl-120b-a12b`) through Meterless Nightshift**.

---

## 1. Quick Start (Runs Cleanly in Under 15 Seconds, Zero Manual Setup)

MuleTrace runs out-of-the-box on Python 3 (`SAMPLE_MODE=true` virtualizes all 5 Zetaris schemas in SQLite when live Docker/Nightshift credentials are absent):

```bash
# 1. Verify sample datasets & SHA-256 checksums
python3 data/download_data.py

# 2. Run official Setup Guide Page 24 Data + Power smoke check (3/3 PASS)
python3 smoke_test.py

# 3. Run all 10 unit, conformance, and ablation tests
python3 -m unittest discover -s tests -v

# 4. Run the Naive Linear LLM vs. MuleTrace Reasoning Architecture benchmark across all 5 cases
python3 -m agent.main --benchmark

# 5. Launch the interactive Reasoning Architecture & Ablation Lab UI
python3 -m agent.main --serve --port 8055
```

---

## 2. Why MuleTrace Wins Track 3: Reasoning Architecture

When scammers steal `$120,000` over RTP or FedNow, they split funds across 6 to 8 mule hops, decoy employer payroll accounts, and crypto off-ramps in under 240 seconds.
- **1-hop bank rule bots** lose visibility at Hop 2+.
- **Naive single-prompt LLM agents** dump raw transaction tables into an $O(k^2)$ prompt (`12,513` tokens by Step 6), lose FIFO taint ratios across split/merge hubs, falsely freeze innocent bystander accounts (`42` clinic nurses' paychecks), and miss the `240s` finality window.

### Head-to-Head Benchmark (`python3 -m agent.main --benchmark`)

| Case | Scam Scenario | Hops | Naive Prompt Tok | Markovian Tok | Token Savings | False Freezes (Naive -> MuleTrace) | Intercept Time | Recovered / Protected |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `CASE-01` | `$120K` Retiree Fan-Out + Payroll Trap + Hop-6 Convergence | `6` | `12,513` | `909` | **`92.7%`** | `1 -> 0` (42 nurses saved) | `146s / 240s` | **`$101,500` (`84.6%`)** |
| `CASE-02` | `$240K` CFO 7-Hop Automated Peel-Chain to OTC Desk | `7` | `11,990` | `934` | **`92.2%`** | `2 -> 0` (185 billers saved) | `173s / 240s` | **`$218,400` (`91.0%`)** |
| `CASE-03` | `$85K` Repeat Ring-77 Hit (**H-MEM 2-Hop Shortcut**) | `2` | `11,043` | `909` | **`91.8%`** | `1 -> 0` (18 staff saved) | **`48s / 240s`** | **`$79,900` (`94.0%`)** |
| `CASE-04` | `$64K` Licensed Title-Escrow Pool (`64% < 80%` Gate) | `4` | `10,796` | `867` | **`92.0%`** | `2 -> 0` (4 home closings saved) | `112s / 240s` | **`$64,000` (`100%` Lien)** |
| `CASE-05` | `$175K` Cross-Rail Gift-Card API + TRON USDT Bridge | `3` | `11,320` | `887` | **`92.2%`** | `1 -> 0` (180 POS saved) | `162s / 240s` | **`$154,000` (`88.0%`)** |

---

## 3. Sponsor Stack Integration (Data + Build + Power)

### Layer 01: DATA (`Zetaris` Federated SQL)
- Implemented in `agent/tools_zetaris.py` against `POST {ZETARIS_REST_URL}/sql-editor/sqls/run` with `Authorization: Bearer <ZETARIS_API_KEY>`, `X-Org-ID: 1`, fresh UUID4 `X-Request-ID`, and strict single-statement enforcement.
- Lightning SQL registration script included at `scripts/register_zetaris_sources.sql` across `zetaris_wire.rtp_transfer_ledger`, `zetaris_cyber.device_ip_sessions`, `zetaris_kyc.account_profiles`, `zetaris_crypto.offramp_orders`, and `pokeapi.pikachu_abilities_table`.

### Layer 02: BUILD (`Cursor` + All 4 `Meterless Engines`)
- **How Cursor Was Used:** Built in Cursor Agent Mode using **Composer** for rapid multi-file scaffolding (`agent/`, `tests/`, `web/index.html`, and Remotion vector scenes) and **Grok** for designing the speculative Tree-of-Hops search, innocent-account backtrack pruning invariants, FIFO taint conservation math, and live architecture ablation simulator, governed by `.cursor/rules/muletrace.mdc` and `AGENTS.md` (also recorded in `metadata.json`).
- **All 4 Meterless Engines (`agent/engines/`):**
  1. **`Scout Intent` (`scout_intent.py`):** Classifies scam typology, scores 240s exit urgency, and assigns Fast vs Deep Nemotron lanes.
  2. **`World Model` (`world_model.py`):** Graph-native frontier tracking split edges, pruned bystander branches, cross-branch convergence hubs, and FIFO taint balances under optimistic locking (`ConcurrencyConflictError`).
  3. **`Markovian` (`markovian.py`):** Compresses every hop into a fixed-size `<210`-token `HopStateCapsule`, cutting cumulative prompt tokens by **`92.2%`**.
  4. **`H-MEM` (`h_mem.py`):** Persists mule-ring device/ASN/cadence fingerprints (`EMU-NOX-77::AS209854::19s`), shortcutting repeat rings from 6 hops down to 2 hops (`48s` intercept).

### Layer 03: POWER (`Meterless Nightshift` + Dual `NVIDIA Nemotron` Lanes)
- Implemented in `agent/llm.py` over `http://127.0.0.1:8088/v1` (`meterless-app: muletrace-agent`, `meterless-scope: user`) with zero raw NVIDIA API keys in code:
  - **Lane 1 (Fast Hop Scouts):** `nvidia/nemotron-3.5-lightning-30b-a3b` (Steps 1, 2, and 4)
  - **Lane 2 (Deep Pruning & Freeze Arbiter):** `nvidia/nemotron-3.5-super-vl-120b-a12b` (Steps 3, 5, and 6)
- Every step emits an explicit `ModelReceipt` (`receipt_id`, `lane`, `model_handled_by`, `latency_ms`, token counts) in CLI output, JSON traces (`output_examples/`), and the Web Lab.

---

## 4. Pre-Existing Components Declaration

**None.** All source code, reasoning architecture, Meterless Engine modules, Zetaris SQL scripts, synthetic benchmark datasets, tests, pitch deck, and motion-graphics demo video were built from scratch during the Open Agent Hackathon 2026 build window (22-27 October 2026).
