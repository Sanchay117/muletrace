-- ============================================================================
-- MuleTrace: Zetaris Lightning SQL Source Onboarding Script
-- Run one complete SQL statement at a time via Zetaris SQL Editor (:3000)
-- or POST /api/v1.0/sql-editor/sqls/run (:8888)
-- ============================================================================

CREATE LIGHTNING DATABASE MULETRACE_WIRE DESCRIBE BY "Real-time RTP, FedNow, and Same-Day ACH multi-hop transfer ledger";

CREATE SCHEMASTORE CONTAINER zetaris_wire;

CREATE LIGHTNING REST TABLE rtp_transfer_raw FROM MULETRACE_WIRE REQUEST (
  endpoint "http://host.docker.internal:8055/api/sample/rtp_transfer_ledger",
  method "get",
  response_type "json",
  http_encoding "URLENCODED"
) HEADER () BODY ();

CREATE SCHEMASTORE VIEW rtp_transfer_ledger WITH CONTAINER zetaris_wire AS
SELECT tx_id, case_id, scam_id, hop, branch, from_acct, to_acct, amount_usd, tainted_fifo_usd, elapsed_sec, rail, memo
FROM MULETRACE_WIRE.rtp_transfer_raw;

CREATE LIGHTNING DATABASE MULETRACE_CYBER DESCRIBE BY "Device emulator hashes, ASN subnets, and automated session cadence telemetry";

CREATE SCHEMASTORE CONTAINER zetaris_cyber;

CREATE SCHEMASTORE VIEW device_ip_sessions WITH CONTAINER zetaris_cyber AS
SELECT session_id, case_id, account_id, emulator_hash, asn, ip_subnet, split_cadence_sec, headless_script
FROM MULETRACE_CYBER.device_sessions_raw;

CREATE LIGHTNING DATABASE MULETRACE_KYC DESCRIBE BY "Account KYC verification, payroll pools, and bystander protection metadata";

CREATE SCHEMASTORE CONTAINER zetaris_kyc;

CREATE SCHEMASTORE VIEW account_profiles WITH CONTAINER zetaris_kyc AS
SELECT account_id, case_id, holder_name, kyc_status, account_age_days, legit_pool_usd, protected_bystanders, bystander_label, is_innocent_bystander
FROM MULETRACE_KYC.account_profiles_raw;

CREATE LIGHTNING DATABASE MULETRACE_CRYPTO DESCRIBE BY "Crypto bridge and OTC desk settlement countdowns";

CREATE SCHEMASTORE CONTAINER zetaris_crypto;

CREATE SCHEMASTORE VIEW offramp_orders WITH CONTAINER zetaris_crypto AS
SELECT order_id, case_id, hub_account, exchange_desk, pending_exit_usd, residual_mule_usd, total_recoverable_usd, exit_window_total_sec, elapsed_at_intercept_sec, remaining_sec_to_finality, attribution_confidence
FROM MULETRACE_CRYPTO.offramp_orders_raw;
