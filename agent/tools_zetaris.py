"""
Layer 01 DATA: Zetaris Federated SQL Client (agent/tools_zetaris.py).
Implements the Participant Setup Guide Page 11 REST SQL contract:
  POST {ZETARIS_REST_URL}/sql-editor/sqls/run
  Headers: Authorization: Bearer <key>, X-Org-ID: 1, X-Request-ID: <uuid4>
Enforces single-statement SQL execution and provides an in-memory SQLite
multi-schema federation engine when SAMPLE_MODE=true.
"""

import json
import sqlite3
import time
import urllib.request
import uuid
from dataclasses import dataclass
from typing import Any, Dict, List

from .config import MuleTraceConfig, SAMPLE_DIR


class ZetarisGuardrailError(ValueError):
    """Raised when a caller attempts to batch multiple semicolon-separated SQL statements."""


@dataclass
class SQLQueryReceipt:
    request_id: str
    query_id: str
    sql: str
    row_count: int
    rows: List[Dict[str, Any]]
    latency_ms: float
    execution_mode: str

    def to_dict(self) -> Dict[str, Any]:
        return {
            "request_id": self.request_id,
            "query_id": self.query_id,
            "sql": self.sql,
            "row_count": self.row_count,
            "rows": self.rows,
            "latency_ms": round(self.latency_ms, 2),
            "execution_mode": self.execution_mode,
        }


class ZetarisClient:
    def __init__(self, config: MuleTraceConfig) -> None:
        self.config = config
        self._conn = sqlite3.connect(":memory:", check_same_thread=False)
        self._conn.row_factory = sqlite3.Row
        self.query_log: List[SQLQueryReceipt] = []
        if self.config.sample_mode:
            self._bootstrap_sample_schemas()

    def _bootstrap_sample_schemas(self) -> None:
        cur = self._conn.cursor()
        for schema in (
            "zetaris_wire",
            "zetaris_cyber",
            "zetaris_kyc",
            "zetaris_crypto",
            "pokeapi",
        ):
            cur.execute(f"ATTACH DATABASE ':memory:' AS {schema}")

        self._load_json_table(
            "zetaris_wire", "rtp_transfer_ledger", "rtp_transfer_ledger.json"
        )
        self._load_json_table(
            "zetaris_cyber", "device_ip_sessions", "device_ip_sessions.json"
        )
        self._load_json_table(
            "zetaris_kyc", "account_profiles", "account_profiles.json"
        )
        self._load_json_table(
            "zetaris_crypto", "offramp_orders", "offramp_orders.json"
        )

        cur.execute(
            "CREATE TABLE pokeapi.pikachu_abilities_table "
            "(pokemon_name TEXT, ability_name TEXT, is_hidden BOOLEAN)"
        )
        cur.executemany(
            "INSERT INTO pokeapi.pikachu_abilities_table VALUES (?, ?, ?)",
            [("pikachu", "static", 0), ("pikachu", "lightning-rod", 1)],
        )
        self._conn.commit()

    def _load_json_table(self, schema: str, table: str, filename: str) -> None:
        rows = json.loads((SAMPLE_DIR / filename).read_text(encoding="utf-8"))
        if not rows:
            return
        cols = list(rows[0].keys())
        col_defs = []
        for col in cols:
            val = rows[0][col]
            if isinstance(val, bool):
                sql_type = "INTEGER"
            elif isinstance(val, int):
                sql_type = "INTEGER"
            elif isinstance(val, float):
                sql_type = "REAL"
            else:
                sql_type = "TEXT"
            col_defs.append(f"{col} {sql_type}")
        cur = self._conn.cursor()
        cur.execute(f"CREATE TABLE {schema}.{table} ({', '.join(col_defs)})")
        placeholders = ", ".join("?" for _ in cols)
        cur.executemany(
            f"INSERT INTO {schema}.{table} ({', '.join(cols)}) VALUES ({placeholders})",
            [[r.get(c) for c in cols] for r in rows],
        )

    @staticmethod
    def _enforce_single_statement(sql: str) -> str:
        trimmed = sql.strip()
        if not trimmed:
            raise ZetarisGuardrailError("SQL statement cannot be empty.")
        core = trimmed[:-1].strip() if trimmed.endswith(";") else trimmed
        if ";" in core:
            raise ZetarisGuardrailError(
                "Zetaris REST API requires exactly ONE SQL statement per request; semicolon batching is prohibited."
            )
        return core

    def run_sql(self, sql: str, limit: int = 100) -> SQLQueryReceipt:
        clean_sql = self._enforce_single_statement(sql)
        req_id = str(uuid.uuid4())
        query_id = str(uuid.uuid4())
        t0 = time.perf_counter()

        if self.config.sample_mode:
            rows = self._execute_sample_sql(clean_sql, limit)
            mode = "zetaris-virtualized-sample"
        else:
            rows = self._execute_live_rest(clean_sql, limit, req_id, query_id)
            mode = "zetaris-rest-live"

        elapsed_ms = (time.perf_counter() - t0) * 1000.0
        receipt = SQLQueryReceipt(
            request_id=req_id,
            query_id=query_id,
            sql=clean_sql,
            row_count=len(rows),
            rows=rows,
            latency_ms=elapsed_ms,
            execution_mode=mode,
        )
        self.query_log.append(receipt)
        return receipt

    def _execute_sample_sql(self, sql: str, limit: int) -> List[Dict[str, Any]]:
        upper = sql.upper().strip()
        if upper == "SHOW LIGHTNING DATABASES":
            return [
                {"database_name": "MULETRACE_WIRE", "schema": "zetaris_wire"},
                {"database_name": "MULETRACE_CYBER", "schema": "zetaris_cyber"},
                {"database_name": "MULETRACE_KYC", "schema": "zetaris_kyc"},
                {"database_name": "MULETRACE_CRYPTO", "schema": "zetaris_crypto"},
                {"database_name": "POKEAPI_REST", "schema": "pokeapi"},
            ]
        cur = self._conn.cursor()
        cur.execute(sql)
        fetched = cur.fetchmany(limit)
        return [dict(r) for r in fetched]

    def _execute_live_rest(
        self, sql: str, limit: int, req_id: str, query_id: str
    ) -> List[Dict[str, Any]]:
        url = self.config.zetaris_rest_url.rstrip("/") + "/sql-editor/sqls/run"
        payload = json.dumps(
            {
                "queryId": query_id,
                "sql": sql,
                "source": "SqlEditor",
                "limit": limit,
            }
        ).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=payload,
            headers={
                "Authorization": f"Bearer {self.config.zetaris_api_key}",
                "X-Org-ID": str(self.config.zetaris_org_id),
                "X-Request-ID": req_id,
                "Content-Type": "application/json",
            },
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=30) as resp:
            body = json.loads(resp.read().decode("utf-8"))
        cols = [c.get("name", f"col_{i}") for i, c in enumerate(body.get("schema", []))]
        raw_rows = body.get("data", [])
        if cols:
            return [dict(zip(cols, r)) for r in raw_rows]
        return [{"value": r[0] if isinstance(r, list) and r else r} for r in raw_rows]
