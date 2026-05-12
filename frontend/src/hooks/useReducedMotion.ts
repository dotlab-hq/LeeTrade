/**
 * useReducedMotion Hook
 * Detects user's motion preference and disables animations accordingly
 * Respects prefers-reduced-motion media query
 */

import { useEffect, useState } from 'react';

/**
 * Hook to detect if user prefers reduced motion
 * @returns {boolean} true if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check initial preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Helper function to get animation duration based on motion preference
 * @param duration - Normal duration in ms
 * @param reducedDuration - Duration when motion is reduced (default: 0)
 * @returns Duration based on user's motion preference
 */
export function getMotionDuration(
  duration: number,
  reducedDuration: number = 0
): number {
  if (typeof window === 'undefined') return duration;

  const prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  return prefersReduced ? reducedDuration : duration;
}

/**
 * Helper to get animation delay based on motion preference
 * @param delay - Normal delay in ms
 * @param reducedDelay - Delay when motion is reduced (default: 0)
 * @returns Delay based on user's motion preference
 */
export function getMotionDelay(delay: number, reducedDelay: number = 0): number {
  if (typeof window === 'undefined') return delay;

  const prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  return prefersReduced ? reducedDelay : delay;
}
