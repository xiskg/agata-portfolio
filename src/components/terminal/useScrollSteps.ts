"use client";

import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { progressToStepIndex } from "./stepMath";

export function useScrollSteps(totalSteps: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const stepIndexMotion = useTransform(scrollYProgress, (progress) => progressToStepIndex(progress, totalSteps));

  const [stepIndex, setStepIndex] = useState(0);
  useMotionValueEvent(stepIndexMotion, "change", (latest) => setStepIndex(latest));

  return { containerRef, stepIndex };
}
