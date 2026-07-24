import { describe, expect, it } from "vitest";
import { buildScenes, buildSteps, getSceneStartOffsets } from "./script";

describe("buildScenes", () => {
  it("returns the 7 scenes in spec order", () => {
    const scenes = buildScenes();
    expect(scenes.map((scene) => scene.id)).toEqual([
      "intro",
      "skills",
      "experience-mercado-libre",
      "experience-conecta-marketplaces",
      "experience-techmillen-consultoria-e-projetos",
      "background",
      "contact",
    ]);
  });

  it("gives every scene a non-empty command and at least one output line", () => {
    for (const scene of buildScenes()) {
      expect(scene.command.length).toBeGreaterThan(0);
      expect(scene.output.length).toBeGreaterThan(0);
    }
  });
});

describe("buildSteps", () => {
  it("emits one command step followed by one step per output line, per scene", () => {
    const scenes = buildScenes();
    const steps = buildSteps(scenes);
    const expectedTotal = scenes.reduce((sum, scene) => sum + 1 + scene.output.length, 0);
    expect(steps.length).toBe(expectedTotal);
    expect(steps[0]).toEqual({ kind: "command", sceneId: "intro", command: "whoami" });
  });
});

describe("getSceneStartOffsets", () => {
  it("places the first scene at offset 0 and the next scene right after its full step count", () => {
    const scenes = buildScenes();
    const offsets = getSceneStartOffsets(scenes, 80);
    expect(offsets.intro).toBe(0);
    const introStepCount = 1 + scenes[0].output.length;
    expect(offsets.skills).toBe(introStepCount * 80);
  });
});
