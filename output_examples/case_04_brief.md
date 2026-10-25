# MuleTrace Surgical Freeze Dossier: CASE-04 (SCAM-9412)

- **Incident:** $64K Co-Mingled Title Escrow Boundary (Ring-Fenced Sub-Ledger Hold)
- **Victim:** Elena & Marcus Vance (First-Time Homebuyers) (`ACCT-VIC-415`)
- **Stolen Principal:** `$64,000`
- **Verdict Action:** `RING_FENCED_SUBLEDGER_HOLD` on `ESCROW-HOLD-610` (Omnibus Title Escrow Sub-Ledger)
- **Recovered / Ring-Fenced:** `$64,000` (`100.0%`)
- **Intercept Clock:** `112s` elapsed (`128s` buffer before 240s finality)
- **Innocent Bystanders Protected via Backtracking:** `14` (`0` false freezes)
- **Markovian Token Reduction:** `92.0%` (`10,796` naive tok -> `867` capsule tok)

## 1. Pruned Innocent Bystander Branches (Backtracked)
- `ACCT-DENTAL-811` (**Oakridge Family Dental**): `BACKTRACKED_NO_FREEZE` -> Verified VERIFIED_CLINIC (2210d age), $92,000 legit pool (14 clinic staff accounts), emulator=NONE. Freezing would cause catastrophic collateral harm.

## 2. Six-Step NVIDIA Nemotron Reasoning Receipts (Meterless Nightshift)
- `NS-RCPT-048490D4F6` | **Step 1: Typology & Ring Memory Planner** | `nvidia/nemotron-3.5-lightning-30b-a3b` (Lane 1 (Fast 30B)) | `42.0 ms`
- `NS-RCPT-BB42D08B5C` | **Step 2: Parallel Fan-Out Hop Scouts** | `nvidia/nemotron-3.5-lightning-30b-a3b` (Lane 1 (Fast 30B)) | `42.0 ms`
- `NS-RCPT-F2E82D3F7C` | **Step 3: Innocence & Dead-End Pruning Critic** | `nvidia/nemotron-3.5-super-vl-120b-a12b` (Lane 2 (Deep 120B)) | `96.0 ms`
- `NS-RCPT-F7B5E02C24` | **Step 4: Deep Peel & Convergence Chaser** | `nvidia/nemotron-3.5-lightning-30b-a3b` (Lane 1 (Fast 30B)) | `42.0 ms`
- `NS-RCPT-701B0A9553` | **Step 5: FIFO Taint & Collateral Arbiter** | `nvidia/nemotron-3.5-super-vl-120b-a12b` (Lane 2 (Deep 120B)) | `96.0 ms`
- `NS-RCPT-614C7D447E` | **Step 6: Surgical Freeze & H-MEM Evolution** | `nvidia/nemotron-3.5-super-vl-120b-a12b` (Lane 2 (Deep 120B)) | `96.0 ms`
