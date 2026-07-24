import { describe, expect, it } from "vitest";
import { progressToStepIndex } from "./stepMath";

describe("progressToStepIndex", () => {
  it("maps progress 0 to step 0", () => {
    expect(progressToStepIndex(0, 10)).toBe(0);
  });

  it("maps progress 1 to the total step count", () => {
    expect(progressToStepIndex(1, 10)).toBe(10);
  });

  it("maps progress 0.5 to half the steps", () => {
    expect(progressToStepIndex(0.5, 10)).toBe(5);
  });

  it("clamps progress below 0", () => {
    expect(progressToStepIndex(-0.2, 10)).toBe(0);
  });

  it("clamps progress above 1", () => {
    expect(progressToStepIndex(1.5, 10)).toBe(10);
  });

  it("returns 0 when there are no steps", () => {
    expect(progressToStepIndex(0.5, 0)).toBe(0);
  });
});
