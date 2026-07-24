export type ClassifiedLine =
  | { kind: "blank" }
  | { kind: "header"; text: string }
  | { kind: "field"; key: string; value: string }
  | { kind: "bullet"; text: string }
  | { kind: "meta"; text: string }
  | { kind: "text"; text: string };

export function classifyLine(text: string): ClassifiedLine {
  if (text.trim() === "") return { kind: "blank" };

  const fieldMatch = /^(email|linkedin|github):\s(.+)$/.exec(text);
  if (fieldMatch) return { kind: "field", key: fieldMatch[1], value: fieldMatch[2] };

  if (/^\s*-\s/.test(text)) return { kind: "bullet", text: text.replace(/^\s*-\s/, "") };

  if (/^[A-Za-z][\w &/-]*:$/.test(text.trim())) return { kind: "header", text };

  if (text.includes(" — ")) return { kind: "header", text };

  if (/^\s{2,}\S/.test(text)) return { kind: "meta", text };

  return { kind: "text", text };
}
