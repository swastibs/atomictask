import useIntersectionObserver from "./useIntersectionObserver";

/** Shared scroll animation hook used by landing sections. */
export default function useScrollAnimation() {
  const { ref, isVisible } = useIntersectionObserver();
  return { ref, className: isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5" };
}
