"use client";

import { useEffect, useState } from "react";

type LandingCoverProps = {
  progress: number;
};

type ScreensaverFrame = {
  art: string[];
  caption: string;
};

const FRAMES: ScreensaverFrame[] = [
  { art: [" /\\_/\\", "( o.o )", " > ^ <"], caption: "pimpi.cat is online" },
  { art: [" /\\_/\\", "( -.-)", " > ^ <"], caption: "cora.cat is not amused" },
  { art: [" /\\/\\/\\", " \\/\\/\\/"], caption: "currently undefeated at Catan" },
  { art: ["--o--o--o-->"], caption: "3 countries visited (and counting)" },
];

const FRAME_MS = 3500;

export function LandingCover({ progress }: LandingCoverProps) {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setFrameIndex((previous) => (previous + 1) % FRAMES.length);
    }, FRAME_MS);
    return () => clearInterval(id);
  }, []);

  if (progress >= 1) return null;

  const frame = FRAMES[frameIndex];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-none bg-[#17171d] md:rounded-md"
      style={{ opacity: 1 - progress, transform: `scale(${1 + progress * 0.08})` }}
    >
      <div
        key={frameIndex}
        className="flex animate-[fade-in_0.4s_ease-out] flex-col items-center gap-3 font-mono text-[#6ad3ff] lowercase"
      >
        <pre className="text-center text-sm leading-tight">{frame.art.join("\n")}</pre>
        <span className="text-xs text-[#8a8f98]">{frame.caption}</span>
      </div>
    </div>
  );
}
