import usePrefersReducedMotion from "./usePrefersReducedMotion";

/** Detects constrained devices so decorative work can be reduced early. */
export default function usePerformance() {
  const reducedMotion = usePrefersReducedMotion();
  const memory = typeof navigator === "undefined" ? 8 : navigator.deviceMemory || 8;
  const cores = typeof navigator === "undefined" ? 8 : navigator.hardwareConcurrency || 8;
  const lowSpec = memory <= 4 || cores <= 4;

  return { lowSpec, reducedMotion, animationEnabled: !reducedMotion && !lowSpec };
}
