import { useRouter } from "expo-router";
import React, { useState } from "react";
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
// Make sure to import gymAPI from your utils/api.js file
import { authAPI, gymAPI } from "../utils/api";
import { tokenManager } from "../utils/tokenManager";

const CreateAccount = () => {
  const router = useRouter();
  const { user, setLoading, setError, setUser, isLoading } = useProfile();

  // 1: Register (Name/Username), 2: Verify GYM Code
  const [step, setStep] = useState(1);
  const [gymCode, setGymCode] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");

  // Log user data when the component loads
  console.log(
    "CreateAccount screen loaded. User mobile:",
    user?.mobileNumber
  );

  /**
   * STEP 1: Register the user with Name and Username to get an Access Token.
   */
  const handleRegister = async () => {
    console.log("Step 1: handleRegister started...");
    console.log("Full Name:", fullName, "Username:", username);

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

      // Register user (but with gymId as null)
      const response = await authAPI.register({
        mobileNumber: user.mobileNumber,
        username: username.trim(),
        fullName: fullName.trim(),
        email: "",
        plainPassword: "",
        gymId: null, // We don't send the gymId yet
        profileDataJson: null,
      });

      console.log("Step 1: Registration API successful. Response:", response);

      // Get the access token from response
      const accessToken = response.token || response.accessToken;

      if (!accessToken) {
        console.error("Error: No access token received from server.");
        throw new Error("No access token received from server");
      }

      console.log("Step 1: Got access token:", accessToken);

      // Validate token format
      if (!tokenManager.isValidToken(accessToken)) {
        console.warn("Received invalid token format from server");
      }

      // ⬇️ --- THIS IS THE FIX --- ⬇️
      // We save the user's data and token,
      // but we DO NOT set isAuthenticated: true yet.
      const updatedUser = {
        ...user,
        id: response.userId || response.id,
        username: username.trim(),
        fullName: fullName.trim(),
        token: accessToken, // <-- TOKEN IS SAVED
        isAuthenticated: false, // <-- NOT AUTHENTICATED YET!
      };

      await setUser(updatedUser); // This also saves to secureStorage

      console.log("Step 1: User data saved to context. Moving to Step 2.");

      // Success! Go to Step 2
      setStep(2);
    } catch (error: any) {
      console.error("Step 1: handleRegister ERROR:", error.message);
      console.error("Full error object:", JSON.stringify(error, null, 2));

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

  /**
   * STEP 2: Verify the GYM Code using the token we just received.
   */
  const handleVerifyGymCode = async () => {
    console.log("Step 2: handleVerifyGymCode started...");
    console.log("Gym Code:", gymCode);

    if (!gymCode.trim()) {
      Alert.alert("Error", "Please enter a valid GYM Code");
      return;
    }

    console.log("Step 2: Checking for token...", user?.token);

    // We check for user.token, which was set in handleRegister
    if (!user?.token) {
      Alert.alert(
        "Error",
        "Session invalid. Please try logging in again."
      );
      router.replace("/");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Call the new gymAPI function.
      // The token is added by the interceptor.
      const response = await gymAPI.verifyGymCode(gymCode.trim());

      console.log("Step 2: Gym verification API successful. Response:", response);

      // This logic handles all success cases (e.g., {success: true} or just 200 OK)
      const isSuccessful = (response && response.success === true) || (response && typeof response.success === 'undefined');

      if (isSuccessful) {
        console.log("Step 2: Gym code valid. Setting user as authenticated and navigating to dashboard.");
        
        // ⬇️ --- THIS IS THE FIX --- ⬇️
        // NOW the user is fully authenticated.
        await setUser({ 
          ...user, 
          gymId: gymCode.trim(),
          isAuthenticated: true // <-- NOW THEY ARE AUTHENTICATED
        });
        
        router.push("/(tabs)/dashboard");

      } else {
        // Case: API returns { success: false, message: "..." }
        console.warn("Step 2: Gym code invalid.", response.message);
        Alert.alert(
          "Invalid GYM Code",
          response.message || "The GYM Code is not valid. Please check with your trainer."
        );
      }
    } catch (error: any) {
      console.error("Step 2: handleVerifyGymCode ERROR:", error.message);
      console.error("Full error object:", JSON.stringify(error, null, 2));

      if (tokenManager.isTokenExpiredError(error)) {
        Alert.alert(
          "Session Expired",
          "Your session has expired. Please log in again.",
          [{ text: "OK", onPress: () => router.replace("/") }]
        );
        return;
      }

      // Handle 404 or 400 errors (likely invalid code)
      if (error.response?.status === 404 || error.response?.status === 400) {
        console.warn("Step 2: API returned 400/404, likely invalid gym code.");
        Alert.alert(
          "Invalid GYM Code",
          error.response?.data?.message || "The GYM Code is not valid. Please check with your trainer."
        );
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to verify GYM Code. Please try again."
      );
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Failed to verify GYM Code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step === 2) {
      console.log("Going back from Step 2 to Step 1");
      setStep(1); // Go from Gym Code back to Name/Username
    } else {
      console.log("Going back from Step 1 to previous screen");
      router.back(); // Go from Name/Username back to OTP/Login
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
        <Image
          className="mt-8"
          source={require("../assets/images/logo.png")}
        />

        {/* STEP 1: Full Name and Username 
          This is shown first because step is 1 by default
        */}
        {step === 1 && (
          <View className="mt-20">
            <Text className="text-white font-bold text-4xl mt-10">
              Create an Account
            </Text>
            <Text className="text-white/50 mt-2">
              Let's get you set up with your profile.
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
              onPress={handleRegister}
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

        {/* STEP 2: GYM Code 
          This is shown *after* handleRegister is successful
        */}
        {step === 2 && (
          <View className="mt-20">
            <Text className="text-white font-bold text-4xl mt-10">
              Almost there!
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
              onPress={handleVerifyGymCode}
              activeOpacity={0.9}
              disabled={!gymCode.trim() || isLoading}
              style={{
                opacity: !gymCode.trim() || isLoading ? 0.5 : 1,
              }}
            >
              <Text className="text-black font-normal text-xl">
                {isLoading ? "Verifying..." : "Verify & Continue"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateAccount;