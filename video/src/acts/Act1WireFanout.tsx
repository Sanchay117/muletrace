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

export const Act1WireFanout: React.FC<{ lines: any[] }> = ({ lines }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const l2Start = lines[1]?.startFrame ?? 210;
  const l3Start = lines[2]?.startFrame ?? 430;
  const splitFrame = 58;

  const cardEnter = spring({ frame, fps, config: { damping: 15, stiffness: 105 } });
  const splitProg = interpolate(frame, [splitFrame, splitFrame + 52], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const countdownSec = Math.max(
    182,
    Math.round(interpolate(frame, [10, l3Start + 180], [240, 184], { extrapolateRight: "clamp" }))
  );

  const lossBillions = interpolate(frame, [l2Start - 10, l2Start + 55], [0, 10.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const revealSpring = spring({
    frame: frame - l3Start,
    fps,
    config: { damping: 16, stiffness: 120 },
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
      <Sequence from={splitFrame} layout="none">
        <Audio src={staticFile("sfx/split.wav")} volume={0.65} />
      </Sequence>
      <Sequence from={l3Start + 4} layout="none">
        <Audio src={staticFile("sfx/shutter.wav")} volume={0.4} />
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
              background: PALETTE.ink,
              color: "#FFFFFF",
              fontFamily: TYPE.mono,
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: "0.08em",
            }}
          >
            ACT 01 // THE 240-SECOND SPLIT TRAP
          </div>
          <span style={{ fontFamily: TYPE.mono, fontSize: 14, color: PALETTE.inkMuted }}>
            TRACK 3: REASONING ARCHITECTURE
          </span>
        </div>

        <div
          style={{
            padding: "8px 18px",
            borderRadius: 999,
            background: "rgba(225, 29, 72, 0.1)",
            border: `1.5px solid ${PALETTE.crimson}`,
            fontFamily: TYPE.mono,
            fontSize: 14,
            fontWeight: 900,
            color: PALETTE.crimson,
          }}
        >
          CRYPTO FINALITY WINDOW: {countdownSec}s / 240s
        </div>
      </div>

      {/* Left Stage: Instant Wire Card Shattering into 3 Split Branches */}
      <div
        style={{
          position: "absolute",
          top: 132,
          left: 80,
          width: 1000,
          height: 580,
          transform: `translateY(${(1 - cardEnter) * 40}px)`,
          opacity: cardEnter,
        }}
      >
        {/* Origin RTP Wire Card */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 118,
            width: 390,
            padding: "28px 30px",
            borderRadius: 24,
            background: PALETTE.porcelainCard,
            border: `2px solid ${PALETTE.porcelainBorder}`,
            boxShadow: "0 24px 60px rgba(9, 17, 30, 0.09)",
          }}
        >
          <div style={{ fontFamily: TYPE.mono, fontSize: 12, fontWeight: 800, color: PALETTE.crimson }}>
            INSTANT RTP WIRE · SCAM-9104
          </div>
          <div style={{ fontSize: 48, fontWeight: 900, letterSpacing: "-0.04em", marginTop: 8 }}>
            $120,000
          </div>
          <div style={{ fontSize: 15, color: PALETTE.inkMuted, marginTop: 6, fontWeight: 600 }}>
            Victim: Margaret Chen (ACCT-VIC-101)
          </div>
          <div
            style={{
              marginTop: 18,
              paddingTop: 14,
              borderTop: "1.5px dashed #CBD5E1",
              display: "flex",
              justifyContent: "space-between",
              fontFamily: TYPE.mono,
              fontSize: 12,
              color: PALETTE.inkMuted,
            }}
          >
            <span>RAIL: RTP + FEDNOW</span>
            <span style={{ color: PALETTE.crimson, fontWeight: 800 }}>6 HOPS IN 146s</span>
          </div>
        </div>

        {/* SVG Split Vectors */}
        <svg
          width="320"
          height="460"
          viewBox="0 0 320 460"
          style={{ position: "absolute", left: 390, top: 20 }}
        >
          {[
            { d: "M 0 215 C 120 215, 160 72, 305 72", color: PALETTE.crimson },
            { d: "M 0 215 L 305 215", color: PALETTE.amber },
            { d: "M 0 215 C 120 215, 160 358, 305 358", color: PALETTE.crimson },
          ].map((p, idx) => (
            <path
              key={idx}
              d={p.d}
              fill="none"
              stroke={p.color}
              strokeWidth="4.5"
              strokeDasharray="420"
              strokeDashoffset={420 * (1 - splitProg)}
            />
          ))}
        </svg>

        {/* 3 Outgoing Split Nodes */}
        {[
          {
            top: 38,
            tag: "BRANCH A · MULE RELAY",
            amt: "$54,000",
            sub: "Headless Nox Emulator · 19s Split",
            border: PALETTE.crimson,
          },
          {
            top: 182,
            tag: "BRANCH B · DECOY BYSTANDER TRAP",
            amt: "$18,500",
            sub: "Mixed into 42 Nurses' Clinic Payroll",
            border: PALETTE.amber,
          },
          {
            top: 326,
            tag: "BRANCH C · FEDNOW LAYER",
            amt: "$47,500",
            sub: "Peels & Re-Converges at Hop 6",
            border: PALETTE.crimson,
          },
        ].map((b, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 695,
              top: b.top,
              width: 300,
              padding: "16px 20px",
              borderRadius: 18,
              background: "#FFFFFF",
              border: `2px solid ${b.border}`,
              opacity: splitProg,
              transform: `translateX(${(1 - splitProg) * -24}px)`,
              boxShadow: "0 14px 32px rgba(9, 17, 30, 0.07)",
            }}
          >
            <div style={{ fontFamily: TYPE.mono, fontSize: 11, fontWeight: 800, color: b.border }}>
              {b.tag}
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, marginTop: 2 }}>{b.amt}</div>
            <div style={{ fontSize: 12.5, color: PALETTE.inkMuted, marginTop: 2 }}>{b.sub}</div>
          </div>
        ))}
      </div>

      {/* Right Stage: $10.2B Loss Stat + Why Linear Agents Fail */}
      {frame >= l2Start - 8 && (
        <div
          style={{
            position: "absolute",
            top: 156,
            right: 80,
            width: 680,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div>
            <div style={{ fontFamily: TYPE.mono, fontSize: 13, fontWeight: 800, color: PALETTE.crimson }}>
              ANNUAL INSTANT-PAYMENT SCAM DRAIN
            </div>
            <div style={{ fontSize: 96, fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 1.02 }}>
              ${lossBillions.toFixed(1)}B+
            </div>
          </div>

          <div
            style={{
              padding: "18px 22px",
              borderRadius: 18,
              background: "#FFFFFF",
              border: `1.5px solid ${PALETTE.porcelainBorder}`,
            }}
          >
            <div style={{ fontFamily: TYPE.mono, fontSize: 12, fontWeight: 800, color: PALETTE.inkMuted }}>
              FAILURE MODE 01 // LEGACY 1-HOP RULES
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>
              Goes completely blind once funds split past Hop 2.
            </div>
          </div>

          <div
            style={{
              padding: "18px 22px",
              borderRadius: 18,
              background: "rgba(225, 29, 72, 0.06)",
              border: `2px solid ${PALETTE.crimson}`,
            }}
          >
            <div style={{ fontFamily: TYPE.mono, fontSize: 12, fontWeight: 800, color: PALETTE.crimson }}>
              FAILURE MODE 02 // NAIVE SINGLE-PROMPT LLM
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>
              Chokes on 12,513 ledger tokens and freezes 42 innocent nurses' paychecks.
            </div>
          </div>
        </div>
      )}

      {/* Bottom MuleTrace Reveal Banner */}
      {frame >= l3Start - 4 && (
        <div
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            bottom: 108,
            height: 122,
            borderRadius: 24,
            background: PALETTE.vault,
            color: PALETTE.chalk,
            padding: "0 38px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            transform: `translateY(${(1 - revealSpring) * 50}px)`,
            opacity: revealSpring,
            boxShadow: "0 24px 60px rgba(5, 9, 18, 0.25)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: 15,
                background: `linear-gradient(135deg, ${PALETTE.cyanBright}, ${PALETTE.emeraldBright})`,
                color: PALETTE.vault,
                fontWeight: 900,
                fontSize: 22,
                display: "grid",
                placeItems: "center",
              }}
            >
              MT
            </div>
            <div>
              <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.03em" }}>
                Mule<span style={{ color: PALETTE.cyanBright }}>Trace</span>
              </div>
              <div style={{ fontSize: 15, color: PALETTE.chalkMuted }}>
                Tree-of-Hops Scouting · Innocent-Account Backtracking · Markovian O(1) Capsules · H-MEM Shortcuts
              </div>
            </div>
          </div>
          <div
            style={{
              padding: "10px 20px",
              borderRadius: 999,
              border: `1.5px solid ${PALETTE.emeraldBright}`,
              background: "rgba(16, 185, 129, 0.14)",
              fontFamily: TYPE.mono,
              fontSize: 13,
              fontWeight: 800,
              color: "#6EE7B7",
            }}
          >
            ZETARIS + METERLESS + NEMOTRON
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
