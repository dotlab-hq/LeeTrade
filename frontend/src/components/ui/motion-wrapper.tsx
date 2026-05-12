/**
 * MotionWrapper Component
 * Reusable component for applying motion effects with reduced motion support
 */

import { ReactNode, useEffect, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { MotionVariant } from '@/lib/motion';

interface MotionWrapperProps {
  /** Child elements to wrap */
  children: ReactNode;
  /** Type of animation to apply */
  variant?: 'fade-in' | 'slide-up' | 'slide-down' | 'scale' | 'none';
  /** Duration in milliseconds */
  duration?: number;
  /** Delay before animation starts in milliseconds */
  delay?: number;
  /** CSS class names to apply */
  className?: string;
  /** Stagger animation for multiple children (in milliseconds) */
  stagger?: number;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

export function MotionWrapper({
  children,
  variant = 'fade-in',
  duration = 300,
  delay = 0,
  className = '',
  stagger = 0,
  style = {},
}: MotionWrapperProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(!delay && !prefersReducedMotion);

  useEffect(() => {
    if (!delay) return;

    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay]);

  if (prefersReducedMotion || variant === 'none') {
    return <div className={className}>{children}</div>;
  }

  const animationClass = {
    'fade-in': 'animate-fade-in',
    'slide-up': 'animate-slide-up',
    'slide-down': 'animate-slide-down',
    'scale': 'animate-card-enter',
    'none': '',
  }[variant];

  const animationStyle: React.CSSProperties = {
    animation: isVisible
      ? `${variant === 'slide-up' ? 'slide-up' : variant === 'slide-down' ? 'slide-down' : variant === 'scale' ? 'card-entrance' : 'fade-in'} ${duration}ms cubic-bezier(0.4, 0, 0.2, 1) forwards`
      : 'none',
    ...style,
  };

  return (
    <div className={animationClass} style={animationStyle}>
      {children}
    </div>
  );
}

/**
 * StaggerMotionWrapper Component
 * Applies staggered animations to multiple children
 */

interface StaggerMotionWrapperProps {
  /** Child elements (should be an array) */
  children: ReactNode;
  /** Type of animation for each child */
  variant?: 'fade-in' | 'slide-up' | 'slide-down' | 'scale';
  /** Duration per item in milliseconds */
  duration?: number;
  /** Delay between each child in milliseconds */
  stagger?: number;
  /** CSS class for wrapper */
  className?: string;
  /** Optional container tag (default: div) */
  as?: 'div' | 'ul' | 'ol';
}

export function StaggerMotionWrapper({
  children,
  variant = 'slide-up',
  duration = 300,
  stagger = 50,
  className = '',
  as: Component = 'div',
}: StaggerMotionWrapperProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <Component className={className}>{children}</Component>;
  }

  const childArray = Array.isArray(children)
    ? children
    : children
      ? [children]
      : [];

  const animationClass = {
    'fade-in': 'animate-fade-in',
    'slide-up': 'animate-slide-up',
    'slide-down': 'animate-slide-down',
    'scale': 'animate-card-enter',
  }[variant];

  return (
    <Component className={className}>
      {childArray.map((child, index) => {
        const animationStyle: React.CSSProperties = {
          animation: `${variant === 'slide-up' ? 'slide-up' : variant === 'slide-down' ? 'slide-down' : variant === 'scale' ? 'card-entrance' : 'fade-in'} ${duration}ms cubic-bezier(0.4, 0, 0.2, 1) forwards`,
          animationDelay: `${index * stagger}ms`,
        };

        return (
          <div key={index} style={animationStyle}>
            {child}
          </div>
        );
      })}
    </Component>
  );
}

/**
 * TransitionMotionWrapper Component
 * Handles transitions between visibility states
 */

interface TransitionMotionWrapperProps {
  children: ReactNode;
  isVisible: boolean;
  enterVariant?: 'fade-in' | 'slide-up' | 'slide-down' | 'scale';
  exitVariant?: 'fade-out' | 'slide-up' | 'slide-down';
  duration?: number;
  className?: string;
}

export function TransitionMotionWrapper({
  children,
  isVisible,
  enterVariant = 'fade-in',
  exitVariant = 'fade-out',
  duration = 300,
  className = '',
}: TransitionMotionWrapperProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return isVisible ? <div className={className}>{children}</div> : null;
  }

  if (!isVisible) {
    return null;
  }

  const animationClass = {
    'fade-in': 'animate-fade-in',
    'fade-out': 'animate-fade-out',
    'slide-up': 'animate-slide-up',
    'slide-down': 'animate-slide-down',
    'scale': 'animate-card-enter',
  }[enterVariant];

  return (
    <div className={`${animationClass} ${className}`}>{children}</div>
  );
}
