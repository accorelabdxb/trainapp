import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Text,
  Dimensions,
} from "react-native";

// Dummy images – replace with real gallery assets
const images = [
  { id: "1", uri: "https://placekitten.com/300/300" },
  { id: "2", uri: "https://placekitten.com/301/301" },
  { id: "3", uri: "https://placekitten.com/302/302" },
  { id: "4", uri: "https://placekitten.com/303/303" },
];

const screenWidth = Dimensions.get("window").width;

export default function CameraScreen() {
  const [selectedImage, setSelectedImage] = useState(images[0].uri);


  const gridData = [
    { type: "camera", id: "camera" },
    { ...images, type: "selected" },
    ...images.slice(1).map((img) => ({ ...img, type: "gallery" })),
  ];

  const handleCameraPress = () => {
    alert("Open Camera");
  };

  function renderGridItem({ item }) {
    if (item.type === "camera") {
      return (
        <TouchableOpacity
          className="m-1.5 rounded-xl overflow-hidden w-[72px] h-[72px] justify-center items-center"
          onPress={handleCameraPress}
        >
          <View className="bg-black w-full h-full rounded-xl justify-center items-center">
            <Text className="text-white text-2xl">📷</Text>
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        className={`m-1.5 rounded-xl overflow-hidden w-[72px] h-[72px] justify-center items-center ${
          item.type === "selected" ? "border-2 border-white" : ""
        }`}
        onPress={() => setSelectedImage(item.uri)}
      >
        <Image
          source={{ uri: item.uri }}
          className="w-full h-full rounded-lg"
        />
      </TouchableOpacity>
    );
  }

  return (
    <View className="flex-1 bg-neutral-900">
      {/* Top Half: Selected Preview */}
      <View className="h-[48%] relative">
        <Image
          source={{ uri: selectedImage }}
          className="w-full h-full rounded-b-xl"
          style={{ resizeMode: "cover" }}
        />
        {/* Top row buttons */}
        <View className="absolute top-10 left-5 right-5 flex-row justify-between items-center">
          <TouchableOpacity className="bg-black/60 px-3 py-1.5 rounded-full">
            <Text className="text-white font-bold text-lg">{"<"}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-black/60 px-4 py-1.5 rounded-full">
            <Text className="text-white font-semibold text-lg">Next</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Bottom Half: Gallery Grid */}
      <View className="flex-1 bg-neutral-800 pt-3">
        <FlatList
          data={gridData}
          numColumns={4}
          renderItem={renderGridItem}
          keyExtractor={(item) => {
            // item.id should always exist, fallback to index if needed
            return item.id ? item.id.toString() : Math.random().toString();
          }}
          contentContainerStyle={{ paddingBottom: 70 }} // So toggle does not cover last row
        />

        {/* Toggle bottom right, stacked */}
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
