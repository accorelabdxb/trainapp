// Animation constants
export const ANIMATION_DURATION = 300;
export const WAVE_ANIMATION_DURATION = 300;
export const WAVE_PAUSE_DURATION = 500;

// Animation easing
export const ANIMATION_EASING = {
  ease: "ease",
  linear: "linear",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
} as const;

// Spring animation configs
export const SPRING_CONFIG = {
  tension: 30,
  friction: 7,
} as const;

// Gesture animation thresholds
export const GESTURE_THRESHOLDS = {
  swipeVelocity: 1000,
  panDistance: 50,
  longPressDelay: 500,
} as const;
