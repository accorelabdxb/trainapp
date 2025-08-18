// App-specific constants
export const DEFAULT_POINTS_BALANCE = 500;
export const CONFETTI_COUNT = 200;
export const VIDEO_CONTROLS_TIMEOUT = 5000;

// API endpoints (when you integrate real APIs)
export const API_ENDPOINTS = {
  base: "https://api.yourapp.com",
  auth: "/auth",
  user: "/user",
  challenges: "/challenges",
  rewards: "/rewards",
  leaderboard: "/leaderboard",
} as const;

// Storage keys
export const STORAGE_KEYS = {
  user: "@user",
  theme: "@theme",
  notifications: "@notifications",
  onboarding: "@onboarding_completed",
} as const;

// App limits
export const LIMITS = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxVideoLength: 60, // seconds
  maxChallenges: 10,
  minPointsToRedeem: 50,
} as const;

// Notification types
export const NOTIFICATION_TYPES = {
  challenge: "challenge",
  reward: "reward",
  achievement: "achievement",
  reminder: "reminder",
} as const;
