import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PALETTE, TYPE } from "../theme";

export const Act5NemotronVault: React.FC<{ lines: any[] }> = ({ lines }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const l2Start = lines[1]?.startFrame ?? 350;
  const sealFrame = l2Start + 70;

  const sealSpring = spring({
    frame: frame - sealFrame,
    fps,
    config: { damping: 12, stiffness: 210 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.vault, fontFamily: TYPE.sans, color: PALETTE.chalk }}>
      <Sequence from={sealFrame} layout="none">
        <Audio src={staticFile("sfx/vault.wav")} volume={0.8} />
      </Sequence>

      {/* Top Header */}
      <div
        style={{
          position: "absolute",
          top: 44,
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
              background: PALETTE.emeraldBright,
              color: PALETTE.vault,
              fontFamily: TYPE.mono,
              fontSize: 13,
              fontWeight: 900,
            }}
          >
            03 POWER // METERLESS NIGHTSHIFT + NVIDIA NEMOTRON
          </div>
          <span style={{ fontFamily: TYPE.mono, fontSize: 14, color: PALETTE.chalkMuted }}>
            http://127.0.0.1:8088/v1 · CRYPTOGRAPHIC MODEL RECEIPTS PER STEP
          </span>
        </div>
      </div>

      {/* Dual Nightshift Nemotron Dispatch Cards */}
      <div
        style={{
          position: "absolute",
          top: 108,
          left: 80,
          right: 80,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
        }}
      >
        <div
          style={{
            background: PALETTE.vaultCard,
            borderRadius: 22,
            border: `1.5px solid rgba(34, 211, 238, 0.4)`,
            padding: "22px 28px",
          }}
        >
          <div style={{ fontFamily: TYPE.mono, fontSize: 12, color: PALETTE.cyanBright, fontWeight: 800 }}>
            NIGHTSHIFT LANE 1 · PARALLEL HOP SCOUTS
          </div>
          <div style={{ fontFamily: TYPE.mono, fontSize: 22, fontWeight: 900, marginTop: 6 }}>
            nvidia/nemotron-3.5-lightning-30b-a3b
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 14, fontFamily: TYPE.mono, fontSize: 12 }}>
            {["Step 1: Typology Planner", "Step 2: Fan-Out SQL", "Step 4: Convergence Chase"].map((t) => (
              <span
                key={t}
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  background: "rgba(34,211,238,0.12)",
                  color: "#67E8F9",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div
          style={{
            background: PALETTE.vaultCard,
            borderRadius: 22,
            border: `1.5px solid rgba(167, 139, 250, 0.45)`,
            padding: "22px 28px",
          }}
        >
          <div style={{ fontFamily: TYPE.mono, fontSize: 12, color: PALETTE.violetBright, fontWeight: 800 }}>
            NIGHTSHIFT LANE 2 · DEEP PRUNING &amp; SURGICAL FREEZE ARBITER
          </div>
          <div style={{ fontFamily: TYPE.mono, fontSize: 22, fontWeight: 900, marginTop: 6 }}>
            nvidia/nemotron-3.5-super-vl-120b-a12b
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 14, fontFamily: TYPE.mono, fontSize: 12 }}>
            {["Step 3: Bystander Prune", "Step 5: FIFO Taint Gate", "Step 6: FinCEN Freeze"].map((t) => (
              <span
                key={t}
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  background: "rgba(167,139,250,0.14)",
                  color: "#DDD6FE",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 5-Case Benchmark Matrix */}
      <div
        style={{
          position: "absolute",
          top: 294,
          left: 80,
          right: 80,
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 16,
        }}
      >
        {[
          { id: "CASE-01 · 6 HOPS", d: "Payroll Pruned + Convergence", v: "LOCK $101.5K", c: PALETTE.emeraldBright },
          { id: "CASE-02 · 7 HOPS", d: "Deep Automated Peel-Chain", v: "LOCK $218.4K", c: PALETTE.emeraldBright },
          { id: "CASE-03 · 2 HOPS", d: "H-MEM 48s Ring Shortcut", v: "FAST $79.9K", c: PALETTE.cyanBright },
          { id: "CASE-04 · 64% GATE", d: "Title Escrow Sub-Ledger Lien", v: "LIEN $64.0K", c: PALETTE.amberBright },
          { id: "CASE-05 · 3 HOPS", d: "Gift-Card + TRON Bridge", v: "LOCK $154.0K", c: PALETTE.emeraldBright },
        ].map((c) => (
          <div
            key={c.id}
            style={{
              background: PALETTE.vaultCard,
              borderRadius: 20,
              border: `1.5px solid ${PALETTE.vaultBorder}`,
              padding: "20px 20px",
              height: 184,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ fontFamily: TYPE.mono, fontSize: 12, color: c.c, fontWeight: 800 }}>{c.id}</div>
            <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.35 }}>{c.d}</div>
            <div style={{ fontSize: 25, fontWeight: 900, color: c.c }}>{c.v}</div>
          </div>
        ))}
      </div>

      {/* Bottom Porcelain Vault Finale Slab */}
      <div
        style={{
          position: "absolute",
          top: 514,
          left: 80,
          right: 80,
          bottom: 108,
          background: PALETTE.porcelain,
          color: PALETTE.ink,
          borderRadius: 28,
          padding: "0 56px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
        }}
      >
        <div>
          <div style={{ fontFamily: TYPE.mono, fontSize: 13, fontWeight: 900, color: PALETTE.teal }}>
            OPEN AGENT HACKATHON 2026 · TRACK 3: REASONING ARCHITECTURE · PUSH AND PRAY
          </div>
          <div style={{ fontSize: 68, fontWeight: 900, letterSpacing: "-0.04em", marginTop: 6 }}>
            Mule<span style={{ color: PALETTE.teal }}>Trace</span>
          </div>
          <div style={{ fontFamily: TYPE.mono, fontSize: 16, color: PALETTE.inkMuted, marginTop: 8 }}>
            github.com/Sanchay117/muletrace · 3/3 Smoke Checks · 10/10 Conformance Tests
          </div>
        </div>

        {frame >= sealFrame - 2 && (
          <div
            style={{
              padding: "20px 34px",
              borderRadius: 20,
              border: `5px solid ${PALETTE.emerald}`,
              background: "rgba(5, 150, 105, 0.1)",
              color: PALETTE.emerald,
              transform: `scale(${0.86 + 0.14 * sealSpring})`,
              opacity: sealSpring,
              textAlign: "center",
              boxShadow: "0 18px 40px rgba(5, 150, 105, 0.18)",
            }}
          >
            <div style={{ fontFamily: TYPE.mono, fontSize: 34, fontWeight: 900, letterSpacing: "0.04em" }}>
              $617,800 LOCKED
            </div>
            <div style={{ fontFamily: TYPE.mono, fontSize: 14, fontWeight: 900, marginTop: 6 }}>
              0 INNOCENT ACCOUNTS FROZEN · -92.2% TOKENS
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
