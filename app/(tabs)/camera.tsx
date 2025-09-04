import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React, { useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

type ImageItem = { id: string; uri: string | number };
type CameraGridItem = { type: "camera"; id: string };
type GridItem = CameraGridItem | ImageItem;

export default function CameraGalleryScreen() {
  const router = useRouter();

  const [images, setImages] = useState<ImageItem[]>([
    { id: "1", uri: require("../../assets/images/challenge1.png") },
    { id: "2", uri: require("../../assets/images/ad1.jpg") },
    { id: "3", uri: require("../../assets/images/back.png") },
    { id: "4", uri: require("../../assets/images/profile.png") },
    { id: "5", uri: require("../../assets/images/profile.png") },
  ]);

  const [previewId, setPreviewId] = useState<string>(images[0].id);

  // Go back
  const handleGoBack = () => {
    router.back();
  };

  // Navigate to image edit
  const imageedit = () => {
    const selectedImage = images.find((img) => img.id === previewId);
    if (selectedImage) {
      if (typeof selectedImage.uri === "string") {
        // Camera / gallery photo (URI string)
        router.push({
          pathname: "/imageedit",
          params: { uri: selectedImage.uri, type: "uri" },
        });
      } else {
        // Static require image (number ID)
        router.push({
          pathname: "/imageedit",
          params: { uri: String(selectedImage.uri), type: "require" },
        });
      }
    }
  };

  // Camera capture logic
  const handleCameraPress = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const photo: ImageItem = {
        id: `photo_${Date.now()}`,
        uri: result.assets[0].uri,
      };
      setImages([photo, ...images]);
      setPreviewId(photo.id);
    }
  };

  // Preview change on grid image select
  const handleImageSelect = (id: string) => {
    setPreviewId(id);
  };

  // Add camera icon as first cell
  const gridData: GridItem[] = [{ type: "camera", id: "camera" }, ...images];

  function renderGridItem({ item }: { item: GridItem }) {
    if ("type" in item && item.type === "camera") {
      return (
        <TouchableOpacity
          className="m-1 rounded-xl overflow-hidden w-[72px] h-[72px] justify-center items-center bg-black"
          onPress={handleCameraPress}
        >
          <Text className="text-white text-2xl">📷</Text>
        </TouchableOpacity>
      );
    }
    if ("uri" in item) {
      return (
        <TouchableOpacity
          className="m-1 rounded-xl overflow-hidden w-[72px] h-[72px]"
          onPress={() => handleImageSelect(item.id)}
        >
          <Image
            source={typeof item.uri === "string" ? { uri: item.uri } : item.uri}
            className="w-full h-full"
            style={{ resizeMode: "cover" }}
          />
        </TouchableOpacity>
      );
    }
    return null;
  }

  // Get preview image
  const previewImage = images.find((img) => img.id === previewId);

  return (
    <View className="flex-1 bg-black">
      {/* Preview Area */}
      <View className="h-[340px] relative">
        {previewImage && (
          <Image
            source={
              typeof previewImage.uri === "string"
                ? { uri: previewImage.uri }
                : previewImage.uri
            }
            className="w-full h-full"
            style={{ resizeMode: "cover" }}
          />
        )}

        {/* Top Buttons */}
        <View className="absolute top-10 left-5 right-5 flex-row justify-between">
          <TouchableOpacity
            onPress={handleGoBack}
            className="w-11 h-11 bg-white rounded-full border-2 border-white flex justify-center items-center"
          >
            <ChevronLeft size={24} color="#000" />
          </TouchableOpacity>

          <View className="mt-4 bg-white rounded-full w-20 px-3 py-1">
            <TouchableOpacity
              className="flex flex-row items-center"
              onPress={imageedit}
              activeOpacity={0.7}
            >
              <Text className="text-black text-sm px-3">Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Gallery Grid */}
      <View className="flex-1 bg-neutral-900 pt-2">
        <FlatList
          data={gridData}
          numColumns={5}
          keyExtractor={(item) => item.id}
          renderItem={renderGridItem}
          contentContainerStyle={{ paddingBottom: 80 }}
        />

        {/* Bottom Buttons */}
        <View className="flex-row gap-2 absolute bottom-6 right-4 items-center">
          <TouchableOpacity className="bg-red-600 rounded-full px-7 py-2">
            <Text className="text-white">Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-neutral-600 rounded-full px-7 py-2">
            <Text className="text-white">Video</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
