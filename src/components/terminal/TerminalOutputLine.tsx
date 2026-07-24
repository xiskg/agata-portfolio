import { classifyLine } from "./classifyLine";

export function TerminalOutputLine({ text }: { text: string }) {
  const line = classifyLine(text);

  switch (line.kind) {
    case "blank":
      return <div>{" "}</div>;
    case "header":
      return <div className="font-semibold text-[#c586c0]">{line.text}</div>;
    case "field":
      return (
        <div>
          <span className="text-[#c586c0]">{line.key}:</span> <span className="text-[#ce9178]">{line.value}</span>
        </div>
      );
    case "bullet":
      return (
        <div className="whitespace-pre-wrap">
          <span className="text-[#6ad3ff]">-</span> {line.text}
        </div>
      );
    case "meta":
      return <div className="whitespace-pre-wrap text-[#8a8f98]">{line.text}</div>;
    case "text":
      return <div className="whitespace-pre-wrap">{line.text}</div>;
  }
}
