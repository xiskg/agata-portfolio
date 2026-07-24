"use client";

import { useState } from "react";
import { runCommand } from "./commands";
import { TerminalWindow } from "./TerminalWindow";

type HistoryEntry = {
  command: string;
  lines: string[];
};

export function InteractiveTerminal() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = runCommand(input);
    setHistory((previous) => (result.clear ? [] : [...previous, { command: input, lines: result.lines }]));
    setInput("");
  }

  return (
    <TerminalWindow>
      {history.map((entry, index) => (
        <div key={index}>
          <div className="text-[#6ad3ff]">agata@portfolio:~$ {entry.command}</div>
          {entry.lines.map((line, lineIndex) => (
            <div key={lineIndex} className="whitespace-pre-wrap">
              {line}
            </div>
          ))}
        </div>
      ))}
      <form onSubmit={handleSubmit} className="flex items-center gap-1 text-[#6ad3ff]">
        <span>agata@portfolio:~$</span>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          autoComplete="off"
          spellCheck={false}
          aria-label="Terminal command input"
          className="flex-1 bg-transparent text-[#d4d4dc] outline-none"
        />
      </form>
    </TerminalWindow>
  );
}
