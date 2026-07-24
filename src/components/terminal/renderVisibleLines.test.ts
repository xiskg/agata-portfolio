import { describe, expect, it } from "vitest";
import { currentSceneId, getVisibleLines } from "./renderVisibleLines";
import type { Step } from "./types";

const steps: Step[] = [
  { kind: "command", sceneId: "a", command: "whoami" },
  { kind: "output", sceneId: "a", line: "Agata" },
  { kind: "command", sceneId: "b", command: "cat skills.txt" },
  { kind: "output", sceneId: "b", line: "Go, Java" },
];

describe("getVisibleLines", () => {
  it("shows nothing before scrolling starts", () => {
    expect(getVisibleLines(steps, 0, false)).toEqual([]);
  });

  it("shows a partially typed command mid-step", () => {
    const lines = getVisibleLines(steps, 0.5, false);
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatchObject({ kind: "prompt", inProgress: true });
    expect(lines[0].text.length).toBeGreaterThan(0);
    expect(lines[0].text.length).toBeLessThan("whoami".length);
  });

  it("shows the full command once its step completes", () => {
    const lines = getVisibleLines(steps, 1, false);
    expect(lines[0]).toMatchObject({ kind: "prompt", text: "whoami", inProgress: false });
  });

  it("reveals output lines fully as soon as their step starts, even mid-step", () => {
    const lines = getVisibleLines(steps, 1.3, false);
    expect(lines[lines.length - 1]).toMatchObject({ kind: "output", text: "Agata", inProgress: false });
  });

  it("in reduced-motion mode, shows full text immediately without partial typing", () => {
    const lines = getVisibleLines(steps, 0.5, true);
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatchObject({ kind: "prompt", text: "whoami" });
  });
});

describe("currentSceneId", () => {
  it("returns the scene of the current step", () => {
    expect(currentSceneId(steps, 0)).toBe("a");
    expect(currentSceneId(steps, 2.5)).toBe("b");
  });

  it("clamps to the last scene when stepIndex exceeds total steps", () => {
    expect(currentSceneId(steps, 99)).toBe("b");
  });

  it("returns undefined for an empty step list", () => {
    expect(currentSceneId([], 0)).toBeUndefined();
  });
});
