import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Image, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ImageEditScreen() {
  const router = useRouter();
  const { uri, type } = useLocalSearchParams(); // get both params
  const [caption, setCaption] = useState("");

  const handleGoBack = () => {
    router.push("/camera");
  };

  let imageSource: any = require("../assets/images/challenge1.png"); // fallback

  if (type === "uri" && uri) {
    imageSource = { uri: uri as string }; // camera/gallery photo
  } else if (type === "require" && uri) {
    imageSource = parseInt(uri as string, 10); // static require image
  }

  return (
      <KeyboardAvoidingView
      className="flex-1 bg-black"
    
    >
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
              
                <SafeAreaView edges={["bottom"]} className="absolute left-[14px] right-[14px] bottom-[28px]">
                  <TouchableOpacity
                    activeOpacity={0.8}
                    className="h-[57px] rounded-[51px] bg-white border border-white flex flex-row items-center justify-center shadow-lg px-5"
                    // onPress={tologworkout}
                  >
                    <Text className="font-medium text-lg text-black tracking-[0.22px]">
                      Share
                    </Text>
                  </TouchableOpacity>
                </SafeAreaView>
        </View>
        </KeyboardAvoidingView>
 
  );
}
