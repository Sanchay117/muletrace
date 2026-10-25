import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PALETTE, TYPE } from "../theme";

export const Act2TreeBacktrack: React.FC<{ lines: any[] }> = ({ lines }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const l2Start = lines[1]?.startFrame ?? 190;
  const l3Start = lines[2]?.startFrame ?? 390;
  const pruneFrame = l2Start + 22;
  const lockFrame = l3Start + 68;

  const r1Prog = interpolate(frame, [18, pruneFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const pruneSpring = spring({
    frame: frame - pruneFrame,
    fps,
    config: { damping: 13, stiffness: 200 },
  });

  const convergeProg = interpolate(frame, [l3Start - 6, lockFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const lockSpring = spring({
    frame: frame - lockFrame,
    fps,
    config: { damping: 14, stiffness: 180 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.vault, fontFamily: TYPE.sans, color: PALETTE.chalk }}>
      <Sequence from={pruneFrame} layout="none">
        <Audio src={staticFile("sfx/snip.wav")} volume={0.7} />
      </Sequence>
      <Sequence from={lockFrame} layout="none">
        <Audio src={staticFile("sfx/vault.wav")} volume={0.75} />
      </Sequence>

      {/* Top Bar */}
      <div
        style={{
          position: "absolute",
          top: 44,
          left: 76,
          right: 76,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              background: PALETTE.cyanBright,
              color: PALETTE.vault,
              fontFamily: TYPE.mono,
              fontSize: 13,
              fontWeight: 900,
            }}
          >
            01 DATA + TREE SEARCH // ZETARIS FEDERATED SQL
          </div>
          <span style={{ fontFamily: TYPE.mono, fontSize: 13.5, color: PALETTE.chalkMuted }}>
            POST /api/v1.0/sql-editor/sqls/run · X-Org-ID: 1 · SINGLE-STATEMENT CONTRACT
          </span>
        </div>
        <div
          style={{
            padding: "6px 16px",
            borderRadius: 999,
            background: "rgba(16,185,129,0.14)",
            border: `1px solid ${PALETTE.emeraldBright}`,
            fontFamily: TYPE.mono,
            fontSize: 13,
            color: "#6EE7B7",
          }}
        >
          INTERCEPT CLOCK: 146s / 240s (94s BUFFER)
        </div>
      </div>

      {/* 4 Zetaris Schema Badges */}
      <div
        style={{
          position: "absolute",
          top: 104,
          left: 76,
          right: 76,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
        }}
      >
        {[
          { s: "zetaris_wire.rtp_transfer_ledger", v: "13 MULTI-HOP EDGES", c: PALETTE.cyanBright },
          { s: "zetaris_cyber.device_ip_sessions", v: "EMU-NOX-77 · 19s CADENCE", c: PALETTE.violetBright },
          { s: "zetaris_kyc.account_profiles", v: "42 NURSES PAYROLL VERIFIED", c: PALETTE.amberBright },
          { s: "zetaris_crypto.offramp_orders", v: "OFFRAMP-KRK-991 ($101.5K)", c: PALETTE.emeraldBright },
        ].map((item) => (
          <div
            key={item.s}
            style={{
              background: PALETTE.vaultCard,
              border: `1.5px solid ${PALETTE.vaultBorder}`,
              borderRadius: 16,
              padding: "13px 18px",
            }}
          >
            <div style={{ fontFamily: TYPE.mono, fontSize: 12, color: item.c, fontWeight: 800 }}>{item.s}</div>
            <div style={{ fontSize: 15, fontWeight: 800, marginTop: 4 }}>{item.v}</div>
          </div>
        ))}
      </div>

      {/* Main Directed Acyclic Graph (Tree-of-Hops + Prune + Re-Convergence) */}
      <div
        style={{
          position: "absolute",
          top: 204,
          left: 76,
          right: 76,
          bottom: 108,
          background: PALETTE.vaultCard,
          borderRadius: 28,
          border: `1.5px solid ${PALETTE.vaultBorder}`,
          padding: "26px 34px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 26, fontWeight: 900 }}>
            Speculative <span style={{ color: PALETTE.cyanBright }}>Fan-Out Scouting</span>,{" "}
            <span style={{ color: PALETTE.amberBright }}>Innocent-Branch Backtracking</span> &amp;{" "}
            <span style={{ color: PALETTE.emeraldBright }}>Hop-6 Re-Convergence</span>
          </div>
          <div style={{ fontFamily: TYPE.mono, fontSize: 13, color: PALETTE.chalkMuted }}>
            WORLD MODEL FIFO TAINT CONSERVATION
          </div>
        </div>

        <svg width="1690" height="610" viewBox="0 0 1690 610">
          {/* Fan-Out Edges (Hops 1-2) */}
          <path
            d="M 225 305 C 300 305, 320 115, 420 115"
            fill="none"
            stroke={PALETTE.cyanBright}
            strokeWidth="4.5"
            opacity={r1Prog}
          />
          <line
            x1="225"
            y1="305"
            x2="420"
            y2="305"
            stroke={frame >= pruneFrame ? PALETTE.amberBright : PALETTE.cyanBright}
            strokeWidth="4.5"
            strokeDasharray={frame >= pruneFrame ? "9 7" : "none"}
            opacity={r1Prog}
          />
          <path
            d="M 225 305 C 300 305, 320 495, 420 495"
            fill="none"
            stroke={PALETTE.cyanBright}
            strokeWidth="4.5"
            opacity={r1Prog}
          />

          {/* Deep Chase & Re-Convergence Edges (Hops 3-6) */}
          <path
            d="M 700 115 L 980 115 C 1085 115, 1110 305, 1195 305"
            fill="none"
            stroke={PALETTE.emeraldBright}
            strokeWidth="5"
            strokeDasharray="620"
            strokeDashoffset={620 * (1 - convergeProg)}
          />
          <path
            d="M 700 495 L 980 495 C 1085 495, 1110 305, 1195 305"
            fill="none"
            stroke={PALETTE.emeraldBright}
            strokeWidth="5"
            strokeDasharray="620"
            strokeDashoffset={620 * (1 - convergeProg)}
          />
          <line
            x1="1415"
            y1="305"
            x2="1465"
            y2="305"
            stroke={PALETTE.emeraldBright}
            strokeWidth="5"
            opacity={convergeProg}
          />

          {/* Origin Node */}
          <g transform="translate(24, 252)">
            <rect width="200" height="106" rx="20" fill={PALETTE.vaultElevated} stroke={PALETTE.crimsonBright} strokeWidth="2.5" />
            <text x="20" y="34" fill={PALETTE.crimsonBright} fontSize="12" fontFamily="monospace" fontWeight="bold">
              HOP 0 · VICTIM WIRE
            </text>
            <text x="20" y="64" fill="#FFFFFF" fontSize="24" fontWeight="900">
              $120,000
            </text>
            <text x="20" y="88" fill={PALETTE.chalkMuted} fontSize="13" fontFamily="monospace">
              ACCT-VIC-101
            </text>
          </g>

          {/* Branch A Active Mule Relay */}
          <g transform="translate(420, 62)" opacity={r1Prog}>
            <rect width="280" height="106" rx="20" fill={PALETTE.vaultElevated} stroke={PALETTE.cyanBright} strokeWidth="2" />
            <text x="20" y="34" fill={PALETTE.cyanBright} fontSize="12" fontFamily="monospace" fontWeight="bold">
              BRANCH A · NEMOTRON 30B SCOUT
            </text>
            <text x="20" y="62" fill="#FFFFFF" fontSize="19" fontWeight="800">
              $52,000 FIFO Taint
            </text>
            <text x="20" y="86" fill={PALETTE.chalkMuted} fontSize="12.5" fontFamily="monospace">
              Hops 1..4 · EMU-NOX-77
            </text>
          </g>

          {/* Branch B Innocent Payroll Pool -> Pruned by Nemotron 120B */}
          <g transform="translate(420, 245)" opacity={r1Prog}>
            <rect
              width="496"
              height="120"
              rx="20"
              fill={frame >= pruneFrame ? "#231A0B" : PALETTE.vaultElevated}
              stroke={frame >= pruneFrame ? PALETTE.amberBright : PALETTE.cyanBright}
              strokeWidth="2.5"
            />
            <text x="22" y="34" fill={PALETTE.amberBright} fontSize="12" fontFamily="monospace" fontWeight="bold">
              BRANCH B · ACCT-PAY-402 (BAYVIEW CLINIC)
            </text>
            <text x="22" y="64" fill="#FFFFFF" fontSize="19" fontWeight="800">
              $294,000 Verified Payroll · 42 Nurses
            </text>
            <text x="22" y="92" fill="#FDE68A" fontSize="12.5" fontFamily="monospace">
              {frame >= pruneFrame
                ? "PRUNED & BACKTRACKED BY NEMOTRON 120B -> 0 FALSE FREEZES"
                : "Auditing zetaris_kyc.account_profiles..."}
            </text>
          </g>

          {/* Amber Backtrack Shield Badge */}
          {frame >= pruneFrame && (
            <g transform={`translate(355, 305) scale(${pruneSpring})`}>
              <circle r="28" fill={PALETTE.amberBright} />
              <text x="0" y="7" textAnchor="middle" fill={PALETTE.vault} fontSize="22" fontWeight="900">
                ↺
              </text>
            </g>
          )}

          {/* Branch C Active Mule Relay */}
          <g transform="translate(420, 442)" opacity={r1Prog}>
            <rect width="280" height="106" rx="20" fill={PALETTE.vaultElevated} stroke={PALETTE.cyanBright} strokeWidth="2" />
            <text x="20" y="34" fill={PALETTE.cyanBright} fontSize="12" fontFamily="monospace" fontWeight="bold">
              BRANCH C · NEMOTRON 30B SCOUT
            </text>
            <text x="20" y="62" fill="#FFFFFF" fontSize="19" fontWeight="800">
              $47,500 FIFO Taint
            </text>
            <text x="20" y="86" fill={PALETTE.chalkMuted} fontSize="12.5" fontFamily="monospace">
              Hops 1..4 · AS209854
            </text>
          </g>

          {/* Hop 3-4 Layering Relay Pills */}
          <g transform="translate(765, 82)" opacity={convergeProg}>
            <rect width="195" height="66" rx="14" fill="#0D2622" stroke={PALETTE.emeraldBright} strokeWidth="1.8" />
            <text x="97" y="29" textAnchor="middle" fill="#6EE7B7" fontSize="11" fontFamily="monospace" fontWeight="bold">
              HOPS 3-4 LAYER
            </text>
            <text x="97" y="49" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="800">
              MULE-401 -&gt; 501
            </text>
          </g>
          <g transform="translate(765, 462)" opacity={convergeProg}>
            <rect width="195" height="66" rx="14" fill="#0D2622" stroke={PALETTE.emeraldBright} strokeWidth="1.8" />
            <text x="97" y="29" textAnchor="middle" fill="#6EE7B7" fontSize="11" fontFamily="monospace" fontWeight="bold">
              HOPS 3-4 LAYER
            </text>
            <text x="97" y="49" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="800">
              MULE-403 -&gt; 503
            </text>
          </g>

          {/* Hop 5 Re-Convergence Hub */}
          <g transform="translate(1195, 246)" opacity={Math.max(0.25, convergeProg)}>
            <rect width="220" height="118" rx="20" fill="#0B2922" stroke={PALETTE.emeraldBright} strokeWidth="2.5" />
            <text x="20" y="34" fill="#6EE7B7" fontSize="12" fontFamily="monospace" fontWeight="bold">
              HOP 5 · CONVERGENCE
            </text>
            <text x="20" y="64" fill="#FFFFFF" fontSize="20" fontWeight="900">
              ACCT-HUB-889
            </text>
            <text x="20" y="92" fill="#A7F3D0" fontSize="13" fontFamily="monospace">
              A + C Reunited ($99.5K)
            </text>
          </g>

          {/* Hop 6 Final Kraken Off-Ramp Lock */}
          <g
            transform={`translate(1465, 225) scale(${frame >= lockFrame ? 0.96 + 0.04 * lockSpring : 1})`}
            opacity={Math.max(0.25, convergeProg)}
          >
            <rect
              width="205"
              height="160"
              rx="22"
              fill={frame >= lockFrame ? "#064E3B" : PALETTE.vaultElevated}
              stroke={PALETTE.emeraldBright}
              strokeWidth="3"
            />
            <text x="102" y="36" textAnchor="middle" fill="#A7F3D0" fontSize="12" fontFamily="monospace" fontWeight="bold">
              HOP 6 · SURGICAL FREEZE
            </text>
            <text x="102" y="80" textAnchor="middle" fill="#FFFFFF" fontSize="34" fontWeight="900">
              $101.5K
            </text>
            <text x="102" y="108" textAnchor="middle" fill="#6EE7B7" fontSize="13" fontFamily="monospace" fontWeight="bold">
              84.6% RECOVERED
            </text>
            <text x="102" y="136" textAnchor="middle" fill="#FFFFFF" fontSize="12.5" fontFamily="monospace">
              94s BEFORE FINALITY
            </text>
          </g>
        </svg>
      </div>
    </AbsoluteFill>
  );
};
