import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "@/store/slices/authApi";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
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
  View,
} from "react-native";
import { useProfile } from "../context/hooks/useProfile";
import { ChevronRight } from "../lib/icons/ChevronRight";
import { tokenManager } from "../utils/tokenManager";

const Onboarding = () => {
  const router = useRouter();
  const { user, setLoading, setError, setUser, setOtpVerified } = useProfile();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [sendOtp, { isLoading: isSending }] = useSendOtpMutation();
  const isLoading = isVerifying || isSending;

  // Changed to string state for hidden input pattern logic
  const [otp, setOtp] = useState("");
  const inputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Handle keyboard events for Android
  useEffect(() => {
    if (Platform.OS === "android") {
      const keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        () => {
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 300);
        }
      );

      const keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        () => {
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

  // Function to navigate to the Dashboard screen
  const navigateToDashboard = () => {
    router.push("/(tabs)/dashboard");
  };
  const updateMobileNumber = () => {
    router.push("/");
  };

  // Handle input focus for Android scrolling
  const handleInputFocus = () => {
    if (Platform.OS === "android") {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 300);
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    if (otp.length !== 4) {
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

      // Verify OTP using RTK Query
      const response = await verifyOtp({
        mobileNumber: user.mobileNumber,
        otp: otp,
      }).unwrap();

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
      console.error("OTP verification error object:", error);
      console.error("OTP verification error stringified:", JSON.stringify(error, null, 2));
      if (error && typeof error === 'object') {
        console.error("Error keys:", Object.keys(error));
        if ('status' in error) console.error("Error status:", (error as any).status);
        if ('data' in error) console.error("Error data:", JSON.stringify((error as any).data));
        if ('message' in error) console.error("Error message:", (error as any).message);
      }

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

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Invalid OTP. Please try again.";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
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

      await sendOtp({
        userId: null,
        phoneNumber: user.mobileNumber,
      }).unwrap();
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

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to resend OTP. Please try again.";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-black"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      enabled={Platform.OS === "ios"}
    >
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 bg-black"
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: Platform.OS === "android" ? 240 : 0,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View className="flex-1 bg-black p-12">
          <Image
            className="mt-40"
            source={require("../assets/images/logo.png")}
          />
          <View className="mt-20">
            <Text className="text-white font-bold text-4xl mt-10">
              Enter OTP
            </Text>
            <Text className="text-white/50">
              OTP Sent to{" "}
              <Text className="font-bold text-white">
                {user?.mobileNumber || "0546787653"}
              </Text>
            </Text>
            <TouchableOpacity
              onPress={updateMobileNumber}
              className="mt-4 bg-input py-1 px-4 rounded-full w-52 justify-between flex flex-row items-center"
            >
              <Text className="text-white font-normal text-sm">
                Update Mobile Number
              </Text>
              <ChevronRight className="text-white" size={14} />
            </TouchableOpacity>
          </View>

          <View className="mt-10 relative h-20">
            {/* Hidden Input Layer - this MUST be on top */}
            <TextInput
              ref={inputRef}
              className="absolute w-full h-full opacity-0 z-50"
              value={otp}
              onChangeText={setOtp}
              maxLength={4}
              keyboardType="numeric"
              returnKeyType="done"
              textContentType="oneTimeCode"
              onFocus={handleInputFocus}
              editable={!isLoading}
              autoFocus={true} // Try to auto-focus on mount
            />

            {/* Visual Boxes Container - Display only */}
            <View className="flex flex-row items-center justify-between w-full h-full absolute z-10 top-0 left-0" pointerEvents="none">
              {Array.from({ length: 4 }).map((_, index) => {
                const isActive = index === otp.length;
                return (
                  <View
                    key={index}
                    className={`bg-input rounded-xl items-center justify-center h-20 w-20 border-2 ${isActive ? "border-amber-400" : "border-transparent"
                      }`}
                  >
                    <Text className="text-white text-2xl font-bold">
                      {otp[index] || ""}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* "Verify OTP" button with navigation */}
          <TouchableOpacity
            className={`mt-4 h-14 rounded-xl items-center justify-center ${otp.length !== 4 || isLoading
              ? "bg-gray-400"
              : "bg-white"
              }`}
            onPress={handleVerifyOtp}
            disabled={otp.length !== 4 || isLoading}
            activeOpacity={0.8}
          >
            <Text className="text-black font-normal text-xl">
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`mt-16 py-1 px-4 rounded-full w-36 justify-between flex flex-row items-center mx-auto ${isLoading ? "bg-gray-600" : "bg-input"
              }`}
            activeOpacity={0.9}
            onPress={handleResendOtp}
            disabled={isLoading}
          >
            <Text className="text-white font-normal text-sm">
              {isLoading ? "Sending..." : "Resend OTP"}
            </Text>
            <ChevronRight className="text-white" size={14} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Onboarding;
