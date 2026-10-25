import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { PALETTE, TYPE } from "../theme";

const NAIVE_STEPS = [940, 2410, 4580, 7120, 9840, 12513];
const MARKOV_STEPS = [142, 154, 158, 156, 151, 148];

export const Act3MarkovianRace: React.FC<{ lines: any[] }> = ({ lines }) => {
  const frame = useCurrentFrame();

  const l2Start = lines[1]?.startFrame ?? 195;
  const l3Start = lines[2]?.startFrame ?? 390;

  const raceProg = interpolate(frame, [20, l2Start + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const wmVersion = Math.round(
    interpolate(frame, [l2Start, l3Start + 60], [1, 16], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const savedPct = interpolate(frame, [l3Start - 10, l3Start + 65], [0, 92.7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PALETTE.porcelain,
        fontFamily: TYPE.sans,
        color: PALETTE.ink,
        backgroundImage: `radial-gradient(${PALETTE.porcelainDot} 1.5px, transparent 1.5px)`,
        backgroundSize: "36px 36px",
      }}
    >
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
              background: PALETTE.violet,
              color: "#FFFFFF",
              fontFamily: TYPE.mono,
              fontSize: 13,
              fontWeight: 900,
            }}
          >
            02 BUILD // CURSOR + 4 METERLESS ENGINES
          </div>
          <span style={{ fontFamily: TYPE.mono, fontSize: 14, color: PALETTE.inkMuted }}>
            BOUNDED O(1) HOP CAPSULES VS O(k^2) PROMPT EXPLOSION
          </span>
        </div>
        <div
          style={{
            padding: "6px 16px",
            borderRadius: 999,
            background: "#FFFFFF",
            border: `1.5px solid ${PALETTE.emerald}`,
            fontFamily: TYPE.mono,
            fontSize: 13,
            fontWeight: 800,
            color: PALETTE.emerald,
          }}
        >
          12,513 NAIVE TOK -&gt; 909 MARKOVIAN TOK (-92.7%)
        </div>
      </div>

      {/* Main Split Grid */}
      <div
        style={{
          position: "absolute",
          top: 118,
          left: 80,
          right: 80,
          bottom: 108,
          display: "grid",
          gridTemplateColumns: "1.14fr 0.86fr",
          gap: 28,
        }}
      >
        {/* Left Card: 6-Hop Token Scaling Chart */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 28,
            border: `2px solid ${PALETTE.porcelainBorder}`,
            padding: "32px 36px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 24px 60px rgba(9, 17, 30, 0.07)",
          }}
        >
          <div>
            <div style={{ fontFamily: TYPE.mono, fontSize: 12.5, fontWeight: 800, color: PALETTE.crimson }}>
              EMPIRICAL CONTEXT SCALING ACROSS 6 REASONING STEPS
            </div>
            <h2 style={{ fontSize: 34, fontWeight: 900, marginTop: 6, letterSpacing: "-0.02em" }}>
              Why Linear Agents Overflow While MuleTrace Stays Flat
            </h2>
          </div>

          <svg width="920" height="470" viewBox="0 0 920 470">
            {/* Context Overflow Danger Line */}
            <line x1="40" y1="125" x2="890" y2="125" stroke={PALETTE.crimson} strokeWidth="2.5" strokeDasharray="8 6" />
            <text x="46" y="112" textAnchor="start" fill={PALETTE.crimson} fontSize="12" fontFamily="monospace" fontWeight="bold">
              TAINT-ACCOUNTING DRIFT &amp; 240s TIMEOUT THRESHOLD
            </text>

            {/* Baseline */}
            <line x1="40" y1="405" x2="890" y2="405" stroke="#CBD5E1" strokeWidth="3" />

            {NAIVE_STEPS.map((nVal, i) => {
              const x = 78 + i * 136;
              const stepAppear = Math.max(0, Math.min(1, raceProg * 6 - i * 0.75));
              const nHeight = (nVal / 13200) * 335 * stepAppear;
              const mVal = MARKOV_STEPS[i];
              const mHeight = Math.max(14, (mVal / 13200) * 335 * 3.2 * stepAppear);
              return (
                <g key={i}>
                  {/* Naive Red Bar */}
                  <rect
                    x={x}
                    y={405 - nHeight}
                    width={42}
                    height={nHeight}
                    rx={8}
                    fill={PALETTE.crimson}
                  />
                  {stepAppear > 0.6 && (
                    <text
                      x={x + 21}
                      y={396 - nHeight}
                      textAnchor="middle"
                      fill={PALETTE.crimson}
                      fontSize="12"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {(nVal / 1000).toFixed(1)}k
                    </text>
                  )}

                  {/* Markovian Flat Green Bar */}
                  <rect
                    x={x + 48}
                    y={405 - mHeight}
                    width={42}
                    height={mHeight}
                    rx={6}
                    fill={PALETTE.emeraldBright}
                  />
                  {stepAppear > 0.6 && (
                    <text
                      x={x + 69}
                      y={396 - mHeight}
                      textAnchor="middle"
                      fill={PALETTE.emerald}
                      fontSize="11.5"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {mVal}
                    </text>
                  )}

                  <text
                    x={x + 45}
                    y={434}
                    textAnchor="middle"
                    fill={PALETTE.ink}
                    fontSize="13"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    STEP {i + 1}
                  </text>
                </g>
              );
            })}
          </svg>

          <div style={{ display: "flex", gap: 28, fontFamily: TYPE.mono, fontSize: 13, fontWeight: 800 }}>
            <span style={{ color: PALETTE.crimson }}>■ NAIVE CUMULATIVE PROMPT: 12,513 TOK (288s TIMEOUT)</span>
            <span style={{ color: PALETTE.emerald }}>■ MARKOVIAN O(1) CAPSULES: 909 TOK (146s LOCKED)</span>
          </div>
        </div>

        {/* Right 2x2 Grid: 4 Meterless Engines */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: 18,
          }}
        >
          <div
            style={{
              background: PALETTE.vault,
              color: "#FFFFFF",
              borderRadius: 24,
              padding: 26,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ fontFamily: TYPE.mono, fontSize: 12, color: PALETTE.cyanBright, fontWeight: 800 }}>
              ENGINE 01 // SCOUT INTENT
            </div>
            <div style={{ fontSize: 38, fontWeight: 900 }}>95 / 100</div>
            <div style={{ fontSize: 14, color: PALETTE.chalkMuted, lineHeight: 1.45 }}>
              Scores 240s exit-window urgency and assigns 3-branch fast scout budget.
            </div>
            <div style={{ fontFamily: TYPE.mono, fontSize: 12, color: PALETTE.cyanBright }}>
              ELDER_RTP_FANOUT_CONVERGENCE
            </div>
          </div>

          <div
            style={{
              background: PALETTE.vault,
              color: "#FFFFFF",
              borderRadius: 24,
              padding: 26,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ fontFamily: TYPE.mono, fontSize: 12, color: PALETTE.violetBright, fontWeight: 800 }}>
              ENGINE 02 // WORLD MODEL
            </div>
            <div style={{ fontSize: 38, fontWeight: 900 }}>State v{wmVersion}</div>
            <div style={{ fontSize: 14, color: PALETTE.chalkMuted, lineHeight: 1.45 }}>
              Graph frontier &amp; FIFO taint conservation with optimistic version locking.
            </div>
            <div style={{ fontFamily: TYPE.mono, fontSize: 12, color: PALETTE.violetBright }}>
              0 LOST PARALLEL UPDATES
            </div>
          </div>

          <div
            style={{
              background: PALETTE.vault,
              color: "#FFFFFF",
              borderRadius: 24,
              padding: 26,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              border: `2px solid ${PALETTE.emeraldBright}`,
            }}
          >
            <div style={{ fontFamily: TYPE.mono, fontSize: 12, color: PALETTE.emeraldBright, fontWeight: 800 }}>
              ENGINE 03 // MARKOVIAN
            </div>
            <div style={{ fontSize: 40, fontWeight: 900, color: PALETTE.emeraldBright }}>
              -{savedPct.toFixed(1)}%
            </div>
            <div style={{ fontSize: 14, color: PALETTE.chalkMuted, lineHeight: 1.45 }}>
              Distills every hop into &lt;210 tokens: active frontier, safe prunes, and taint sum.
            </div>
            <div style={{ fontFamily: TYPE.mono, fontSize: 12, color: "#6EE7B7" }}>
              O(1) HOP MEMORY
            </div>
          </div>

          <div
            style={{
              background: PALETTE.vault,
              color: "#FFFFFF",
              borderRadius: 24,
              padding: 26,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ fontFamily: TYPE.mono, fontSize: 12, color: PALETTE.amberBright, fontWeight: 800 }}>
              ENGINE 04 // H-MEM
            </div>
            <div style={{ fontSize: 30, fontWeight: 900 }}>Ring Vault</div>
            <div style={{ fontSize: 14, color: PALETTE.chalkMuted, lineHeight: 1.45 }}>
              Stores EMU-NOX-77 + AS209854 + 19s split cadence to shortcut repeat hits.
            </div>
            <div style={{ fontFamily: TYPE.mono, fontSize: 12, color: PALETTE.amberBright }}>
              HMEM-RING-7701 PERSISTED
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
