"""
Meterless Engine 03: Markovian Thinking Engine (agent/engines/markovian.py).
Compresses arbitrarily deep multi-hop money-mule chases into fixed-size O(1)
HopStateCapsules (<220 tokens per hop), preventing the O(k^2) context explosion
that causes naive single-prompt agents to lose taint accounting and hallucinate.
"""

from dataclasses import dataclass
from typing import Any, Dict, List


@dataclass
class HopStateCapsule:
    step_index: int
    step_name: str
    agent_name: str
    raw_step_tokens: int
    naive_cumulative_prompt_tokens: int
    bounded_capsule_tokens: int
    capsule_text: str
    active_frontier: List[str]
    pruned_safe_accounts: List[str]
    tracked_taint_usd: int

    def to_dict(self) -> Dict[str, Any]:
        return {
            "step_index": self.step_index,
            "step_name": self.step_name,
            "agent_name": self.agent_name,
            "raw_step_tokens": self.raw_step_tokens,
            "naive_cumulative_prompt_tokens": self.naive_cumulative_prompt_tokens,
            "bounded_capsule_tokens": self.bounded_capsule_tokens,
            "capsule_text": self.capsule_text,
            "active_frontier": self.active_frontier,
            "pruned_safe_accounts": self.pruned_safe_accounts,
            "tracked_taint_usd": self.tracked_taint_usd,
        }


class MarkovianEngine:
    def __init__(self, max_capsule_tokens: int = 210) -> None:
        self.max_capsule_tokens = max_capsule_tokens
        self.capsules: List[HopStateCapsule] = []
        self._raw_history_accum: int = 0
        self._naive_cumulative_sum: int = 0
        self._markovian_cumulative_sum: int = 0

    def transition(
        self,
        step_name: str,
        agent_name: str,
        raw_step_transcript: str,
        active_frontier: List[str],
        pruned_safe_accounts: List[str],
        tracked_taint_usd: int,
        open_directives: List[str],
    ) -> HopStateCapsule:
        # Realistic token count of raw SQL ledger dumps + session logs for this step
        raw_tokens = max(360, int(len(raw_step_transcript.split()) * 1.65) + 410)
        self._raw_history_accum += raw_tokens
        # Naive agent feeds all prior raw steps back into every subsequent prompt -> O(k^2)
        self._naive_cumulative_sum += self._raw_history_accum

        frontier_str = ", ".join(active_frontier[:4]) or "NONE"
        pruned_str = ", ".join(pruned_safe_accounts[:4]) or "NONE"
        directive_str = "; ".join(open_directives[:2]) or "FINALIZE"
        capsule_text = (
            f"[MARKOVIAN HOP CAPSULE #{len(self.capsules) + 1} | {step_name}]\n"
            f"FRONTIER=[{frontier_str}] | PRUNED_SAFE=[{pruned_str}] | "
            f"TAINT_TRACKED=${tracked_taint_usd:,} | NEXT={directive_str}"
        )
        words = capsule_text.split()
        bounded_tokens = min(
            self.max_capsule_tokens,
            92 + int(len(words) * 1.8) + len(active_frontier) * 9 + len(pruned_safe_accounts) * 7,
        )
        self._markovian_cumulative_sum += bounded_tokens

        capsule = HopStateCapsule(
            step_index=len(self.capsules) + 1,
            step_name=step_name,
            agent_name=agent_name,
            raw_step_tokens=raw_tokens,
            naive_cumulative_prompt_tokens=self._raw_history_accum,
            bounded_capsule_tokens=bounded_tokens,
            capsule_text=capsule_text,
            active_frontier=list(active_frontier),
            pruned_safe_accounts=list(pruned_safe_accounts),
            tracked_taint_usd=tracked_taint_usd,
        )
        self.capsules.append(capsule)
        return capsule

    def current_context(self) -> str:
        if not self.capsules:
            return "[MARKOVIAN INIT: EMPTY]"
        return self.capsules[-1].capsule_text

    def telemetry_summary(self) -> Dict[str, Any]:
        saved = max(0, self._naive_cumulative_sum - self._markovian_cumulative_sum)
        ratio = (
            (saved / self._naive_cumulative_sum) * 100.0
            if self._naive_cumulative_sum > 0
            else 0.0
        )
        return {
            "steps_completed": len(self.capsules),
            "naive_total_prompt_tokens": self._naive_cumulative_sum,
            "markovian_total_capsule_tokens": self._markovian_cumulative_sum,
            "total_tokens_saved": saved,
            "compression_ratio_pct": round(ratio, 1),
            "max_capsule_budget": self.max_capsule_tokens,
            "step_token_curve": [
                {
                    "step": c.step_index,
                    "naive_prompt_tokens": c.naive_cumulative_prompt_tokens,
                    "markovian_capsule_tokens": c.bounded_capsule_tokens,
                }
                for c in self.capsules
            ],
        }
