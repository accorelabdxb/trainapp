
import { X } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onDismiss]);

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return '#22c55e'; // green-500
            case 'error':
                return '#ef4444'; // red-500
            case 'info':
            default:
                return '#3b82f6'; // blue-500
        }
    };

    return (
        <Animated.View
            entering={FadeInDown.springify()}
            exiting={FadeOutUp}
            style={[styles.container, { backgroundColor: getBackgroundColor() }]}
        >
            <Text style={styles.text}>{message}</Text>
            <TouchableOpacity onPress={onDismiss} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <X size={20} color="white" />
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60, // Adjust based on header height/safe area
        left: 20,
        right: 20,
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 9999,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    text: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
        flex: 1,
        marginRight: 10,
    },
});
