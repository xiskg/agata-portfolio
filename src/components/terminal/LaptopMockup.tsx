type LaptopMockupProps = {
  children: React.ReactNode;
};

export function LaptopMockup({ children }: LaptopMockupProps) {
  return (
    <div className="w-full max-w-[340px] md:max-w-xl">
      <div className="overflow-hidden rounded-[1.75rem] bg-[#0a0a0c] p-2 shadow-[inset_0_0_0_2px_#2a2a30] md:rounded-t-xl md:rounded-b-sm md:p-2.5 md:pb-3.5">
        <div className="mx-auto mb-1.5 h-1.5 w-10 rounded-full bg-[#1c1c20] md:hidden" />
        <div className="mx-auto mb-2 hidden h-1.5 w-1.5 rounded-full bg-[#333] md:block" />
        {children}
      </div>
      <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-[#2a2a30] md:hidden" />
      <div className="relative hidden h-3 rounded-b-lg bg-gradient-to-b from-[#3a3a40] to-[#232327] md:block">
        <div className="absolute left-1/2 top-0 h-1.5 w-16 -translate-x-1/2 rounded-b-md bg-[#17171a]" />
      </div>
    </div>
  );
}
