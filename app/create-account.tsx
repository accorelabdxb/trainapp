import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useProfile } from "../context/hooks/useProfile";
import { useRegisterMutation } from "../store/slices/authApi";
import { tokenManager } from "../utils/tokenManager";

const CreateAccount = () => {
  const router = useRouter();
  const { user, setLoading, setError, setUser } = useProfile();
  const [register, { isLoading }] = useRegisterMutation();
  const [step, setStep] = useState(1); // 1: GYM Code, 2: Name & Username
  const [gymCode, setGymCode] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");

  const handleGymCodeContinue = () => {
    if (!gymCode.trim()) {
      Alert.alert("Error", "Please enter a valid GYM Code");
      return;
    }
    setStep(2);
  };

  const handleCreateAccount = async () => {
    if (!fullName.trim() || !username.trim()) {
      Alert.alert("Error", "Please fill in all fields");
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

      // Register user using RTK Query
      const response = await register({
        mobileNumber: user.mobileNumber,
        username: username.trim(),
        fullName: fullName.trim(),
        email: null,
        plainPassword: null,
        gymId: gymCode.trim(),
        profileDataJson: null,
      }).unwrap();

      // Get the access token from response
      const accessToken = response.token || response.accessToken;

      if (!accessToken) {
        throw new Error("No access token received from server");
      }

      // Validate token format
      if (!tokenManager.isValidToken(accessToken)) {
        console.warn("Received invalid token format from server");
      }

      // Update user with registration data and store securely
      const updatedUser = {
        ...user,
        id: response.userId || response.id,
        username: username.trim(),
        fullName: fullName.trim(),
        gymId: gymCode.trim(),
        token: accessToken,
        isAuthenticated: true,
      };

      await setUser(updatedUser);

      // Navigate to dashboard
      router.push("/(tabs)/dashboard");
    } catch (error: any) {
      console.error("Registration error:", JSON.stringify(error, null, 2));

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
          "Failed to create account. Please try again."
      );
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Failed to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      router.back();
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-black"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header with back button */}
        <TouchableOpacity
          className="mt-12 mb-8"
          onPress={goBack}
          disabled={isLoading}
        >
          <Text className="text-white text-lg">← Back</Text>
        </TouchableOpacity>

        {/* Logo */}
        <Image className="mt-8" source={require("../assets/images/logo.png")} />

        {/* Step 1: GYM Code */}
        {step === 1 && (
          <View className="mt-20">
            <Text className="text-white font-bold text-4xl mt-10">
              Create an Account
            </Text>
            <Text className="text-white/50 mt-2">
              Please Ask Your Trainer For The GYM Code
            </Text>

            <View className="mt-10">
              <Text className="text-white mb-2">Enter GYM Code</Text>
              <TextInput
                className="mt-2 bg-input h-14 rounded-xl px-5 text-white text-xl"
                value={gymCode}
                onChangeText={setGymCode}
                placeholder="AML87643"
                placeholderTextColor="#666"
                editable={!isLoading}
                autoCapitalize="characters"
              />
            </View>

            <TouchableOpacity
              className="mt-8 bg-white h-14 rounded-xl items-center justify-center"
              onPress={handleGymCodeContinue}
              activeOpacity={0.9}
              disabled={!gymCode.trim() || isLoading}
              style={{
                opacity: !gymCode.trim() || isLoading ? 0.5 : 1,
              }}
            >
              <Text className="text-black font-normal text-xl">
                {isLoading ? "Loading..." : "Continue"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 2: Full Name and Username */}
        {step === 2 && (
          <View className="mt-20">
            <Text className="text-white font-bold text-4xl mt-10">
              Create an Account
            </Text>
            <Text className="text-white/50 mt-2">
              Please Ask Your Trainer For The GYM Code
            </Text>

            <View className="mt-10">
              <Text className="text-white mb-2">Full Name</Text>
              <TextInput
                className="mt-2 bg-input h-14 rounded-xl px-5 text-white text-xl"
                value={fullName}
                onChangeText={setFullName}
                placeholder="John Smith"
                placeholderTextColor="#666"
                editable={!isLoading}
                autoCapitalize="words"
              />
            </View>

            <View className="mt-6">
              <Text className="text-white mb-2">Username</Text>
              <TextInput
                className="mt-2 bg-input h-14 rounded-xl px-5 text-white text-xl"
                value={username}
                onChangeText={setUsername}
                placeholder="John"
                placeholderTextColor="#666"
                editable={!isLoading}
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              className="mt-8 bg-white h-14 rounded-xl items-center justify-center"
              onPress={handleCreateAccount}
              activeOpacity={0.9}
              disabled={!fullName.trim() || !username.trim() || isLoading}
              style={{
                opacity:
                  !fullName.trim() || !username.trim() || isLoading ? 0.5 : 1,
              }}
            >
              <Text className="text-black font-normal text-xl">
                {isLoading ? "Creating Account..." : "Create Account"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateAccount;
