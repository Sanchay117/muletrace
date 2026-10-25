"""
Meterless Engine 04: H-MEM Hierarchical Ring Memory (agent/engines/h_mem.py).
Stores cross-session mule-ring behavioral fingerprints across three tiers:
  - EPISODIC: Individual scam trace logs
  - SEMANTIC: Laundering & omnibus-escrow safeguard rules
  - PRECEDENT: Verified emulator_hash + ASN + split_cadence_sec ring shortcuts
Allows MuleTrace to shortcut a 6-hop ring down to 2 hops on repeat encounters.
"""

import json
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

from ..config import SAMPLE_DIR


@dataclass
class RingMemoryRecord:
    memory_id: str
    tier: str
    ring_signature: str
    emulator_hash: str
    asn: str
    split_cadence_sec: int
    known_exit_hub_pattern: str
    shortcut_hops_saved: int
    lesson: str
    created_at: str

    def to_dict(self) -> Dict[str, Any]:
        return {
            "memory_id": self.memory_id,
            "tier": self.tier,
            "ring_signature": self.ring_signature,
            "emulator_hash": self.emulator_hash,
            "asn": self.asn,
            "split_cadence_sec": self.split_cadence_sec,
            "known_exit_hub_pattern": self.known_exit_hub_pattern,
            "shortcut_hops_saved": self.shortcut_hops_saved,
            "lesson": self.lesson,
            "created_at": self.created_at,
        }


class HMemEngine:
    def __init__(self, storage_path: Optional[Path] = None) -> None:
        self.storage_path = storage_path
        self.records: List[RingMemoryRecord] = []
        self._load()

    def _load(self) -> None:
        if self.storage_path and self.storage_path.exists():
            raw = json.loads(self.storage_path.read_text(encoding="utf-8"))
        else:
            raw = json.loads((SAMPLE_DIR / "hmem_seed.json").read_text(encoding="utf-8"))
        self.records = [RingMemoryRecord(**r) for r in raw]

    def _persist(self) -> None:
        if not self.storage_path:
            return
        self.storage_path.parent.mkdir(parents=True, exist_ok=True)
        self.storage_path.write_text(
            json.dumps([r.to_dict() for r in self.records], indent=2),
            encoding="utf-8",
        )

    def recall_by_fingerprint(
        self,
        emulator_hash: Optional[str] = None,
        asn: Optional[str] = None,
        include_semantic_escrow: bool = False,
    ) -> List[RingMemoryRecord]:
        matched: List[RingMemoryRecord] = []
        for rec in self.records:
            if emulator_hash and rec.emulator_hash == emulator_hash:
                matched.append(rec)
            elif asn and rec.asn == asn and rec.asn != "ANY":
                matched.append(rec)
            elif include_semantic_escrow and rec.tier == "SEMANTIC":
                matched.append(rec)
        return matched

    def commit_ring_signature(
        self,
        tier: str,
        emulator_hash: str,
        asn: str,
        split_cadence_sec: int,
        known_exit_hub_pattern: str,
        shortcut_hops_saved: int,
        lesson: str,
    ) -> RingMemoryRecord:
        sig = f"{emulator_hash}::{asn}::{split_cadence_sec}s"
        for existing in self.records:
            if existing.ring_signature == sig and existing.tier == tier:
                return existing
        rec = RingMemoryRecord(
            memory_id=f"HMEM-RING-{7700 + len(self.records) + 1}",
            tier=tier,
            ring_signature=sig,
            emulator_hash=emulator_hash,
            asn=asn,
            split_cadence_sec=split_cadence_sec,
            known_exit_hub_pattern=known_exit_hub_pattern,
            shortcut_hops_saved=shortcut_hops_saved,
            lesson=lesson,
            created_at=datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        )
        self.records.append(rec)
        self._persist()
        return rec
