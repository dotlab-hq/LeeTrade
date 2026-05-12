/**
 * Motion System - Timing Constants and Configuration
 * Standardized timing values for animations across the application
 */

export const MOTION_TIMING = {
  // Quick interactions - micro interactions and hover states
  quick: {
    duration: 150, // 0.15s
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // ease-out
  },

  // Standard transitions - page elements, modals, state changes
  standard: {
    duration: 300, // 0.3s
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // ease-out
  },

  // Deliberate entrances - page loads, complex animations, data reveals
  deliberate: {
    duration: 400, // 0.4s
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // ease-out-back
  },

  // Slow transitions - major page transitions
  slow: {
    duration: 600, // 0.6s
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // ease-out
  },

  // Infinite loops - spinners, pulses, loaders
  infinite: {
    duration: 800, // 0.8s
    easing: 'linear',
  },

  // Pulse for skeleton/loading states
  pulse: {
    duration: 1500, // 1.5s
    easing: 'cubic-bezier(0.4, 0, 0.6, 1)', // ease-in-out
  },
} as const;

export const STAGGER = {
  // Default stagger delay between items
  default: 50, // 50ms
  small: 30, // 30ms
  medium: 75, // 75ms
  large: 100, // 100ms
} as const;

export const DELAYS = {
  // Modal backdrop delay
  backdrop: 80, // 80ms
  // Tooltip/popover delay
  tooltip: 200, // 200ms
} as const;

// CSS variable names for use in @theme blocks
export const MOTION_CSS_VARS = {
  timingQuick: 'var(--motion-timing-quick)',
  timingStandard: 'var(--motion-timing-standard)',
  timingDeliberate: 'var(--motion-timing-deliberate)',
  timingSlow: 'var(--motion-timing-slow)',
  timingInfinite: 'var(--motion-timing-infinite)',
  timingPulse: 'var(--motion-timing-pulse)',
} as const;

export type MotionVariant = keyof typeof MOTION_TIMING;
