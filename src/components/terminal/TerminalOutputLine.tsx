import { classifyLine } from "./classifyLine";

type TerminalOutputLineProps = {
  text: string;
  caret?: boolean;
};

function Caret() {
  return <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-[#d4d4dc] align-middle" />;
}

export function TerminalOutputLine({ text, caret }: TerminalOutputLineProps) {
  const line = classifyLine(text);

  switch (line.kind) {
    case "blank":
      return <div>{" "}</div>;
    case "header":
      return (
        <div className="font-semibold text-[#c586c0]">
          {line.text}
          {caret && <Caret />}
        </div>
      );
    case "field":
      return (
        <div>
          <span className="text-[#c586c0]">{line.key}:</span> <span className="text-[#ce9178]">{line.value}</span>
          {caret && <Caret />}
        </div>
      );
    case "bullet":
      return (
        <div className="whitespace-pre-wrap">
          <span className="text-[#6ad3ff]">-</span> {line.text}
          {caret && <Caret />}
        </div>
      );
    case "meta":
      return (
        <div className="whitespace-pre-wrap text-[#8a8f98]">
          {line.text}
          {caret && <Caret />}
        </div>
      );
    case "text":
      return (
        <div className="whitespace-pre-wrap">
          {line.text}
          {caret && <Caret />}
        </div>
      );
  }
}
