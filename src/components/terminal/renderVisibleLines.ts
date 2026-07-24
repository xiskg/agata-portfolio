import type { Step } from "./types";

export type RenderedLine = {
  key: string;
  sceneId: string;
  kind: "prompt" | "output";
  text: string;
  inProgress: boolean;
};

export function getVisibleLines(steps: Step[], stepIndex: number, reducedMotion: boolean): RenderedLine[] {
  const completed = Math.floor(stepIndex);
  const fraction = stepIndex - completed;
  const upTo = reducedMotion ? Math.ceil(stepIndex) : completed;

  const lines: RenderedLine[] = [];
  for (let i = 0; i < steps.length && i < upTo; i++) {
    lines.push(toRenderedLine(steps[i], i, false, 1));
  }

  if (!reducedMotion && completed < steps.length && fraction > 0) {
    lines.push(toRenderedLine(steps[completed], completed, true, fraction));
  }

  return lines;
}

export function currentSceneId(steps: Step[], stepIndex: number): string | undefined {
  if (steps.length === 0) return undefined;
  const idx = Math.min(Math.max(Math.floor(stepIndex), 0), steps.length - 1);
  return steps[idx].sceneId;
}

function toRenderedLine(step: Step, index: number, inProgress: boolean, fraction: number): RenderedLine {
  const fullText = step.kind === "command" ? step.command : step.line;
  const text = inProgress ? fullText.slice(0, Math.round(fullText.length * fraction)) : fullText;

  if (step.kind === "command") {
    return { key: `${step.sceneId}-cmd-${index}`, sceneId: step.sceneId, kind: "prompt", text, inProgress };
  }
  return { key: `${step.sceneId}-out-${index}`, sceneId: step.sceneId, kind: "output", text, inProgress };
}
