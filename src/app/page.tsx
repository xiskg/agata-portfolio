import { ScrollTerminal } from "@/components/terminal/ScrollTerminal";
import { ResumeFallback } from "@/components/ResumeFallback";
import { SkipLink } from "@/components/SkipLink";

export default function Home() {
  return (
    <>
      <SkipLink />
      <main>
        <ScrollTerminal />
        <ResumeFallback />
      </main>
    </>
  );
}
