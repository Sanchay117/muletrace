import React from "react";
import { Composition, registerRoot } from "remotion";
import { MuleTraceVideo } from "./Video";
import timing from "./generated/timing.json";

const RemotionRoot: React.FC = () => {
  return React.createElement(Composition, {
    id: "MuleTrace",
    component: MuleTraceVideo,
    durationInFrames: timing.totalDurationInFrames,
    fps: timing.fps,
    width: 1920,
    height: 1080,
  });
};

registerRoot(RemotionRoot);
