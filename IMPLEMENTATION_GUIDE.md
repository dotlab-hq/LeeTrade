# LeeTrade UX Redesign: Implementation Guide

## Overview

This guide walks developers through implementing and using the new UX redesign system in LeeTrade applications. It covers all created motion systems, components, and best practices for maintaining consistency across the platform.

---

## Quick Start

### 1. Motion System Foundation

All animations are controlled through a centralized motion system. Three key files control this:

#### Motion Constants (`lib/motion.ts`)
```tsx
import { MOTION_TIMING, STAGGER, DELAYS } from '@/lib/motion'

// Use these constants instead of hardcoding values
const duration = MOTION_TIMING.standard.duration // 300ms
const easing = MOTION_TIMING.standard.easing // cubic-bezier(...)
```

#### Reduced Motion Hook (`hooks/useReducedMotion.ts`)
```tsx
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function MyComponent() {
  const prefersReducedMotion = useReducedMotion()
  
  return (
    <div
      style={{
        transition: prefersReducedMotion 
          ? 'none' 
          : 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      Content
    </div>
  )
}
```

#### Motion Wrapper Components (`ui/motion-wrapper.tsx`)
```tsx
import { MotionWrapper, StaggerMotionWrapper } from '@/components/ui/motion-wrapper'

// Single element animation
<MotionWrapper variant="fade-in" duration={300} delay={100}>
  <div>Fades in after 100ms</div>
</MotionWrapper>

// Staggered list items
<StaggerMotionWrapper variant="slide-up" stagger={50}>
  {items.map(item => <div key={item.id}>{item.name}</div>)}
</StaggerMotionWrapper>
```

---

## Motion Timing Specifications

### Standard Timing Durations

| Duration | Constant | Use Case | Example |
|----------|----------|----------|---------|
| **150ms** | `MOTION_TIMING.quick` | Micro-interactions | Button hover |
| **300ms** | `MOTION_TIMING.standard` | Standard transitions | Page elements, modals |
| **400ms** | `MOTION_TIMING.deliberate` | Deliberate entrances | Page loads |
| **600ms** | `MOTION_TIMING.slow` | Slow transitions | Major page transitions |
| **800ms** | `MOTION_TIMING.infinite` | Infinite loops | Spinners |
| **1500ms** | `MOTION_TIMING.pulse` | Pulse effects | Skeleton screens |

### Easing Functions

| Easing | Type | Use Case |
|--------|------|----------|
| `cubic-bezier(0.4, 0, 0.2, 1)` | ease-out | Standard animations (quick, standard, slow) |
| `cubic-bezier(0.34, 1.56, 0.64, 1)` | ease-out-back | Deliberate animations (pop, bounce) |
| `linear` | linear | Infinite loops (spinners) |
| `cubic-bezier(0.4, 0, 0.6, 1)` | ease-in-out | Pulse animations |

### Stagger Delays

```tsx
import { STAGGER } from '@/lib/motion'

// Apply delays between items in animations
const delayMs = STAGGER.default // 50ms
const delayMs = STAGGER.small   // 30ms
const delayMs = STAGGER.medium  // 75ms
const delayMs = STAGGER.large   // 100ms
```

---

## Component Implementation Patterns

### Enhanced Buttons

Buttons now include built-in motion effects:

```tsx
import { Button } from '@/components/ui/button'

// All variants automatically get:
// - Hover scale: 1.02 (150ms)
// - Active press: 0.98 (instant)
// - Shadow enhancement on hover

<Button variant="default">Click Me</Button>
```

### Enhanced Cards

Cards have integrated hover elevation:

```tsx
import { StatsCard, DataCard } from '@/components/ui/data-cards'

// StatsCard with automatic hover lift animation
<StatsCard
  label="Total Score"
  value="9,842"
  delta="+234"
  deltaPositive={true}
/>

// DataCard with elevation effects
<DataCard 
  title="Card Title"
  description="Optional description"
>
  {/* Content */}
</DataCard>
```

### Enhanced Inputs

Form inputs have smooth focus transitions:

```tsx
import { Input } from '@/components/ui/input'

// Automatic focus state animation (200ms)
// Border color and shadow transition smoothly

<Input 
  placeholder="Enter value..."
  type="text"
/>
```

---

## Page-Level Implementation

### Page Entrance Animations

For page components, wrap content with motion effects:

```tsx
import { MotionWrapper, StaggerMotionWrapper } from '@/components/ui/motion-wrapper'

export function DashboardPage() {
  const [items, setItems] = useState([])

  return (
    <div>
      {/* Page title with fade-in */}
      <MotionWrapper variant="fade-in" duration={300}>
        <h1>Dashboard</h1>
      </MotionWrapper>

      {/* Content sections with stagger */}
      <StaggerMotionWrapper variant="slide-up" stagger={50}>
        {items.map(item => (
          <div key={item.id} className="card">
            {/* Item content */}
          </div>
        ))}
      </StaggerMotionWrapper>
    </div>
  )
}
```

