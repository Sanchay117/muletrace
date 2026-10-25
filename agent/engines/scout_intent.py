"""
Meterless Engine 01: Scout Intent (agent/engines/scout_intent.py).
Classifies instant-payment laundering typologies, computes 240s exit-window
urgency, allocates branch/hop search budgets, and routes tasks between
NVIDIA Nemotron Fast (30B) and Deep (120B) Nightshift lanes.
"""

import re
from dataclasses import dataclass
from typing import Any, Dict, List


@dataclass
class IntentRoute:
    scam_id: str
    typology: str
    urgency_level: str
    urgency_score: int
    max_branch_budget: int
    max_hop_depth: int
    enable_hmem_fastpath_check: bool
    require_fiduciary_lien_gate: bool
    required_zetaris_tables: List[str]
    fast_scout_model: str
    deep_arbiter_model: str

    def to_dict(self) -> Dict[str, Any]:
        return {
            "scam_id": self.scam_id,
            "typology": self.typology,
            "urgency_level": self.urgency_level,
            "urgency_score": self.urgency_score,
            "max_branch_budget": self.max_branch_budget,
            "max_hop_depth": self.max_hop_depth,
            "enable_hmem_fastpath_check": self.enable_hmem_fastpath_check,
            "require_fiduciary_lien_gate": self.require_fiduciary_lien_gate,
            "required_zetaris_tables": self.required_zetaris_tables,
            "fast_scout_model": self.fast_scout_model,
            "deep_arbiter_model": self.deep_arbiter_model,
        }


class ScoutIntentEngine:
    def __init__(self, fast_model: str, deep_model: str) -> None:
        self.fast_model = fast_model
        self.deep_model = deep_model

    def evaluate(self, prompt: str, stolen_usd: int = 120000) -> IntentRoute:
        low = prompt.lower()
        match = re.search(r"(SCAM-\d{4})", prompt.upper())
        scam_id = match.group(1) if match else "SCAM-9104"

        if "peel" in low or "9218" in low:
            typology = "BEC_DEEP_PEEL_CHAIN"
            max_hops = 8
            branches = 3
        elif "h-mem" in low or "shortcut" in low or "ring-77" in low or "9305" in low:
            typology = "REPEAT_RING_HMEM_FASTPATH"
            max_hops = 6
            branches = 3
        elif "escrow" in low or "omnibus" in low or "title" in low or "9412" in low:
            typology = "FIDUCIARY_ESCROW_BOUNDARY"
            max_hops = 5
            branches = 2
        elif "tron" in low or "gift-card" in low or "grocery" in low or "9520" in low:
            typology = "CROSS_RAIL_BRIDGE_SPLIT"
            max_hops = 5
            branches = 3
        else:
            typology = "ELDER_RTP_FANOUT_CONVERGENCE"
            max_hops = 7
            branches = 3

        urgency_score = min(99, 78 + (12 if stolen_usd >= 100000 else 6) + (5 if "240" in low or "60" in low else 3))
        urgency_level = "CRITICAL_240S_EXIT" if urgency_score >= 85 else "HIGH_VELOCITY"

        return IntentRoute(
            scam_id=scam_id,
            typology=typology,
            urgency_level=urgency_level,
            urgency_score=urgency_score,
            max_branch_budget=branches,
            max_hop_depth=max_hops,
            enable_hmem_fastpath_check=True,
            require_fiduciary_lien_gate=("escrow" in low or "omnibus" in low or typology == "FIDUCIARY_ESCROW_BOUNDARY"),
            required_zetaris_tables=[
                "zetaris_wire.rtp_transfer_ledger",
                "zetaris_cyber.device_ip_sessions",
                "zetaris_kyc.account_profiles",
                "zetaris_crypto.offramp_orders",
            ],
            fast_scout_model=self.fast_model,
            deep_arbiter_model=self.deep_model,
        )
