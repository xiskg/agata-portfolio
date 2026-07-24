type TerminalWindowProps = {
  children: React.ReactNode;
  className?: string;
};

export function TerminalWindow({ children, className }: TerminalWindowProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-[#17171d] font-mono text-[11px] leading-relaxed md:rounded-md md:text-[13px] ${className ?? ""}`}
    >
      <div className="flex items-center gap-1.5 bg-[#0c0c10] px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      </div>
      <div className="crt-glow flex h-[320px] flex-col justify-end overflow-hidden px-4 py-3 text-[#d4d4dc]">
        {children}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(to bottom, rgba(0, 0, 0, 0.18) 0px, rgba(0, 0, 0, 0.18) 1px, transparent 1px, transparent 3px), radial-gradient(ellipse at center, transparent 55%, rgba(0, 0, 0, 0.35) 100%)",
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[rgba(20,90,80,0.08)]" />
    </div>
  );
}
