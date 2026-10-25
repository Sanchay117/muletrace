# MuleTrace Federated Datasets (`data/`)

Curated synthetic multi-hop instant-payment laundering benchmarks modeled on FinCEN, FBI IC3 Elder Fraud, and FedNow/RTP scam typologies (100% synthetic PII-free identifiers created during the Open Agent Hackathon 2026 build window).

## Zetaris Federated Schemas

| Zetaris Table | Sample Source | Purpose in Track 3 Reasoning Architecture |
| :--- | :--- | :--- |
| `zetaris_wire.rtp_transfer_ledger` | `sample/rtp_transfer_ledger.json` | Multi-hop RTP, FedNow, and Same-Day ACH fan-out, peel-chain, and re-convergence edges (`tx_id`, `hop`, `branch`, `tainted_fifo_usd`, `elapsed_sec`). |
| `zetaris_cyber.device_ip_sessions` | `sample/device_ip_sessions.json` | Headless Android emulator hashes (`EMU-NOX-77`), ASN subnets, and automated split cadences (`19s`). |
| `zetaris_kyc.account_profiles` | `sample/account_profiles.json` | Account KYC status, legitimate co-mingled payroll/merchant pools, and protected bystander counts used by the Deep Pruning Critic to prevent false freezes. |
| `zetaris_crypto.offramp_orders` | `sample/offramp_orders.json` | Crypto bridge and OTC liquidity exit countdowns (`remaining_sec_to_finality`) and attribution confidence scores. |
| `pokeapi.pikachu_abilities_table` | Built-in starter view | Official Setup Guide Page 10 Zetaris REST verification table (`static`, `lightning-rod`). |
