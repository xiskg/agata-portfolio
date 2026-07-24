import { describe, expect, it } from "vitest";
import { runCommand } from "./commands";

describe("runCommand", () => {
  it("lists available commands for 'help', with the fun extras on a separate line", () => {
    const result = runCommand("help");
    expect(result.lines[0]).toContain("help");
    expect(result.lines[0]).toContain("skills");
    expect(result.lines[0]).toContain("contact");
    const joined = result.lines.join("\n");
    expect(joined).toContain("neofetch");
    expect(joined).toContain("cats");
    expect(joined).toContain("fortune");
  });

  it("returns the summary for 'about'", () => {
    const result = runCommand("about");
    expect(result.lines[0]).toContain("Agata Domingues");
  });

  it("returns skill categories for 'skills'", () => {
    const result = runCommand("skills");
    expect(result.lines.join("\n")).toContain("Languages & Frameworks");
  });

  it("returns all three companies for 'experience'", () => {
    const result = runCommand("experience");
    const joined = result.lines.join("\n");
    expect(joined).toContain("Mercado Libre");
    expect(joined).toContain("Conecta Marketplaces");
    expect(joined).toContain("Techmillen Consultoria e Projetos");
  });

  it("returns education, certifications, and languages for 'education'", () => {
    const result = runCommand("education");
    const joined = result.lines.join("\n");
    expect(joined).toContain("UNINTER");
    expect(joined).toContain("Mercado Libre API Integration");
    expect(joined).toContain("Portuguese");
  });

  it("returns email and links for 'contact', with no phone number", () => {
    const result = runCommand("contact");
    const joined = result.lines.join("\n");
    expect(joined).toContain("agatadominguestech@gmail.com");
    expect(joined).not.toMatch(/\d{2,}-\d{4,}/);
  });

  it("signals a clear for 'clear'", () => {
    const result = runCommand("clear");
    expect(result.clear).toBe(true);
    expect(result.lines).toEqual([]);
  });

  it("returns the easter egg for 'sudo hire agata', case-insensitively", () => {
    const result = runCommand("Sudo Hire Agata");
    expect(result.lines[0]).toMatch(/hired/i);
  });

  it("returns a neofetch-style personality easter egg, case-insensitively", () => {
    const result = runCommand("NeoFetch");
    const joined = result.lines.join("\n");
    expect(joined).toContain("Pimpi");
    expect(joined).toContain("Cora");
    expect(joined).toContain("Catan");
  });

  it("returns a cats easter egg naming both cats", () => {
    const result = runCommand("cats");
    const joined = result.lines.join("\n").toLowerCase();
    expect(joined).toContain("pimpi");
    expect(joined).toContain("cora");
  });

  it("returns a single non-empty line for 'fortune'", () => {
    const result = runCommand("fortune");
    expect(result.lines).toHaveLength(1);
    expect(result.lines[0].length).toBeGreaterThan(0);
  });

  it("returns a not-found message for unknown commands", () => {
    const result = runCommand("rm -rf /");
    expect(result.lines[0]).toContain("command not found: rm -rf /");
    expect(result.lines[0]).toContain("help");
  });

  it("returns no lines for empty input", () => {
    expect(runCommand("   ")).toEqual({ lines: [] });
  });
});
