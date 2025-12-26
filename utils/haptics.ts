import * as Haptics from 'expo-haptics';

/**
 * HapticFeedback utility to centralize haptic logic and ensure consistency.
 * Uses expo-haptics.
 */
export const HapticFeedback = {
    /**
     * Light feedback for standard taps, toggle switches, etc.
     */
    light: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },

    /**
     * Medium feedback for distinctive actions, like expanding a card.
     */
    medium: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    },

    /**
     * Heavy feedback for destructive actions or significant events.
     */
    heavy: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    },

    /**
     * Selection feedback for scrolling through lists or pickers.
     */
    selection: () => {
        Haptics.selectionAsync();
    },

    /**
     * Success notification feedback.
     */
    success: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },

    /**
     * Error notification feedback.
     */
    error: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    },

    /**
     * Warning notification feedback.
     */
    warning: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    },
};
