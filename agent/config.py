"""
Configuration loader for MuleTrace (agent/config.py).
Supports both live Zetaris Docker + Meterless Nightshift execution and
zero-setup SAMPLE_MODE=true verification over data/sample/.
"""

import os
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

ROOT_DIR = Path(__file__).resolve().parent.parent
SAMPLE_DIR = ROOT_DIR / "data" / "sample"


def load_env_file(env_path: Optional[Path] = None) -> None:
    target = env_path or (ROOT_DIR / ".env")
    if not target.exists():
        return
    for raw_line in target.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


@dataclass
class MuleTraceConfig:
    sample_mode: bool
    zetaris_base_url: str
    zetaris_rest_url: str
    zetaris_org_id: str
    zetaris_api_key: str
    meterless_base_url: str
    meterless_runtime_token: str
    meterless_app_name: str
    nemotron_fast_model: str
    nemotron_deep_model: str
    hard_freeze_confidence_gate: float = 0.80

    @classmethod
    def from_env(cls, force_sample_mode: Optional[bool] = None) -> "MuleTraceConfig":
        load_env_file()
        zetaris_key = os.environ.get("ZETARIS_API_KEY", "")
        nightshift_tok = (
            os.environ.get("METERLESS_RUNTIME_TOKEN")
            or os.environ.get("MODEL_API_KEY")
            or ""
        )
        env_sample = os.environ.get("SAMPLE_MODE", "true").lower()
        has_live_creds = (
            bool(zetaris_key)
            and "your-" not in zetaris_key
            and bool(nightshift_tok)
            and "your-" not in nightshift_tok
        )
        if force_sample_mode is not None:
            sample_mode = force_sample_mode
        elif env_sample in ("false", "0", "no"):
            sample_mode = False
        else:
            sample_mode = not has_live_creds

        return cls(
            sample_mode=sample_mode,
            zetaris_base_url=os.environ.get("ZETARIS_BASE_URL", "http://localhost:3000"),
            zetaris_rest_url=os.environ.get(
                "ZETARIS_REST_URL", "http://localhost:8888/api/v1.0"
            ),
            zetaris_org_id=os.environ.get("ZETARIS_ORG_ID", "1"),
            zetaris_api_key=zetaris_key,
            meterless_base_url=(
                os.environ.get("METERLESS_BASE_URL")
                or os.environ.get("MODEL_BASE_URL")
                or "http://127.0.0.1:8088/v1"
            ),
            meterless_runtime_token=nightshift_tok,
            meterless_app_name=os.environ.get("METERLESS_APP_NAME", "muletrace-agent"),
            nemotron_fast_model=os.environ.get(
                "METERLESS_FAST_MODEL", "nvidia/nemotron-3.5-lightning-30b-a3b"
            ),
            nemotron_deep_model=os.environ.get(
                "METERLESS_DEEP_MODEL", "nvidia/nemotron-3.5-super-vl-120b-a12b"
            ),
        )
