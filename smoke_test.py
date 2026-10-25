#!/usr/bin/env python3
"""
smoke_test.py: Official Participant Setup Guide Page 24 Data + Power verification.
Checks:
  1. Data: Zetaris web interface / catalog
  2. Data: Zetaris runs SQL over its REST API (SELECT 1 + pokeapi.pikachu_abilities_table)
  3. Power: NVIDIA Nemotron replies via Meterless Nightshift
"""

import json
import os
import sys
import urllib.request

from agent.config import MuleTraceConfig, load_env_file
from agent.llm import NightshiftNemotronClient
from agent.tools_zetaris import ZetarisClient

load_env_file()
FORCE_LIVE = "--live" in sys.argv
cfg = MuleTraceConfig.from_env(force_sample_mode=False if FORCE_LIVE else None)
results = []


def check(name, fn):
    try:
        detail = fn() or ""
        results.append(("PASS", name, detail))
    except Exception as exc:
        results.append(("FAIL", name, str(exc)[:160]))


def check_zetaris_web():
    if cfg.sample_mode:
        z = ZetarisClient(cfg)
        dbs = z.run_sql("SHOW LIGHTNING DATABASES")
        assert dbs.row_count >= 5, "Expected 5 virtualized Zetaris schemas"
        return "(sample-virtualized: 5 schemas)"
    req = urllib.request.Request(cfg.zetaris_base_url, method="GET")
    with urllib.request.urlopen(req, timeout=15) as resp:
        assert resp.status == 200
    return f"({cfg.zetaris_base_url})"


def check_zetaris_sql():
    z = ZetarisClient(cfg)
    one = z.run_sql("SELECT 1 AS one")
    assert one.row_count == 1
    pika = z.run_sql(
        "SELECT pokemon_name, ability_name, is_hidden FROM pokeapi.pikachu_abilities_table"
    )
    assert pika.row_count == 2
    return f"(SELECT 1 -> 1, pikachu rows -> {pika.row_count})"


def check_nemotron():
    if cfg.sample_mode:
        ns = NightshiftNemotronClient(cfg)
        txt, rcpt = ns.run_agent_step(
            step_name="Smoke Check",
            agent_name="Smoke Verifier",
            lane="fast",
            system_prompt="Reply ready",
            user_prompt="ping",
            deterministic_builder=lambda: "ready",
        )
        assert txt == "ready"
        return f"(model_handled_by={rcpt.model_handled_by}, provider={rcpt.provider})"

    base_url = os.environ.get("METERLESS_BASE_URL") or os.environ.get("MODEL_BASE_URL")
    api_key = os.environ.get("METERLESS_RUNTIME_TOKEN") or os.environ.get("MODEL_API_KEY")
    model_id = os.environ.get("NEMOTRON_MODEL") or cfg.nemotron_fast_model
    assert base_url and api_key, "Missing Nightshift URL or Runtime Token"
    body = json.dumps(
        {
            "model": model_id,
            "messages": [{"role": "user", "content": "Reply with the single word: ready"}],
        }
    ).encode("utf-8")
    req = urllib.request.Request(
        base_url.rstrip("/") + "/chat/completions",
        data=body,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "meterless-app": cfg.meterless_app_name,
            "meterless-scope": "user",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        reply = json.loads(resp.read().decode("utf-8"))
    assert reply.get("choices")
    return f"(model_handled_by={reply.get('model', model_id)})"


if __name__ == "__main__":
    check("Data: Zetaris web interface", check_zetaris_web)
    check("Data: Zetaris runs SQL over its REST API", check_zetaris_sql)
    check("Power: Nemotron replies", check_nemotron)

    failed = False
    for status, name, detail in results:
        print(f"{status} {name} {detail}".rstrip())
        if status == "FAIL":
            failed = True
    sys.exit(1 if failed else 0)
