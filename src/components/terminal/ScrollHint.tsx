const COLLAPSE_AT = 0.3;
const HINT_HEIGHT_PX = 56;

type ScrollHintProps = {
  progress: number;
  reducedMotion: boolean;
};

export function ScrollHint({ progress, reducedMotion }: ScrollHintProps) {
  const collapseProgress = Math.min(progress / COLLAPSE_AT, 1);
  const height = HINT_HEIGHT_PX * (1 - collapseProgress);

  if (height <= 0) return null;

  return (
    <div className="overflow-hidden" style={{ height, opacity: 1 - collapseProgress }}>
      <div className="flex flex-col items-center gap-2 text-[#8a8f98]">
        <span className="text-sm">Scroll to begin</span>
        <span className={`text-lg ${reducedMotion ? "" : "animate-[nudge-down_1.8s_ease-in-out_infinite]"}`}>↓</span>
      </div>
    </div>
  );
}
