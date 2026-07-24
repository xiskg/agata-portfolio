type LandingCoverProps = {
  progress: number;
};

export function LandingCover({ progress }: LandingCoverProps) {
  if (progress >= 1) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-none bg-[#17171d] md:rounded-md"
      style={{ opacity: 1 - progress, transform: `scale(${1 + progress * 0.08})` }}
    >
      <span
        className="h-2.5 w-2.5 rounded-full bg-[#6ad3ff]"
        style={{ boxShadow: "0 0 12px 2px rgba(106, 211, 255, 0.6)" }}
      />
    </div>
  );
}
