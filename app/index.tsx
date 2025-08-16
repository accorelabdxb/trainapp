import { useRouter } from 'expo-router';
import React from 'react';
import { Image, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Home() {
    const router = useRouter();

    const navigateToOnboardingScreen = () => {
        router.push('/onboarding');
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-black"
            behavior={Platform.OS === "ios" ? "padding" : "height"} // This line already sets Android behavior to "height"
        >
            <View className="flex-1 bg-black p-12">
                <Image className="mt-40"
                       source={require('../assets/images/logo.png')}
                />
                <View className="mt-20">
                    <Text className="text-white font-bold text-4xl mt-10">Sign in to your Account</Text>
                    <Text className="text-white/50">Enter your Mobile number to continue</Text>
                </View>
                <View className="mt-10">
                    <Text className="text-white">Enter Mobile number</Text>
                    <TextInput
                        className="mt-2 bg-input h-14 rounded-xl px-5 text-white text-2xl"
                        keyboardType="numeric"
                        returnKeyType="done"
                    />
                </View>

                <TouchableOpacity
                    className="mt-4 bg-white h-14 rounded-xl items-center justify-center"
                    onPress={navigateToOnboardingScreen}
                    activeOpacity={0.9}
                >
                    <Text className="text-black font-normal text-xl">Log in</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}