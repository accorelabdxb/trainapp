import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useProfile } from "../context/hooks/useProfile";
import { authAPI } from "../utils/api";
import { tokenManager } from "../utils/tokenManager";

export default function Home() {
  const router = useRouter();
  const { setLoading, setError, setUser, setOtpSent, isLoading } = useProfile();
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleLogin = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert("Error", "Please enter a valid phone number");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Send OTP
      const response = await authAPI.sendOtp(phoneNumber);
      console.log(JSON.stringify(response, null, 2));
      // Store phone number in profile context
      setUser({
        id: "",
        isProfileExist: response?.success?.isProfileExist,
        mobileNumber: phoneNumber,
      });

      setOtpSent(true);

      // Navigate to onboarding
      router.push("/onboarding");
    } catch (error: any) {
      console.error("Login error:", error);

      // Handle token expiration error
      if (tokenManager.isTokenExpiredError(error)) {
        Alert.alert(
          "Session Expired",
          "Your session has expired. Please log in again.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/"),
            },
          ]
        );
        return;
      }

      setError(
        error.response?.data?.message || "Failed to send OTP. Please try again."
      );
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className='flex-1 bg-black'
      behavior={Platform.OS === "ios" ? "padding" : "height"} // This line already sets Android behavior to "height"
    >
      <View className='flex-1 bg-black p-12'>
        <Image
          className='mt-40'
          source={require("../assets/images/logo.png")}
        />
        <View className='mt-20'>
          <Text className='text-white font-bold text-4xl mt-10'>
            Sign in to your Account
          </Text>
          <Text className='text-white/50'>
            Enter your Mobile number to continue
          </Text>
        </View>
        <View className='mt-10'>
          <Text className='text-white'>Enter Mobile number</Text>
          <TextInput
            className='mt-2 bg-input h-14 rounded-xl px-5 text-white text-2xl'
            keyboardType='numeric'
            returnKeyType='done'
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder='Enter your phone number'
            placeholderTextColor='#666'
            editable={!isLoading}
          />
        </View>

        <TouchableOpacity
          className='mt-4 bg-white h-14 rounded-xl items-center justify-center'
          onPress={handleLogin}
          activeOpacity={0.9}
          disabled={!phoneNumber || phoneNumber.length < 10 || isLoading}
          style={{
            opacity:
              !phoneNumber || phoneNumber.length < 10 || isLoading ? 0.5 : 1,
          }}>
          <Text className='text-black font-normal text-xl'>
            {isLoading ? "Sending OTP..." : "Log in"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