### List Item Animations

For dynamic lists, apply staggered animations:

```tsx
export function ListComponent({ items }) {
  return (
    <StaggerMotionWrapper 
      variant="slide-up" 
      stagger={STAGGER.default}
      as="ul"
    >
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </StaggerMotionWrapper>
  )
}
```

### Modal/Dialog Animations

Modals automatically get scale + fade animations:

```tsx
// Modal component already includes:
// - Enter: scale 0.95 to 1, fade-in (300ms)
// - Exit: scale 1 to 0.95, fade-out (200ms)
// - Backdrop: fade with blur effect

<Dialog>
  <DialogContent>
    {/* Content automatically animates */}
  </DialogContent>
</Dialog>
```

---

## Navigation Enhancements

### App Shell Navigation

The app shell (`layout/app-shell.tsx`) now includes:

1. **Sidebar Smooth Transitions**: 
   - Width animation on open/close
   - Respects motion preferences

2. **Navigation Item Hover Effects**:
   - Background color transition (200ms)
   - Active state highlighting

3. **Button Micro-interactions**:
   - Menu toggle with smooth feedback
   - Settings button with icon transition

```tsx
// App shell automatically provides:
// - Smooth sidebar collapse/expand
// - Active navigation state animation
// - Hover feedback on all buttons
```

---

## Leaderboard Motion System

### Rank Changes

Rankings now include visual feedback:

```tsx
// Automatic animations:
// - Rank number: rank-bump (400ms) 
// - Medal emoji: achievement-pop (600ms)
// - Score: score-up animation (400ms)
// - Row hover: smooth background transition
// - Staggered entrance: 50ms between rows
```

### Status Badges

Status indicators include smooth transitions:

```tsx
<span className="bg-accent-green-soft text-accent-green">
  {/* Automatic transition on status change (200ms) */}
  Final Score
</span>
```

---

## Accessibility Implementation

### Always Check Motion Preference

Every animation must respect `prefers-reduced-motion`:

```tsx
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function AnimatedComponent() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div
      style={{
        // Disable all animations for users who prefer reduced motion
        transition: prefersReducedMotion ? 'none' : 'all 300ms ease-out',
        animation: !prefersReducedMotion 
          ? 'fade-in 300ms ease-out forwards' 
          : 'none'
      }}
    >
      Content
    </div>
  )
}
```

### CSS Media Query Fallback

The global stylesheet includes this fallback:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Color System Usage

### Surface Hierarchy

When building cards or panels, use the surface hierarchy:

```tsx
{/* Main background */}
<div className="bg-canvas">
  {/* Card backgrounds */}
  <div className="bg-surface border border-hairline">
    {/* Elevated content */}
    <div className="bg-surface-elevated">
      {/* Icon/tile background */}
      <div className="bg-surface-card" />
    </div>
  </div>
</div>
```

### Semantic Colors

Use semantic colors for status indicators:

```tsx
{/* Success state */}
<span className="bg-accent-green-soft text-accent-green">
  Success
</span>

{/* Info state */}
<span className="bg-accent-blue-soft text-accent-blue">
  Information
</span>

{/* Warning state */}
<span className="bg-accent-yellow-soft text-accent-yellow">
  Pending
</span>

{/* Error state */}
<span className="bg-accent-red-soft text-accent-red">
  Error
</span>
```

### Text Hierarchy

Maintain proper text color hierarchy:

```tsx
{/* Primary headlines */}
<h1 className="text-ink font-bold">Main Title</h1>

{/* Body text */}
<p className="text-body">Supporting content.</p>

{/* Secondary labels */}
<span className="text-mute text-sm">Metadata</span>

{/* Disabled state */}
<button className="text-ash cursor-not-allowed">Disabled</button>
```

---

## Performance Best Practices

### 1. Use GPU-Accelerated Properties

Always animate `transform` and `opacity` instead of `width/height`:

```tsx
// ✓ Good - GPU accelerated
<div
  style={{
    transition: 'transform 200ms ease-out',
    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)'
  }}
/>

// ✗ Avoid - CPU intensive
<div
  style={{
    transition: 'height 200ms ease-out',
    height: isHovered ? '100px' : '50px'
  }}
/>
```

### 2. CSS Animations Over JavaScript

Prefer CSS keyframes over JavaScript animations:

```tsx
// ✓ Good - CSS animation
<div className="animate-spinner" />

// ✗ Avoid - JavaScript animation
<div ref={ref} /> // Use JS to animate
```

### 3. Reduce Repaints

Batch DOM changes and avoid frequent re-renders:

```tsx
// ✓ Good - Single state update
const [isOpen, setIsOpen] = useState(false)

// ✗ Avoid - Multiple animations triggering reflows
const [x, setX] = useState(0)
const [y, setY] = useState(0)
const [scale, setScale] = useState(1)
```

### 4. Strategic will-change

Use `will-change` only when necessary:

