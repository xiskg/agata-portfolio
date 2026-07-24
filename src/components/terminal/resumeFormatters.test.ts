import { describe, expect, it } from "vitest";
import { resume } from "@/content/resume";
import { formatAbout, formatIntroTeaser } from "./resumeFormatters";

describe("formatIntroTeaser", () => {
  it("starts with the name/title header and location, like formatAbout", () => {
    const teaser = formatIntroTeaser();
    expect(teaser[0]).toBe(`${resume.name} — ${resume.title}`);
    expect(teaser[1]).toBe(resume.location);
  });

  it("uses the short summary instead of the full summary", () => {
    const teaser = formatIntroTeaser();
    const teaserBody = teaser.slice(3);
    expect(teaserBody).toEqual(resume.summaryShort);
  });

  it("is shorter than the full about output", () => {
    expect(formatIntroTeaser().length).toBeLessThan(formatAbout().length);
  });
});
