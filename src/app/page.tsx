import { ScrollTerminal } from "@/components/terminal/ScrollTerminal";
import { InteractiveTerminal } from "@/components/terminal/InteractiveTerminal";
import { ResumeFallback } from "@/components/ResumeFallback";
import { SkipLink } from "@/components/SkipLink";

export default function Home() {
  return (
    <>
      <SkipLink />
      <main>
        <ScrollTerminal />
        <section className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 py-24">
          <p className="max-w-md text-center text-sm text-[#a0a0a8]">
            Type a command to keep exploring — try &apos;help&apos;.
          </p>
          <div className="w-full max-w-xl">
            <InteractiveTerminal />
          </div>
        </section>
        <ResumeFallback />
      </main>
    </>
  );
}
