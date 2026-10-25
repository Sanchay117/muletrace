#!/usr/bin/env python3
"""
Verifies and prints SHA-256 checksums + row counts for MuleTrace's curated
Zetaris virtualized sample datasets in data/sample/.
"""

import hashlib
import json
from pathlib import Path

SAMPLE_DIR = Path(__file__).resolve().parent / "sample"
REQUIRED_FILES = [
    "rtp_transfer_ledger.json",
    "device_ip_sessions.json",
    "account_profiles.json",
    "offramp_orders.json",
    "hmem_seed.json",
]


def main() -> None:
    total_bytes = 0
    print("MuleTrace Sample Dataset Verification (data/sample/):")
    for fname in REQUIRED_FILES:
        fpath = SAMPLE_DIR / fname
        if not fpath.exists():
            raise FileNotFoundError(f"Missing required dataset file: {fpath}")
        raw = fpath.read_bytes()
        total_bytes += len(raw)
        rows = json.loads(raw.decode("utf-8"))
        digest = hashlib.sha256(raw).hexdigest()[:12]
        print(f"  OK  {fname:<28} rows={len(rows):<3} size={len(raw):>5}B  sha256={digest}")
    print(f"Verified {len(REQUIRED_FILES)} files ({total_bytes / 1024:.2f} KB total). Ready for Zetaris & SAMPLE_MODE=true.")


if __name__ == "__main__":
    main()
