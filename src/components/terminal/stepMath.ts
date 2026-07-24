export function progressToStepIndex(progress: number, totalSteps: number): number {
  if (totalSteps <= 0) return 0;
  const clamped = Math.min(Math.max(progress, 0), 1);
  return clamped * totalSteps;
}
