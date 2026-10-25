"""
Meterless Engine 02: World Model (agent/engines/world_model.py).
Maintains the live Tree-of-Hops reasoning graph across parallel scouts and
deep pruning critics:
  - Hop nodes and directed transfer edges with Zetaris tx_id provenance
  - Active search frontier vs backtracked/pruned innocent bystander branches
  - Cross-branch re-convergence hubs (where split mule streams reunite)
  - FIFO tainted-dollar conservation ledger
  - Optimistic concurrency locking (expected_version) preventing lost updates
"""

from typing import Any, Dict, List, Optional


class ConcurrencyConflictError(RuntimeError):
    """Raised when an agent attempts a stale state mutation on the World Model."""


class WorldModelEngine:
    def __init__(self) -> None:
        self.version: int = 0
        self.nodes: Dict[str, Dict[str, Any]] = {}
        self.edges: List[Dict[str, Any]] = []
        self.active_frontier: List[str] = []
        self.pruned_branches: List[Dict[str, Any]] = []
        self.convergence_hubs: Dict[str, Dict[str, Any]] = {}
        self.tainted_balance_usd: Dict[str, int] = {}
        self.mutation_log: List[Dict[str, Any]] = []

    def _bump(self, agent_name: str, action: str, expected_version: Optional[int] = None) -> int:
        if expected_version is not None and expected_version != self.version:
            raise ConcurrencyConflictError(
                f"WorldModel optimistic lock conflict for {agent_name}: "
                f"expected v{expected_version}, actual v{self.version}."
            )
        self.version += 1
        self.mutation_log.append(
            {"version": self.version, "agent": agent_name, "action": action}
        )
        return self.version

    def seed_victim_root(
        self,
        account_id: str,
        stolen_usd: int,
        agent_name: str,
        expected_version: Optional[int] = None,
    ) -> int:
        self.nodes[account_id] = {
            "account_id": account_id,
            "role": "VICTIM_ROOT",
            "hop": 0,
            "status": "ORIGIN",
            "inbound_branches": ["ROOT"],
        }
        self.tainted_balance_usd[account_id] = stolen_usd
        self.active_frontier = [account_id]
        return self._bump(agent_name, f"seed_root:{account_id}:${stolen_usd}", expected_version)

    def record_hop_edge(
        self,
        tx_row: Dict[str, Any],
        agent_name: str,
        expected_version: Optional[int] = None,
    ) -> int:
        src = tx_row["from_acct"]
        dst = tx_row["to_acct"]
        taint = int(tx_row["tainted_fifo_usd"])
        hop = int(tx_row["hop"])
        branch = str(tx_row["branch"])

        self.edges.append(
            {
                "tx_id": tx_row["tx_id"],
                "hop": hop,
                "branch": branch,
                "from_acct": src,
                "to_acct": dst,
                "amount_usd": int(tx_row["amount_usd"]),
                "tainted_fifo_usd": taint,
                "elapsed_sec": int(tx_row["elapsed_sec"]),
                "rail": tx_row["rail"],
                "source_table": "zetaris_wire.rtp_transfer_ledger",
            }
        )

        # Conservation update: move FIFO taint from src to dst when tracked
        if src in self.tainted_balance_usd:
            self.tainted_balance_usd[src] = max(0, self.tainted_balance_usd[src] - taint)
        self.tainted_balance_usd[dst] = self.tainted_balance_usd.get(dst, 0) + taint

        existing = self.nodes.get(dst)
        if existing:
            if branch not in existing["inbound_branches"]:
                existing["inbound_branches"].append(branch)
            existing["hop"] = max(existing["hop"], hop)
            if len(existing["inbound_branches"]) >= 2:
                existing["role"] = "CONVERGENCE_HUB"
                self.convergence_hubs[dst] = {
                    "hub_account": dst,
                    "merged_branches": list(existing["inbound_branches"]),
                    "converged_taint_usd": self.tainted_balance_usd[dst],
                    "hop": existing["hop"],
                }
        else:
            self.nodes[dst] = {
                "account_id": dst,
                "role": "FRONTIER_CANDIDATE",
                "hop": hop,
                "status": "ACTIVE",
                "inbound_branches": [branch],
            }

        if src in self.active_frontier:
            self.active_frontier.remove(src)
        if dst not in self.active_frontier and self.nodes[dst]["status"] == "ACTIVE":
            self.active_frontier.append(dst)

        return self._bump(
            agent_name, f"hop_edge:{tx_row['tx_id']}:{src}->{dst}:${taint}", expected_version
        )

    def prune_and_backtrack_branch(
        self,
        account_id: str,
        branch: str,
        holder_name: str,
        protected_bystanders: int,
        bystander_label: str,
        legit_pool_usd: int,
        reason: str,
        agent_name: str,
        expected_version: Optional[int] = None,
    ) -> int:
        if account_id in self.nodes:
            self.nodes[account_id]["status"] = "BACKTRACKED_SAFEGUARD"
            self.nodes[account_id]["role"] = "INNOCENT_BYSTANDER_PRUNED"
        if account_id in self.active_frontier:
            self.active_frontier.remove(account_id)

        self.pruned_branches.append(
            {
                "account_id": account_id,
                "branch": branch,
                "holder_name": holder_name,
                "protected_bystanders": protected_bystanders,
                "bystander_label": bystander_label,
                "legit_pool_usd": legit_pool_usd,
                "action": "BACKTRACKED_NO_FREEZE",
                "reason": reason,
            }
        )
        return self._bump(
            agent_name, f"backtrack_prune:{account_id}:saved_{protected_bystanders}", expected_version
        )

    def snapshot(self) -> Dict[str, Any]:
        total_bystanders_saved = sum(
            p["protected_bystanders"] for p in self.pruned_branches
        )
        return {
            "version": self.version,
            "node_count": len(self.nodes),
            "edge_count": len(self.edges),
            "active_frontier": list(self.active_frontier),
            "pruned_branch_count": len(self.pruned_branches),
            "pruned_branches": list(self.pruned_branches),
            "total_bystanders_protected": total_bystanders_saved,
            "convergence_hubs": list(self.convergence_hubs.values()),
            "tainted_balance_usd": dict(self.tainted_balance_usd),
            "nodes": list(self.nodes.values()),
            "edges": list(self.edges),
        }
