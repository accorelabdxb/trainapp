import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useProfile } from "../context/hooks/useProfile";
import { authAPI } from "../utils/api";
import { tokenManager } from "../utils/tokenManager";

export default function Home() {
  const router = useRouter();
  const { setLoading, setError, setUser, setOtpSent, isLoading } = useProfile();
  const [phoneNumber, setPhoneNumber] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Handle keyboard events for Android
  useEffect(() => {
    if (Platform.OS === "android") {
      const keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        () => {
          // Simple approach: just scroll to end when keyboard shows
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 300);
        }
      );

      const keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        () => {
          // Scroll back to top when keyboard hides
          setTimeout(() => {
            scrollViewRef.current?.scrollTo({ y: 0, animated: true });
          }, 100);
        }
      );

      return () => {
        keyboardDidShowListener?.remove();
        keyboardDidHideListener?.remove();
      };
    }
  }, []);

  // Handle input focus for Android scrolling
  const handleInputFocus = () => {
    if (Platform.OS === "android") {
      // Simple approach: scroll to end when input is focused
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 300);
    }
  };

  const handleLogin = async () => {
    console.log("handleLogin", phoneNumber);
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert("Error", "Please enter a valid phone number");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Send OTP
      const response = await authAPI.sendOtp(phoneNumber);
      console.log("res::", response);
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
      console.error("Login error:", JSON.stringify(error));

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
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      enabled={Platform.OS === "ios"}>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <ScrollView
          ref={scrollViewRef}
          className='flex-1 bg-black'
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: Platform.OS === "android" ? 320 : 0,
          }}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
          bounces={false}>
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
                keyboardType='phone-pad'
                returnKeyType='done'
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                onFocus={handleInputFocus}
                placeholder='+1 (555) 123-4567'
                placeholderTextColor='#666'
                editable={!isLoading}
                maxLength={15}
                autoComplete='tel'
              />
            </View>

            <TouchableOpacity
              className={`mt-4 h-14 rounded-xl items-center justify-center ${
                !phoneNumber || phoneNumber.length < 10 || isLoading
                  ? "bg-gray-400"
                  : "bg-white"
              }`}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={!phoneNumber || phoneNumber.length < 10 || isLoading}>
              <Text className='text-black font-normal text-xl'>
                {isLoading ? "Sending OTP..." : "Log in"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
