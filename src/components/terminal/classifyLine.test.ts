import { describe, expect, it } from "vitest";
import { classifyLine } from "./classifyLine";

describe("classifyLine", () => {
  it("classifies an empty string as blank", () => {
    expect(classifyLine("")).toEqual({ kind: "blank" });
  });

  it("classifies a section header ending in a colon", () => {
    expect(classifyLine("Backend & Architecture:")).toEqual({ kind: "header", text: "Backend & Architecture:" });
    expect(classifyLine("education:")).toEqual({ kind: "header", text: "education:" });
  });

  it("classifies a name/title or role/company line containing an em dash as a header", () => {
    expect(classifyLine("Agata Domingues — Backend Software Engineer")).toEqual({
      kind: "header",
      text: "Agata Domingues — Backend Software Engineer",
    });
  });

  it("classifies email/linkedin/github lines as fields with a split key and value", () => {
    expect(classifyLine("email: agatadominguestech@gmail.com")).toEqual({
      kind: "field",
      key: "email",
      value: "agatadominguestech@gmail.com",
    });
    expect(classifyLine("linkedin: #")).toEqual({ kind: "field", key: "linkedin", value: "#" });
  });

  it("classifies any unindented 'key: value' line as a field, not just email/linkedin/github", () => {
    expect(classifyLine("OS: AgataOS (Backend Edition)")).toEqual({
      kind: "field",
      key: "OS",
      value: "AgataOS (Backend Edition)",
    });
    expect(classifyLine("Pets: Pimpi & Cora")).toEqual({ kind: "field", key: "Pets", value: "Pimpi & Cora" });
  });

  it("classifies a dash-prefixed line as a bullet, stripping the marker", () => {
    expect(classifyLine("- Develop and maintain B2B backend services")).toEqual({
      kind: "bullet",
      text: "Develop and maintain B2B backend services",
    });
    expect(classifyLine("  - Portuguese: Native")).toEqual({ kind: "bullet", text: "Portuguese: Native" });
  });

  it("classifies an indented, non-bulleted line as meta", () => {
    expect(classifyLine("  Go (Golang), Java, C# / .NET, Python, JavaScript, SQL")).toEqual({
      kind: "meta",
      text: "  Go (Golang), Java, C# / .NET, Python, JavaScript, SQL",
    });
  });

  it("classifies ordinary prose as plain text", () => {
    expect(classifyLine("Brazil")).toEqual({ kind: "text", text: "Brazil" });
    expect(classifyLine("Currently building distributed services in Go and Java at Mercado Libre.")).toEqual({
      kind: "text",
      text: "Currently building distributed services in Go and Java at Mercado Libre.",
    });
  });
});
