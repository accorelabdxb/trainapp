import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator } from "react-native";
import { communityAPI } from "@/utils/api";

export default function ImageEditScreen() {
  const router = useRouter();
  const { uri, type } = useLocalSearchParams(); // get both params
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleShare = async () => {
    // 1. Validate that we have an image URI
    if (!uri || typeof uri !== "string") {
      Alert.alert("Error", "No image was selected.");
      return;
    }
    setIsUploading(true);
    try {
      // The API expects an object with uri, name, and type.
      const filename = uri.split("/").pop() || `photo_${Date.now()}.jpg`;
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;
      const file = { uri, name: filename, type };
      const response = await communityAPI.createPost(caption, file);
      if (response.success) {
        Alert.alert("Success", "Your post has been shared!");
        router.push("/(tabs)/social");
      } else {
        throw new Error(response.message || "Failed to share post.");
      }
    } catch (error) {
      // 5. Handle any errors
      console.error("Failed to share post:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsUploading(false); // Stop loading, whether it succeeded or failed
    }
  };

  const handleGoBack = () => {
    router.push("/camera");
  };
  const getImageSource = () => {
    if (type === "uri" && uri && typeof uri === "string") {
      return { uri: uri };
    } else if (type === "require" && uri) {
      return parseInt(uri as string, 10);
    }
    // Fallback image
    return require("../assets/images/challenge1.png");
  };

  const imageSource = getImageSource();

  return (
    <KeyboardAvoidingView className="flex-1 bg-black">
      <View className="flex-1 bg-black">
        <View>
          <Image
            source={imageSource}
            className="w-full h-[340px]"
            style={{ resizeMode: "cover" }}
          />
          {/* Back button absolutely positioned */}
          <TouchableOpacity
            onPress={handleGoBack}
            className="w-11 h-11 bg-white rounded-full border-2 border-white flex justify-center items-center absolute top-10 left-4"
          >
            <ChevronLeft size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 bg-black p-4">
          <TextInput
            className="text-white rounded-xl p-4"
            placeholder="Add A Caption"
            placeholderTextColor="#888"
            value={caption}
            onChangeText={setCaption}
          />
        </View>

        <SafeAreaView
          edges={["bottom"]}
          className="absolute left-[14px] right-[14px] bottom-[28px]"
        >
          <TouchableOpacity
            activeOpacity={0.8}
            className="h-[57px] rounded-[51px] bg-white border border-white flex flex-row items-center justify-center shadow-lg px-5"
            onPress={handleShare} // 👈 CALL THE FUNCTION
            disabled={isUploading} // 👈 DISABLE WHEN UPLOADING
          >
            {isUploading ? (
              <ActivityIndicator size="small" color="#000" /> // 👈 SHOW SPINNER
            ) : (
              <Text className="font-medium text-lg text-black tracking-[0.22px]">
                Share
              </Text>
            )}
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
}
