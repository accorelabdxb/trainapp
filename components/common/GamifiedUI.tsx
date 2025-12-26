import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleProp, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

// --- Types ---

interface GameCardProps {
    children: React.ReactNode;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    colors?: [string, string, ...string[]]; // Gradient colors
    depth?: number; // How "deep" the 3D effect is
    disabled?: boolean;
}

interface GameButtonProps {
    title?: string;
    onPress: () => void;
    icon?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'accent' | 'glass';
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    children?: React.ReactNode;
    disabled?: boolean;
}

// --- Constants ---

const SPRING_CONFIG = {
    damping: 10,
    stiffness: 100,
    mass: 1,
};

// --- Components ---

/**
 * A 3D-style card that depresses when pressed.
 * Supports gradients, depth simulation, and entry animations.
 */
export const GameCard: React.FC<GameCardProps> = ({
    children,
    onPress,
    style,
    colors = ['#2A2A2A', '#1F1F1F'], // Default dark grey gradient
    depth = 6,
    disabled = false,
}) => {
    const pressed = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(pressed.value, [0, 1], [1, 0.96]);
        const translateY = interpolate(pressed.value, [0, 1], [0, depth / 2]);
        const shadowOpacity = interpolate(pressed.value, [0, 1], [0.3, 0.1]);
        const elevation = interpolate(pressed.value, [0, 1], [depth, 2], Extrapolation.CLAMP);

        return {
            transform: [{ scale }, { translateY }],
            shadowOpacity,
            elevation,
        };
    });

    const handlePressIn = () => {
        if (disabled) return;
        pressed.value = withSpring(1, SPRING_CONFIG);
    };

    const handlePressOut = () => {
        if (disabled) return;
        pressed.value = withSpring(0, SPRING_CONFIG);
    };

    const InnerContent = (
        <LinearGradient
            colors={colors}
            style={[
                {
                    borderRadius: 20,
                    borderTopWidth: 1,
                    borderLeftWidth: 1,
                    borderColor: 'rgba(255,255,255,0.1)',
                    padding: 16,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: depth },
                    shadowRadius: depth,
                },
                style,
            ]}
        >
            {children}
        </LinearGradient>
    );

    if (onPress) {
        return (
            <Animated.View style={[animatedStyle]}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={onPress}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    disabled={disabled}
                >
                    {InnerContent}
                </TouchableOpacity>
            </Animated.View>
        );
    }

    return <Animated.View style={[animatedStyle]}>{InnerContent}</Animated.View>;
};

/**
 * A specialized button with game-like 3D interaction.
 */
export const GameButton: React.FC<GameButtonProps> = ({
    title,
    onPress,
    icon,
    variant = 'primary',
    style,
    textStyle,
    children,
    disabled = false,
}) => {
    const pressed = useSharedValue(0);

    // Variant Styles
    let bgColors: [string, string, ...string[]];
    let textColor = '#FFF';

    switch (variant) {
        case 'primary':
            bgColors = ['#FF4B1F', '#FF9068']; // Sunset Orange
            break;
        case 'secondary':
            bgColors = ['#4776E6', '#8E54E9']; // Purple/Blue
            break;
        case 'accent':
            bgColors = ['#ffd700', '#eebf00']; // Gold
            textColor = '#000';
            break;
        case 'glass':
            bgColors = ['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)'];
            break;
        default:
            bgColors = ['#333', '#222'];
    }

    const animatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(pressed.value, [0, 1], [1, 0.95]);
        const translateY = interpolate(pressed.value, [0, 1], [0, 4]);

        return {
            transform: [{ scale }, { translateY }],
        };
    });

    return (
        <Animated.View style={[animatedStyle, { marginVertical: 4 }]}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={onPress}
                onPressIn={() => !disabled && (pressed.value = withSpring(1, SPRING_CONFIG))}
                onPressOut={() => !disabled && (pressed.value = withSpring(0, SPRING_CONFIG))}
                disabled={disabled}
            >
                <LinearGradient
                    colors={bgColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                        {
                            paddingVertical: 14,
                            paddingHorizontal: 24,
                            borderRadius: 16,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderTopWidth: 1,
                            borderColor: 'rgba(255,255,255,0.2)',
                            // 3D Shadow
                            shadowColor: variant === 'accent' ? '#FFD700' : '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 5,
                            elevation: 8,
                            opacity: disabled ? 0.6 : 1,
                        } as ViewStyle,
                        style,
                    ]}
                >
                    {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
                    {title && (
                        <Text
                            style={[
                                {
                                    color: textColor,
                                    fontWeight: '700',
                                    fontSize: 16,
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.5,
                                    textShadowColor: 'rgba(0,0,0,0.2)',
                                    textShadowOffset: { width: 0, height: 1 },
                                    textShadowRadius: 2,
                                } as TextStyle,
                                textStyle,
                            ]}
                        >
                            {title}
                        </Text>
                    )}
                    {children}
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
};

export const SectionHeader: React.FC<{ title: string; rightElement?: React.ReactNode }> = ({ title, rightElement }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingHorizontal: 4 }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: 'white', letterSpacing: -0.5 }}>
            {title}
        </Text>
        {rightElement}
    </View>
);
