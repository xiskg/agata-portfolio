type LaptopMockupProps = {
  children: React.ReactNode;
};

export function LaptopMockup({ children }: LaptopMockupProps) {
  return (
    <div className="w-full max-w-xl">
      <div className="md:rounded-t-xl md:rounded-b-sm md:bg-[#0a0a0c] md:p-2.5 md:pb-3.5 md:shadow-[inset_0_0_0_2px_#2a2a30]">
        <div className="mx-auto mb-2 hidden h-1.5 w-1.5 rounded-full bg-[#333] md:block" />
        {children}
      </div>
      <div className="relative hidden h-3 rounded-b-lg bg-gradient-to-b from-[#3a3a40] to-[#232327] md:block">
        <div className="absolute left-1/2 top-0 h-1.5 w-16 -translate-x-1/2 rounded-b-md bg-[#17171a]" />
      </div>
    </div>
  );
}
