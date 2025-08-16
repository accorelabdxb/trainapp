import { useRouter } from "expo-router"; // Import useRouter
import React from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from '../lib/icons/ChevronRight'; // Ensure this path is correct

const Onboarding = () => { // Corrected: This is the main component
    const router = useRouter(); // Initialize the router inside the component

    // Function to navigate to the Dashboard screen
    const navigateToDashboard = () => {
        router.push('(tabs)/dashboard'); // Navigate to the '/dashboard' route
    };

    return (
        <View className="flex-1 bg-black p-12">
            <Image className="mt-40"
                   source={require('../assets/images/logo.png')}
            />
            <View className="mt-20">
                <Text className="text-white font-bold text-4xl mt-10">Enter OTP</Text>
                <Text className="text-white/50">OTP Sent to <Text className="font-bold text-white">0546787653</Text></Text>
                <TouchableOpacity
                    className="mt-4 bg-input py-1 px-4 rounded-full w-52 justify-between flex flex-row items-center"
                >
                    <Text className="text-white font-normal text-sm">Update Mobile Number</Text>
                    <ChevronRight
                        className="text-white"
                        size={14}
                    />
                </TouchableOpacity>
            </View>
            <View className="mt-10 flex flex-row items-center justify-between">
                <TextInput
                    className="mt-2 bg-input h-20 rounded-xl px-5 text-white text-2xl w-20"
                    keyboardType="numeric"
                    returnKeyType="done"
                />
                <TextInput
                    className="mt-2 bg-input h-20 rounded-xl px-5 text-white text-2xl w-20"
                    keyboardType="numeric"
                    returnKeyType="done"
                />
                <TextInput
                    className="mt-2 bg-input h-20 rounded-xl px-5 text-white text-2xl w-20"
                    keyboardType="numeric"
                    returnKeyType="done"
                />
                <TextInput
                    className="mt-2 bg-input h-20 rounded-xl px-5 text-white text-2xl w-20"
                    keyboardType="numeric"
                    returnKeyType="done"
                />
            </View>

            {/* "Verify OTP" button with navigation */}
            <TouchableOpacity
                className="mt-4 bg-white h-14 rounded-xl items-center justify-center"
                onPress={navigateToDashboard} // <--- Added onPress to navigate to Dashboard
            >
                <Text className="text-black font-normal text-xl">Verify OTP</Text>
            </TouchableOpacity>

            {/* Assuming navigateToDashboardScreen was a typo and you meant to use navigateToDashboard for "Resend OTP" too,
                or perhaps this button should have its own specific action.
                For now, I'll assume it's a separate action and leave it as is, or you can link it to navigateToDashboard
                if that's the desired behavior. If it's for "Resend OTP", it typically wouldn't navigate.
                I've removed the `onPress={navigateToDashboardScreen}` from this button as it seems incorrect for "Resend OTP".
            */}
            <TouchableOpacity
                className="mt-16 bg-input py-1 px-4 rounded-full w-36 justify-between flex flex-row items-center mx-auto"
                activeOpacity={0.9}
            >
                <Text className="text-white font-normal text-sm">Resend OTP</Text>
                <ChevronRight
                    className="text-white"
                    size={14}
                />
            </TouchableOpacity>

        </View>
    );
};

export default Onboarding;

const styles = StyleSheet.create({});