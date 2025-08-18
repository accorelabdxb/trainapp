// Color palette
export const COLORS = {
  // Primary colors
  primary: "#F0B32D",
  primaryDark: "#D4941A",
  primaryLight: "#F5C855",

  // Background colors
  background: "#000000",
  backgroundSecondary: "#1F1F1F",
  backgroundTertiary: "#2A2A2A",

  // Text colors
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255, 255, 255, 0.7)",
  textTertiary: "rgba(255, 255, 255, 0.5)",
  textDisabled: "rgba(255, 255, 255, 0.3)",

  // Status colors
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",

  // Utility colors
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",

  // Gradient colors
  gradientStart: "#F0B32D",
  gradientEnd: "#D4941A",
} as const;

// Chart configuration
export const CHART_CONFIG = {
  backgroundGradientFrom: "#131514",
  backgroundGradientTo: "#131514",
  decimalPlaces: 0,
  color: () => COLORS.info,
  fillShadowGradient: COLORS.info,
  fillShadowGradientOpacity: 1,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.7})`,
  barPercentage: 0.8,
  useShadowColorFromDataset: false,
  formatYLabel: (yLabel: string) => `${Math.round(parseFloat(yLabel))}h`,
  propsForHorizontalLabels: { strokeWidth: "0" },
  propsForVerticalLabels: { strokeWidth: "0" },
} as const;

// Theme variants
export const THEMES = {
  dark: {
    background: COLORS.background,
    backgroundSecondary: COLORS.backgroundSecondary,
    text: COLORS.textPrimary,
    textSecondary: COLORS.textSecondary,
    primary: COLORS.primary,
    border: "rgba(255, 255, 255, 0.1)",
  },
  light: {
    background: "#FFFFFF",
    backgroundSecondary: "#F5F5F5",
    text: "#000000",
    textSecondary: "rgba(0, 0, 0, 0.7)",
    primary: COLORS.primary,
    border: "rgba(0, 0, 0, 0.1)",
  },
} as const;
