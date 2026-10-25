# MuleTrace Surgical Freeze Dossier: CASE-02 (SCAM-9218)

- **Incident:** CFO $240K 7-Hop Automated Peel-Chain to OTC Desk
- **Victim:** Redwood BioLabs Treasury (`ACCT-VIC-204`)
- **Stolen Principal:** `$240,000`
- **Verdict Action:** `SURGICAL_INSTANT_FREEZE` on `OFFRAMP-OTC-440` (Cumberland-Style OTC Stablecoin Desk)
- **Recovered / Ring-Fenced:** `$218,400` (`91.0%`)
- **Intercept Clock:** `173s` elapsed (`67s` buffer before 240s finality)
- **Innocent Bystanders Protected via Backtracking:** `185` (`0` false freezes)
- **Markovian Token Reduction:** `92.2%` (`11,990` naive tok -> `934` capsule tok)

## 1. Pruned Innocent Bystander Branches (Backtracked)
- `ACCT-SAAS-310` (**CloudScale Hosting Billing**): `BACKTRACKED_NO_FREEZE` -> Verified VERIFIED_MERCHANT (3400d age), $810,000 legit pool (65 enterprise cloud billing tenants), emulator=NONE. Freezing would cause catastrophic collateral harm.
- `ACCT-UTIL-412` (**Metro Grid Municipal Power**): `BACKTRACKED_NO_FREEZE` -> Verified VERIFIED_UTILITY (5100d age), $1,250,000 legit pool (120 commercial utility autopay accounts), emulator=NONE. Freezing would cause catastrophic collateral harm.

## 2. Six-Step NVIDIA Nemotron Reasoning Receipts (Meterless Nightshift)
- `NS-RCPT-36C34895E4` | **Step 1: Typology & Ring Memory Planner** | `nvidia/nemotron-3.5-lightning-30b-a3b` (Lane 1 (Fast 30B)) | `42.0 ms`
- `NS-RCPT-7BF3149650` | **Step 2: Parallel Fan-Out Hop Scouts** | `nvidia/nemotron-3.5-lightning-30b-a3b` (Lane 1 (Fast 30B)) | `42.0 ms`
- `NS-RCPT-84C6AC4D8C` | **Step 3: Innocence & Dead-End Pruning Critic** | `nvidia/nemotron-3.5-super-vl-120b-a12b` (Lane 2 (Deep 120B)) | `96.0 ms`
- `NS-RCPT-F7B5E02C24` | **Step 4: Deep Peel & Convergence Chaser** | `nvidia/nemotron-3.5-lightning-30b-a3b` (Lane 1 (Fast 30B)) | `42.0 ms`
- `NS-RCPT-AAADC46BFC` | **Step 5: FIFO Taint & Collateral Arbiter** | `nvidia/nemotron-3.5-super-vl-120b-a12b` (Lane 2 (Deep 120B)) | `96.0 ms`
- `NS-RCPT-D04BFCF7DE` | **Step 6: Surgical Freeze & H-MEM Evolution** | `nvidia/nemotron-3.5-super-vl-120b-a12b` (Lane 2 (Deep 120B)) | `96.0 ms`
