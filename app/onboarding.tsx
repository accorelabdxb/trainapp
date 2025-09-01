import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useProfile } from "../context/hooks/useProfile";
import { ChevronRight } from "../lib/icons/ChevronRight";
import { authAPI } from "../utils/api";
import { tokenManager } from "../utils/tokenManager";

const Onboarding = () => {
  const router = useRouter();
  const { user, setLoading, setError, setUser, setOtpVerified, isLoading } =
    useProfile();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<TextInput[]>([]);

  // Function to navigate to the Dashboard screen
  const navigateToDashboard = () => {
    router.push("/(tabs)/dashboard");
  };

  // Handle OTP input change
  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input
    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 4) {
      Alert.alert("Error", "Please enter a valid 4-digit OTP");
      return;
    }

    if (!user?.mobileNumber) {
      Alert.alert(
        "Error",
        "No mobile number found. Please try logging in again."
      );
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Verify OTP
      const response = await authAPI.verifyOtp(user.mobileNumber, otpString);

      // Get the access token from response
      const accessToken = response.token || response.accessToken;

      if (!accessToken && user.isProfileExist) {
        throw new Error("No access token received from server");
      }

      // Validate token format
      if (!user.isProfileExist && !tokenManager.isValidToken(accessToken)) {
        console.warn("Received invalid token format from server");
      }

      // Update user with authentication data and store securely
      const updatedUser = {
        ...user,
        isAuthenticated: response.isOtpVerified,
        token: accessToken,
        id: response.userId || response.id,
      };

      await setUser(updatedUser);
      setOtpVerified(true);

      // Navigate based on profile existence
      if (response?.isOtpVerified) {
        // Navigate to create account screen
        if (!user?.isProfileExist) router.push("/create-account");
        else navigateToDashboard();
      }
    } catch (error: any) {
      console.error("OTP verification error:", JSON.stringify(error, null, 2));

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
        error.response?.data?.message || "Invalid OTP. Please try again."
      );
      Alert.alert(
        "Error",
        error.response?.data?.message || "Invalid OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    if (!user?.mobileNumber) {
      Alert.alert(
        "Error",
        "No mobile number found. Please try logging in again."
      );
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await authAPI.sendOtp(user.mobileNumber);
      Alert.alert("Success", "OTP has been resent to your mobile number");
    } catch (error: any) {
      console.error("Resend OTP error:", error);

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
        error.response?.data?.message ||
          "Failed to resend OTP. Please try again."
      );
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Failed to resend OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className='flex-1 bg-black p-12'>
      <Image
        className='mt-40'
        source={require("../assets/images/logo.png")}
      />
      <View className='mt-20'>
        <Text className='text-white font-bold text-4xl mt-10'>Enter OTP</Text>
        <Text className='text-white/50'>
          OTP Sent to{" "}
          <Text className='font-bold text-white'>
            {user?.mobileNumber || "0546787653"}
          </Text>
        </Text>
        <TouchableOpacity className='mt-4 bg-input py-1 px-4 rounded-full w-52 justify-between flex flex-row items-center'>
          <Text className='text-white font-normal text-sm'>
            Update Mobile Number
          </Text>
          <ChevronRight
            className='text-white'
            size={14}
          />
        </TouchableOpacity>
      </View>
      <View className='mt-10 flex flex-row items-center justify-between'>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              if (ref) inputRefs.current[index] = ref;
            }}
            className='mt-2 bg-input rounded-xl px-5 text-white text-2xl h-20 w-20 text-center'
            keyboardType='numeric'
            returnKeyType='done'
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleOtpChange(text, index)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === "Backspace" && !digit && index > 0) {
                inputRefs.current[index - 1]?.focus();
              }
            }}
            editable={!isLoading}
          />
        ))}
      </View>

      {/* "Verify OTP" button with navigation */}
      <TouchableOpacity
        className='mt-4 bg-white h-14 rounded-xl items-center justify-center'
        onPress={handleVerifyOtp}
        disabled={otp.join("").length !== 4 || isLoading}
        activeOpacity={otp.join("").length === 4 && !isLoading ? 0.9 : 0.5}
        style={{
          opacity: otp.join("").length !== 4 || isLoading ? 0.5 : 1,
        }}>
        <Text className='text-black font-normal text-xl'>
          {isLoading ? "Verifying..." : "Verify OTP"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className='mt-16 bg-input py-1 px-4 rounded-full w-36 justify-between flex flex-row items-center mx-auto'
        activeOpacity={0.9}
        onPress={handleResendOtp}
        disabled={isLoading}
        style={{
          opacity: isLoading ? 0.5 : 1,
        }}>
        <Text className='text-white font-normal text-sm'>
          {isLoading ? "Sending..." : "Resend OTP"}
        </Text>
        <ChevronRight
          className='text-white'
          size={14}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Onboarding;
