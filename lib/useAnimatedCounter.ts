"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Animated counter hook — springs from 0 to target value.
 * Uses requestAnimationFrame for smooth 60fps counting.
 * Only animates once when the element scrolls into view via IntersectionObserver.
 */
export function useAnimatedCounter(
  target: number,
  duration: number = 1200,
  decimals: number = 0
) {
  const [value, setValue] = useState(0);
  const hasAnimated = useRef(false);
  const elementRef = useRef<Element | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const startAnimation = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      setValue(Number(current.toFixed(decimals)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration, decimals]);

  // Callback ref — compatible with any element type
  const ref = useCallback(
    (node: HTMLElement | null) => {
      // Cleanup previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (node) {
        elementRef.current = node;
        observerRef.current = new IntersectionObserver(
          (entries) => {
            if (entries[0]?.isIntersecting) {
              startAnimation();
              observerRef.current?.disconnect();
            }
          },
          { threshold: 0.5 }
        );
        observerRef.current.observe(node);
      }
    },
    [startAnimation]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return { value, ref };
}
