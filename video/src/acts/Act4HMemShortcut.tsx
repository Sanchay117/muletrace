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

export const Act4HMemShortcut: React.FC<{ lines: any[] }> = ({ lines }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const l2Start = lines[1]?.startFrame ?? 262;
  const l3Start = lines[2]?.startFrame ?? 616;
  const zapFrame = l2Start + 38;
  const inEscrow = frame >= l3Start;

  const coldProg = interpolate(frame, [18, l2Start - 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const zapProg = interpolate(frame, [zapFrame, zapFrame + 48], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });

  const escrowSpring = spring({
    frame: frame - l3Start,
    fps,
    config: { damping: 16, stiffness: 115 },
  });

  const confDial = Math.round(
    interpolate(frame, [l3Start + 14, l3Start + 72], [0, 64], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    })
  );

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.vault, fontFamily: TYPE.sans, color: PALETTE.chalk }}>
      <Sequence from={zapFrame} layout="none">
        <Audio src={staticFile("sfx/zap.wav")} volume={0.7} />
      </Sequence>
      <Sequence from={l3Start + 4} layout="none">
        <Audio src={staticFile("sfx/shutter.wav")} volume={0.38} />
      </Sequence>

      {/* Top Bar */}
      <div
        style={{
          position: "absolute",
          top: 46,
          left: 80,
          right: 80,
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
              background: inEscrow ? PALETTE.amberBright : PALETTE.violetBright,
              color: PALETTE.vault,
              fontFamily: TYPE.mono,
              fontSize: 13,
              fontWeight: 900,
            }}
          >
            {inEscrow ? "FIDUCIARY CONFIDENCE GATE (<80%)" : "CROSS-SESSION H-MEM SELF-EVOLUTION"}
          </div>
          <span style={{ fontFamily: TYPE.mono, fontSize: 14, color: PALETTE.chalkMuted }}>
            {inEscrow
              ? "CASE-04 · OMNIBUS TITLE ESCROW SUB-LEDGER LIEN"
              : "RUN 1 (6 HOPS, 146s) -> RUN 2 WITH H-MEM (2 HOPS, 48s)"}
          </span>
        </div>
        <div
          style={{
            padding: "6px 16px",
            borderRadius: 999,
            border: `1.5px solid ${inEscrow ? PALETTE.amberBright : PALETTE.emeraldBright}`,
            fontFamily: TYPE.mono,
            fontSize: 13,
            fontWeight: 800,
            color: inEscrow ? "#FDE68A" : "#6EE7B7",
          }}
        >
          {inEscrow ? "4 HOME CLOSINGS PROTECTED" : "3.1x INTERCEPT SPEEDUP"}
        </div>
      </div>

      {/* 3-Pillar Architecture Ribbon */}
      <div
        style={{
          position: "absolute",
          top: 108,
          left: 80,
          right: 80,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 18,
        }}
      >
        {[
          {
            k: "STAGE 01 // RING FINGERPRINT COMMIT",
            v: "EMU-NOX-77 + AS209854 + 19s split cadence saved",
            active: !inEscrow && frame < l2Start,
            c: PALETTE.cyanBright,
          },
          {
            k: "STAGE 02 // H-MEM 2-HOP FASTPATH",
            v: "Skips Hops 2-5 directly to Kraken Exit in 48s ($79.9K)",
            active: !inEscrow && frame >= l2Start,
            c: PALETTE.violetBright,
          },
          {
            k: "STAGE 03 // CALIBRATED ESCROW GATE",
            v: "64% < 80% gate -> narrow $64K hold inside $1.42M pool",
            active: inEscrow,
            c: PALETTE.amberBright,
          },
        ].map((p) => (
          <div
            key={p.k}
            style={{
              padding: "14px 20px",
              borderRadius: 16,
              background: p.active ? PALETTE.vaultElevated : PALETTE.vaultCard,
              border: `2px solid ${p.active ? p.c : PALETTE.vaultBorder}`,
            }}
          >
            <div style={{ fontFamily: TYPE.mono, fontSize: 11.5, color: p.c, fontWeight: 800 }}>{p.k}</div>
            <div style={{ fontSize: 14.5, fontWeight: 700, marginTop: 4 }}>{p.v}</div>
          </div>
        ))}
      </div>

      {!inEscrow ? (
        /* PHASE A: COLD START (6 HOPS) VS WARM H-MEM RECALL (2 HOPS) */
        <div
          style={{
            position: "absolute",
            top: 208,
            left: 80,
            right: 80,
            bottom: 108,
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {/* Run 1 Card */}
          <div
            style={{
              flex: 1,
              background: PALETTE.vaultCard,
              borderRadius: 24,
              border: `1.5px solid ${PALETTE.vaultBorder}`,
              padding: "24px 34px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 900 }}>
                Run 1 (Cold Start · CASE-01): Full 6-Hop Exploration Writes{" "}
                <span style={{ color: PALETTE.cyanBright }}>HMEM-RING-7701</span>
              </div>
              <div style={{ fontFamily: TYPE.mono, fontSize: 16, color: PALETTE.chalkMuted, fontWeight: 800 }}>
                6 HOPS · 146 SECONDS
              </div>
            </div>

            <svg width="1660" height="130" viewBox="0 0 1660 130">
              <line x1="90" y1="65" x2="1540" y2="65" stroke={PALETTE.cyanBright} strokeWidth="4" strokeDasharray="1450" strokeDashoffset={1450 * (1 - coldProg)} />
              {["VICTIM", "HOP 1", "HOP 2", "HOP 3", "HOP 4", "HOP 5 HUB", "KRK EXIT"].map((lbl, i) => {
                const cx = 90 + i * 241;
                const lit = coldProg >= i / 6.2;
                return (
                  <g key={lbl} transform={`translate(${cx}, 65)`}>
                    <rect x="-72" y="-28" width="144" height="56" rx="14" fill={lit ? PALETTE.vaultElevated : "#080E1B"} stroke={lit ? PALETTE.cyanBright : "#334155"} strokeWidth="2" />
                    <text x="0" y="5" textAnchor="middle" fill={lit ? "#FFFFFF" : "#64748B"} fontSize="13" fontFamily="monospace" fontWeight="bold">
                      {lbl}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Run 2 H-MEM Shortcut Card */}
          <div
            style={{
              flex: 1.25,
              background: PALETTE.vaultCard,
              borderRadius: 24,
              border: `2px solid ${frame >= l2Start ? PALETTE.violetBright : PALETTE.vaultBorder}`,
              padding: "24px 34px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 900 }}>
                Run 2 (Repeat Hit · CASE-03):{" "}
                <span style={{ color: PALETTE.violetBright }}>H-MEM Shortcut Skips 4 Intermediate Hops</span>
              </div>
              <div style={{ fontFamily: TYPE.mono, fontSize: 20, color: PALETTE.emeraldBright, fontWeight: 900 }}>
                2 HOPS · 48s · $79,900 LOCKED
              </div>
            </div>

            <svg width="1660" height="210" viewBox="0 0 1660 210">
              {/* Hop 0 -> Hop 1 */}
              <line x1="90" y1="145" x2="331" y2="145" stroke={PALETTE.violetBright} strokeWidth="5" opacity={frame >= l2Start ? 1 : 0.25} />

              {/* Glowing H-MEM Arc Jumping Over Hops 2-5 Straight to Exit */}
              <path
                d="M 331 130 C 620 -25, 1220 -25, 1536 130"
                fill="none"
                stroke={PALETTE.emeraldBright}
                strokeWidth="6"
                strokeDasharray="1350"
                strokeDashoffset={1350 * (1 - zapProg)}
              />

              {zapProg > 0.35 && (
                <g transform="translate(935, 36)">
                  <rect x="-215" y="-22" width="430" height="44" rx="22" fill="#1E1038" stroke={PALETTE.violetBright} strokeWidth="2" />
                  <text x="0" y="5" textAnchor="middle" fill="#DDD6FE" fontSize="13" fontFamily="monospace" fontWeight="bold">
                    H-MEM MATCH: EMU-NOX-77 -&gt; SKIP HOPS 2..5!
                  </text>
                </g>
              )}

              {["VICTIM $85K", "HOP 1 MATCH", "SKIPPED", "SKIPPED", "SKIPPED", "SKIPPED", "KRK $79.9K"].map((lbl, i) => {
                const cx = 90 + i * 241;
                const skipped = i >= 2 && i <= 5;
                const endHit = i === 6 && zapProg > 0.85;
                return (
                  <g key={i} transform={`translate(${cx}, 145)`} opacity={skipped ? 0.28 : 1}>
                    <rect
                      x="-76"
                      y="-30"
                      width="152"
                      height="60"
                      rx="14"
                      fill={endHit ? "#064E3B" : PALETTE.vaultElevated}
                      stroke={endHit ? PALETTE.emeraldBright : skipped ? "#334155" : PALETTE.violetBright}
                      strokeWidth={endHit ? "3" : "2"}
                    />
                    <text x="0" y="5" textAnchor="middle" fill={skipped ? "#64748B" : "#FFFFFF"} fontSize="12.5" fontFamily="monospace" fontWeight="bold">
                      {lbl}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      ) : (
        /* PHASE B: CASE-04 OMNIBUS TITLE-ESCROW 64% ABSTENTION GATE */
        <div
          style={{
            position: "absolute",
            top: 208,
            left: 80,
            right: 80,
            bottom: 108,
            opacity: escrowSpring,
            transform: `translateY(${(1 - escrowSpring) * 35}px)`,
            display: "grid",
            gridTemplateColumns: "1.15fr 0.85fr",
            gap: 28,
          }}
        >
          {/* Left Omnibus Escrow Breakdown */}
          <div
            style={{
              background: PALETTE.vaultCard,
              borderRadius: 28,
              border: `2px solid ${PALETTE.amberBright}`,
              padding: "36px 40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontFamily: TYPE.mono, fontSize: 13, color: PALETTE.amberBright, fontWeight: 800 }}>
                CASE-04 · PACIFIC COAST LICENSED TITLE ESCROW (ACCT-ESCROW-610)
              </div>
              <h2 style={{ fontSize: 36, fontWeight: 900, marginTop: 8, lineHeight: 1.15 }}>
                Co-Mingled $1.42M Fiduciary Pool Triggers Surgical Sub-Ledger Lien
              </h2>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: TYPE.mono, fontSize: 13, marginBottom: 10 }}>
                <span style={{ color: "#6EE7B7" }}>4 INNOCENT FAMILY HOME CLOSINGS: $1,420,000 (UNTOUCHED)</span>
                <span style={{ color: PALETTE.amberBright }}>TAINTED SLICE: $64,000</span>
              </div>
              <div style={{ height: 48, borderRadius: 16, overflow: "hidden", display: "flex", border: "2px solid #334155" }}>
                <div
                  style={{
                    width: "88%",
                    background: "rgba(16, 185, 129, 0.22)",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: 20,
                    fontFamily: TYPE.mono,
                    fontSize: 14,
                    fontWeight: 800,
                    color: "#A7F3D0",
                  }}
                >
                  $1,420,000 LEGITIMATE ESCROW WIRES CLEAR ON TIME
                </div>
                <div
                  style={{
                    width: "12%",
                    background: PALETTE.amberBright,
                    color: PALETTE.vault,
                    display: "grid",
                    placeItems: "center",
                    fontFamily: TYPE.mono,
                    fontSize: 13,
                    fontWeight: 900,
                  }}
                >
                  $64K HOLD
                </div>
              </div>
            </div>

            <div
              style={{
                padding: "18px 22px",
                borderRadius: 18,
                background: "rgba(245, 158, 11, 0.12)",
                border: `1.5px solid ${PALETTE.amberBright}`,
                fontSize: 17,
                lineHeight: 1.45,
              }}
            >
              Naive agents freeze the entire <b>$1.48M</b> account and crash 4 family home closings.{" "}
              <b>MuleTrace</b> ring-fences only the <b>$64,000</b> sub-ledger entry.
            </div>
          </div>

          {/* Right Confidence Meter Stopping at 64% (< 80% Hard-Freeze Gate) */}
          <div
            style={{
              background: PALETTE.vaultCard,
              borderRadius: 28,
              border: `1.5px solid ${PALETTE.vaultBorder}`,
              padding: "36px 36px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div style={{ fontFamily: TYPE.mono, fontSize: 13, color: PALETTE.amberBright, fontWeight: 800 }}>
              ATTRIBUTION CONFIDENCE METER (HARD-FREEZE GATE: 80%)
            </div>

            <svg width="360" height="200" viewBox="0 0 360 200">
              <path
                d="M 40 172 A 140 140 0 0 1 320 172"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="24"
                strokeLinecap="round"
              />
              <path
                d="M 40 172 A 140 140 0 0 1 320 172"
                fill="none"
                stroke={PALETTE.amberBright}
                strokeWidth="24"
                strokeLinecap="round"
                strokeDasharray={`${(confDial / 100) * 440} 440`}
              />
              {/* 80% Gate Tick */}
              <line x1="274" y1="95" x2="306" y2="70" stroke={PALETTE.crimsonBright} strokeWidth="4" strokeDasharray="5 3" />
              <text x="314" y="60" textAnchor="middle" fill={PALETTE.crimsonBright} fontSize="12" fontFamily="monospace" fontWeight="bold">
                80% GATE
              </text>
              <text x="180" y="155" textAnchor="middle" fill={PALETTE.amberBright} fontSize="62" fontWeight="900">
                {confDial}%
              </text>
            </svg>

            <div
              style={{
                width: "100%",
                padding: "16px 20px",
                borderRadius: 16,
                background: "#1E160B",
                border: `1.5px solid ${PALETTE.amberBright}`,
              }}
            >
              <div style={{ fontFamily: TYPE.mono, fontSize: 13, fontWeight: 900, color: "#FDE68A" }}>
                ACTION: RING_FENCED_SUBLEDGER_HOLD
              </div>
              <div style={{ fontSize: 15, color: PALETTE.chalkMuted, marginTop: 4 }}>
                100% of $64,000 secured · 0 innocent homebuyers harmed
              </div>
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
