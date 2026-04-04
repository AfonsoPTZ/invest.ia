/**
 * Animation Constants
 * Centralized animation definitions used across pages
 * Reduces code duplication for motion animations
 */

// Hero section entrance animation
export const ANIMATION_HERO = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25 }
};

// Content section entrance animation (with delay)
export const ANIMATION_CONTENT = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { delay: 0.2, duration: 0.25 }
};

// Button action entrance animation (with delay)
export const ANIMATION_ACTION = (delay = 0.3) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { delay, duration: 0.25 }
});

// Floating animation for icons in hero
export const ANIMATION_FLOAT = {
  animate: { y: [0, -8, 0] },
  transition: { duration: 2, repeat: Infinity }
};

// Staggered card animation delays
export const ANIMATION_CARD_DELAYS = [0, 0.1, 0.2, 0.3];
