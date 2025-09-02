import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CameraScreen() {
  type GalleryImage = { id: string; uri: string };
  type CameraGridItem = { type: "camera"; id: string };
  type GridItem = GalleryImage | CameraGridItem;

  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    loadGalleryImages();
  }, []);

  const loadGalleryImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 30,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const images = result.assets.map((asset, index) => ({
          id: `gallery_${index}_${Date.now()}`,
          uri: asset.uri,
        }));

        setGalleryImages(images);
        setSelectedImage(images[0]?.uri ?? null); // default first image
      }
    } catch (error) {
      console.error("Error loading gallery:", error);
      Alert.alert("Error", "Failed to load gallery images");
    }
  };

  const handleCameraPress = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Camera permission is required");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImage = {
          id: `camera_${Date.now()}`,
          uri: result.assets[0].uri,
        };

        setGalleryImages((prev) => [newImage, ...prev]);
        setSelectedImage(newImage.uri);
      }
    } catch (error) {
      console.error("Camera error:", error);
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const handleImageSelect = (imageUri: string) => {
    setSelectedImage(imageUri);
  };

  function renderGridItem({ item, index }: { item: GridItem; index: number }) {
    // First grid item = Camera
    if (index === 0 && "type" in item && item.type === "camera") {
      return (
        <TouchableOpacity
          className="m-1 rounded-xl overflow-hidden w-[72px] h-[72px] justify-center items-center bg-black"
          onPress={handleCameraPress}
        >
          <Text className="text-white text-2xl">📷</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        className={`m-1 rounded-xl overflow-hidden w-[72px] h-[72px] ${
          "uri" in item && item.uri === selectedImage ? "border-2 border-white" : ""
        }`}
        onPress={() => "uri" in item && handleImageSelect(item.uri)}
      >
        {"uri" in item && (
          <Image
            source={{ uri: item.uri }}
            className="w-full h-full"
            style={{ resizeMode: "cover" }}
          />
        )}
      </TouchableOpacity>
    );
  }

  const gridData: GridItem[] = [
    { type: "camera", id: "camera" },
    ...galleryImages,
  ];

  return (
    <View className="flex-1 bg-black">
   
      <View className="h-[50%] relative">
        {selectedImage ? (
          <Image
            source={{ uri: selectedImage }}
            className="w-full h-full"
            style={{ resizeMode: "cover" }}
          />
        ) : (
          <View className="w-full h-full bg-neutral-700 justify-center items-center">
            <Text className="text-white">No image selected</Text>
          </View>
        )}

        {/* Top buttons */}
        <View className="absolute top-10 left-5 right-5 flex-row justify-between">
          <TouchableOpacity className="bg-black/50 px-3 py-1 rounded-full">
            <Text className="text-white text-lg">{"<"}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-black/50 px-4 py-1 rounded-full">
            <Text className="text-white text-lg">Next</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Grid */}
      <View className="flex-1 bg-neutral-900 pt-2">
        <FlatList
          data={gridData}
          numColumns={4}
          renderItem={renderGridItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
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
