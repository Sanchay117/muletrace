import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import timing from "./generated/timing.json";
import { Act1WireFanout } from "./acts/Act1WireFanout";
import { Act2TreeBacktrack } from "./acts/Act2TreeBacktrack";
import { Act3MarkovianRace } from "./acts/Act3MarkovianRace";
import { Act4HMemShortcut } from "./acts/Act4HMemShortcut";
import { Act5NemotronVault } from "./acts/Act5NemotronVault";
import { TYPE } from "./theme";

const ACT_MAP: Record<string, React.FC<{ lines: any[] }>> = {
  act1: Act1WireFanout,
  act2: Act2TreeBacktrack,
  act3: Act3MarkovianRace,
  act4: Act4HMemShortcut,
  act5: Act5NemotronVault,
};

const ActWrapper: React.FC<{
  id: string;
  durationInFrames: number;
  lines: any[];
  isFirst: boolean;
}> = ({ id, lines, isFirst }) => {
  const frame = useCurrentFrame();
  const Comp = ACT_MAP[id];

  // Diagonal architectural shutter reveal (zero reused circular iris prior)
  const wipe = isFirst
    ? 1
    : interpolate(frame, [0, timing.transitionFrames], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  const activeLine = lines.find(
    (l) => frame >= l.startFrame && frame <= l.startFrame + l.frames + 6
  );

  const clipPoly =
    wipe >= 1
      ? "none"
      : `polygon(0 0, ${wipe * 125}% 0, ${Math.max(0, wipe * 125 - 25)}% 100%, 0 100%)`;

  return (
    <AbsoluteFill style={{ clipPath: clipPoly }}>
      {!isFirst && (
        <Sequence from={0} layout="none">
          <Audio src={staticFile("sfx/shutter.wav")} volume={0.35} />
        </Sequence>
      )}
      <Comp lines={lines} />

      {lines.map((line: any) => (
        <Sequence key={line.file} from={line.startFrame} layout="none">
          <Audio src={staticFile(line.file)} volume={1.0} />
        </Sequence>
      ))}

      {activeLine && (
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            maxWidth: 1180,
            padding: "11px 28px",
            borderRadius: 999,
            background: "rgba(9, 17, 30, 0.88)",
            border: "1px solid rgba(255,255,255,0.16)",
            color: "#F8FAFC",
            fontFamily: TYPE.sans,
            fontSize: 18,
            fontWeight: 600,
            textAlign: "center",
            lineHeight: 1.35,
            boxShadow: "0 12px 32px rgba(0,0,0,0.28)",
          }}
        >
          {activeLine.text}
        </div>
      )}
    </AbsoluteFill>
  );
};

export const MuleTraceVideo: React.FC = () => {
  let cursor = 0;
  const placements = timing.order.map((id, i) => {
    const sc = (timing.scenes as Record<string, any>)[id];
    const from = cursor;
    cursor += sc.durationInFrames - (i < timing.order.length - 1 ? timing.transitionFrames : 0);
    return { id, from, durationInFrames: sc.durationInFrames, lines: sc.lines, isFirst: i === 0 };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#050912" }}>
      <Audio src={staticFile("music/bed.wav")} volume={0.2} />
      {placements.map((p) => (
        <Sequence key={p.id} from={p.from} durationInFrames={p.durationInFrames}>
          <ActWrapper
            id={p.id}
            durationInFrames={p.durationInFrames}
            lines={p.lines}
            isFirst={p.isFirst}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
