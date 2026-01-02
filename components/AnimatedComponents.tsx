import { HapticFeedback } from '@/utils/haptics';
import { Heart } from 'lucide-react-native';
import React from 'react';
import { Pressable, PressableProps, StyleSheet, View, ViewProps } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import Animated, {
    Easing,
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';

// --- ScalePress ---
// A Pressable that scales down slightly when pressed and triggers haptic feedback.

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ScalePressProps extends PressableProps {
    scaleActive?: number;
    haptic?: boolean;
}

export const ScalePress: React.FC<ScalePressProps> = ({
    children,
    style,
    scaleActive = 0.98,
    haptic = true,
    onPressIn,
    onPressOut,
    onPress,
    ...props
}) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const handlePressIn = (e: any) => {
        scale.value = withSpring(scaleActive, { damping: 10, stiffness: 300 });
        if (haptic) HapticFeedback.light();
        onPressIn?.(e);
    };

    const handlePressOut = (e: any) => {
        scale.value = withSpring(1, { damping: 10, stiffness: 300 });
        onPressOut?.(e);
    };

    return (
        <AnimatedPressable
            style={[style as any, animatedStyle]}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
            {...props}
        >
            {children}
        </AnimatedPressable>
    );
};

// --- FadeInView ---
// A wrapper for entering animations (staggered lists, cascading cards).

interface FadeInViewProps extends ViewProps {
    delay?: number;
    duration?: number;
    index?: number; // Useful for staggering lists
}

export const FadeInView: React.FC<FadeInViewProps> = ({
    children,
    style,
    delay = 0,
    duration = 500,
    index = 0,
    ...props
}) => {
    // If index is provided, auto-calculate delay (e.g., 100ms per item)
    const finalDelay = index > 0 ? delay + index * 100 : delay;

    return (
        <Animated.View
            entering={FadeInDown.delay(finalDelay).duration(duration).springify()}
            style={style}
            {...props}
        >
            {children}
        </Animated.View>
    );
};

// --- PulseView ---
// A wrapper that pulses its opacity/scale to draw attention (e.g., active timer).

interface PulseViewProps extends ViewProps {
    active?: boolean;
}

export const PulseView: React.FC<PulseViewProps> = ({
    children,
    style,
    active = true,
    ...props
}) => {
    const opacity = useSharedValue(1);

    React.useEffect(() => {
        if (active) {
            opacity.value = withRepeat(
                withSequence(
                    withTiming(0.6, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
                    withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
                ),
                -1, // Infinite repeat
                true // Reverse
            );
        } else {
            opacity.value = withTiming(1);
        }
    }, [active]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    return (
        <Animated.View style={[style, animatedStyle]} {...props}>
            {children}
        </Animated.View>
    );
};

// --- Skeleton ---
// A shimmering placeholder for loading states.

interface SkeletonProps extends ViewProps {
    width?: number | string;
    height?: number | string;
    borderRadius?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    width = "100%",
    height = 20,
    borderRadius = 4,
    style,
    ...props
}) => {
    const opacity = useSharedValue(0.3);

    React.useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(0.7, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.3, { duration: 1000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    return (
        <Animated.View
            style={[
                {
                    width: width as any,
                    height: height as any,
                    borderRadius,
                    backgroundColor: "#333",
                },
                style,
                animatedStyle,
            ]}
            {...props}
        />
    );
};

// --- HeartBurst ---
// A bursting heart animation for Likes.

export const HeartBurst: React.FC = () => {
    const scale = useSharedValue(0);
    const opacity = useSharedValue(0);

    React.useEffect(() => {
        scale.value = withSequence(
            withSpring(1.2, { damping: 10, stiffness: 200 }),
            withSpring(1, { damping: 10, stiffness: 200 })
        );
        opacity.value = withSequence(
            withTiming(1, { duration: 100 }),
            withTiming(1, { duration: 500 }),
            withTiming(0, { duration: 300 })
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
            opacity: opacity.value,
        };
    });

    return (
        <Animated.View
            style={[
                {
                    position: "absolute",
                    alignSelf: "center",
                    top: "35%",
                    zIndex: 50,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                },
                animatedStyle,
            ]}
            pointerEvents="none"
        >
            <Heart size={80} color="white" fill="white" />
        </Animated.View>
    );
};

// --- AnimatedTabIcon ---
// Scales up when focused.

interface AnimatedTabIconProps {
    focused: boolean;
    children: React.ReactNode;
}

export const AnimatedTabIcon: React.FC<AnimatedTabIconProps> = ({
    focused,
    children,
}) => {
    const scale = useSharedValue(1);

    React.useEffect(() => {
        if (focused) {
            scale.value = withSequence(
                withSpring(1.2, { damping: 10, stiffness: 200 }),
                withSpring(1, { damping: 10, stiffness: 200 })
            );
        } else {
            scale.value = withSpring(1);
        }
    }, [focused]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    return (
        <Animated.View style={animatedStyle}>
            {children}
        </Animated.View>
    );
};

// --- Celebration ---
// Full screen confetti explosion.
interface CelebrationProps {
    trigger: boolean;
    onFinished?: () => void;
}

export const Celebration: React.FC<CelebrationProps> = ({ trigger, onFinished }) => {
    if (!trigger) return null;

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <ConfettiCannon
                count={200}
                origin={{ x: -10, y: 0 }}
                autoStart={true}
                fadeOut={true}
                onAnimationEnd={onFinished}
            />
        </View>
    );
};
