"use client";

import { useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { buildScenes, buildSteps, getSceneStartOffsets } from "./script";
import { currentSceneId, getVisibleLines } from "./renderVisibleLines";
import { useScrollSteps } from "./useScrollSteps";
import { TerminalWindow } from "./TerminalWindow";
import { LaptopMockup } from "./LaptopMockup";
import { SceneProgressNav } from "./SceneProgressNav";
import { PROMPT_PREFIX } from "./prompt";
import { TerminalOutputLine } from "./TerminalOutputLine";
import { runCommand } from "./commands";

const STEP_PX = 80;
const VISIBLE_LINES = 12;
const DWELL_PX = 900;
const HINT_TEXT = "Type a command to keep exploring — try 'help'.";

type HistoryEntry = {
  command: string;
  lines: string[];
};

export function ScrollTerminal() {
  const scenes = useMemo(() => buildScenes(), []);
  const steps = useMemo(() => buildSteps(scenes), [scenes]);
  const sceneOffsets = useMemo(() => getSceneStartOffsets(scenes, STEP_PX), [scenes]);
  const reducedMotion = useReducedMotion();

  // One extra virtual step beyond the résumé steps, reserved for typing out
  // HINT_TEXT, so the hand-off into the interactive prompt keeps typing
  // continuously instead of popping in the instant playback finishes.
  const hintStepIndex = steps.length;
  const { containerRef, stepIndex } = useScrollSteps(hintStepIndex + 1);

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");

  const pastHintStart = stepIndex > hintStepIndex;
  const hintFraction = reducedMotion ? (pastHintStart ? 1 : 0) : Math.min(Math.max(stepIndex - hintStepIndex, 0), 1);
  const hintText = HINT_TEXT.slice(0, Math.round(HINT_TEXT.length * hintFraction));
  const hintTyping = !reducedMotion && pastHintStart && hintFraction < 1;
  const playbackComplete = reducedMotion ? pastHintStart : hintFraction >= 1;

  const visibleLines = getVisibleLines(steps, stepIndex, Boolean(reducedMotion)).slice(-VISIBLE_LINES);
  const activeSceneId = currentSceneId(steps, stepIndex);
  const scrubHeight = (hintStepIndex + 1) * STEP_PX;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (input.trim() === "") {
      setInput("");
      return;
    }
    const result = runCommand(input);
    setHistory((previous) => (result.clear ? [] : [...previous, { command: input, lines: result.lines }]));
    setInput("");
  }

  return (
    <div className="relative" style={{ height: `${scrubHeight + DWELL_PX}px` }}>
      <div
        ref={containerRef}
        aria-hidden="true"
        style={{ position: "absolute", top: 0, left: 0, width: 1, height: scrubHeight }}
      />
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
            {visibleLines.map((line) =>
              line.kind === "prompt" ? (
                <div key={line.key} className="text-[#6ad3ff]">
                  {`${PROMPT_PREFIX} ${line.text}`}
                  {line.inProgress && (
                    <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-[#d4d4dc] align-middle" />
                  )}
                </div>
              ) : (
                <TerminalOutputLine key={line.key} text={line.text} caret={line.inProgress} />
              ),
            )}
            {pastHintStart && (
              <div className="text-[#8a8f98]">
                {hintText}
                {hintTyping && (
                  <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-[#8a8f98] align-middle" />
                )}
              </div>
            )}
            {playbackComplete && (
              <>
                {history.map((entry, index) => (
                  <div key={index}>
                    <div className="text-[#6ad3ff]">
                      {PROMPT_PREFIX} {entry.command}
                    </div>
                    {entry.lines.map((line, lineIndex) => (
                      <TerminalOutputLine key={lineIndex} text={line} />
                    ))}
                  </div>
                ))}
                <form onSubmit={handleSubmit} className="flex items-center gap-1 text-[#6ad3ff]">
                  <span>{PROMPT_PREFIX}</span>
                  <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    autoComplete="off"
                    spellCheck={false}
                    aria-label="Terminal command input"
                    className="flex-1 bg-transparent text-[#d4d4dc] outline-none"
                  />
                </form>
              </>
            )}
          </TerminalWindow>
        </LaptopMockup>
        <SceneProgressNav scenes={scenes} activeSceneId={activeSceneId} />
      </div>
    </div>
  );
}
