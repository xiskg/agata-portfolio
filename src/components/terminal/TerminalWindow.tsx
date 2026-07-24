type TerminalWindowProps = {
  children: React.ReactNode;
  className?: string;
};

export function TerminalWindow({ children, className }: TerminalWindowProps) {
  return (
    <div className={`overflow-hidden rounded-none bg-[#17171d] font-mono text-[13px] leading-relaxed md:rounded-md ${className ?? ""}`}>
      <div className="flex items-center gap-1.5 bg-[#0c0c10] px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      </div>
      <div className="flex h-[320px] flex-col justify-end overflow-hidden px-4 py-3 text-[#d4d4dc]">{children}</div>
    </div>
  );
}
