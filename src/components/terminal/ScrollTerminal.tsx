"use client";

import { useMemo } from "react";
import { useReducedMotion } from "framer-motion";
import { buildScenes, buildSteps, getSceneStartOffsets } from "./script";
import { currentSceneId, getVisibleLines } from "./renderVisibleLines";
import { useScrollSteps } from "./useScrollSteps";
import { TerminalWindow } from "./TerminalWindow";
import { LaptopMockup } from "./LaptopMockup";
import { SceneProgressNav } from "./SceneProgressNav";

const STEP_PX = 80;
const VISIBLE_LINES = 12;

export function ScrollTerminal() {
  const scenes = useMemo(() => buildScenes(), []);
  const steps = useMemo(() => buildSteps(scenes), [scenes]);
  const sceneOffsets = useMemo(() => getSceneStartOffsets(scenes, STEP_PX), [scenes]);
  const reducedMotion = useReducedMotion();

  const { containerRef, stepIndex } = useScrollSteps(steps.length);

  const visibleLines = getVisibleLines(steps, stepIndex, Boolean(reducedMotion)).slice(-VISIBLE_LINES);
  const activeSceneId = currentSceneId(steps, stepIndex);

  return (
    <div ref={containerRef} style={{ height: `${steps.length * STEP_PX}px` }} className="relative">
      {scenes.map((scene) => (
        <div
          key={scene.id}
          id={`scene-${scene.id}`}
          aria-hidden="true"
          style={{ position: "absolute", top: sceneOffsets[scene.id], height: 1, width: 1 }}
        />
      ))}
      <div className="sticky top-0 flex h-screen items-center justify-center gap-10 px-4">
        <LaptopMockup>
          <TerminalWindow>
            {visibleLines.map((line) => (
              <div key={line.key} className={line.kind === "prompt" ? "text-[#6ad3ff]" : "whitespace-pre-wrap"}>
                {line.kind === "prompt" ? `agata@portfolio:~$ ${line.text}` : line.text}
                {line.inProgress && <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-[#d4d4dc] align-middle" />}
              </div>
            ))}
          </TerminalWindow>
        </LaptopMockup>
        <SceneProgressNav scenes={scenes} activeSceneId={activeSceneId} />
      </div>
    </div>
  );
}