```tsx
// ✓ Use on animated elements
<div style={{ willChange: 'transform' }} />

// ✗ Avoid overuse
<div style={{ willChange: 'transform, opacity, left, top' }} />
```

---

## Testing Animations

### Manual Testing Checklist

- [ ] Test on Chrome (latest)
- [ ] Test on Firefox (latest)
- [ ] Test on Safari (latest)
- [ ] Test on mobile devices
- [ ] Verify motion preferences work
  - [ ] Enable "Reduce motion" in system settings
  - [ ] Verify animations disable gracefully
- [ ] Check performance with DevTools
  - [ ] Open Performance tab
  - [ ] Record while interacting
  - [ ] Verify 60fps frame rate
- [ ] Test keyboard navigation
  - [ ] Tab through elements
  - [ ] Verify focus states visible
  - [ ] Test on screen readers

### Browser DevTools

Use Chrome DevTools to verify animations:

1. **Disable Animations**: 
   - DevTools → Performance → Capture settings → disable animations

2. **Slow Down Animations**:
   - DevTools → Rendering → disable paint flashing
   - DevTools → Animations (Drawer) → Slow down animations

3. **Check Motion Preference**:
   - DevTools → More tools → Rendering
   - Emulate CSS media feature `prefers-reduced-motion`

---

## Migration Guide

### From Old to New System

If updating existing code:

#### Step 1: Replace Inline Transitions
```tsx
// Old
<div style={{ transition: 'all 0.3s' }} />

// New
import { MOTION_TIMING } from '@/lib/motion'
const easing = MOTION_TIMING.standard.easing
<div style={{ transition: `all ${MOTION_TIMING.standard.duration}ms ${easing}` }} />
```

#### Step 2: Add Reduced Motion Check
```tsx
// Old
<div style={{ animation: 'fadeIn 300ms' }} />

// New
import { useReducedMotion } from '@/hooks/useReducedMotion'
const prefersReducedMotion = useReducedMotion()
<div style={{ animation: !prefersReducedMotion ? 'fadeIn 300ms' : 'none' }} />
```

#### Step 3: Use Motion Wrappers
```tsx
// Old
<div>Item</div>

// New
<MotionWrapper variant="fade-in">
  <div>Item</div>
</MotionWrapper>
```

---

## Common Patterns

### Hover Elevation Effect
```tsx
<div
  style={{
    transition: 'transform 200ms ease-out, box-shadow 200ms ease-out'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-2px)'
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0)'
    e.currentTarget.style.boxShadow = 'none'
  }}
/>
```

### Fade-in on Mount
```tsx
import { MotionWrapper } from '@/components/ui/motion-wrapper'

<MotionWrapper variant="fade-in" duration={300}>
  <div>Fades in on mount</div>
</MotionWrapper>
```

### Staggered List
```tsx
import { StaggerMotionWrapper } from '@/components/ui/motion-wrapper'

<StaggerMotionWrapper variant="slide-up" stagger={50}>
  {items.map(item => <div key={item.id}>{item.name}</div>)}
</StaggerMotionWrapper>
```

### Loading State
```tsx
<div style={{ animation: 'pulse 1500ms ease-in-out infinite' }} />
```

---

## Troubleshooting

### Animations Not Playing

**Problem**: Animations defined but not visible
```tsx
// Check:
1. Is useReducedMotion() returning true?
2. Are animations imported from styles/animations.css?
3. Is prefersReducedMotion condition preventing animation?
4. Is animation-play-state: paused somewhere?
```

### Stuttering/Janky Animations

**Problem**: Animation looks choppy
```tsx
// Solutions:
1. Use transform instead of position/width/height
2. Add will-change: 'transform' to animated element
3. Reduce animation complexity
4. Test on higher-end device first
5. Profile with DevTools Performance tab
```

### Motion Preference Not Working

**Problem**: Animations play even with reduced motion enabled
```tsx
// Check:
1. useReducedMotion() hook is imported
2. Animations are inside useReducedMotion() check
3. Both inline styles AND CSS animations are handled
4. System motion preference is actually set
```

### Z-index Issues

**Problem**: Animations appear behind other elements
```tsx
// Solution: Set appropriate z-index
<div style={{ 
  zIndex: 10,
  transition: 'all 300ms ease-out'
}}>
  Content
</div>
```

---

## Further Resources

### Documentation
- [UX_REDESIGN.md](./UX_REDESIGN.md) - Complete motion system design
- [TYPOGRAPHY_GUIDE.md](./TYPOGRAPHY_GUIDE.md) - Typography and color system
- [DESIGN.md](./DESIGN.md) - Original design inspiration

### External Resources
- [Motion Design Principles](https://m3.material.io/styles/motion/overview) - Material Design
- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
- [WCAG Animation Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions)

---

## Support

For questions or issues implementing the UX redesign:

1. Check existing components for examples
2. Review motion system constants
3. Consult the troubleshooting section
4. Compare with UX_REDESIGN.md documentation

---

**Last Updated**: May 12, 2026
**Version**: 1.0.0
**Status**: Production Ready
