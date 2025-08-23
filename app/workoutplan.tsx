import React, { useState } from "react";
import CheckIcon from "@/lib/icons/CheckIcon";
import PlusIcon from "@/lib/icons/PlusIcon";
import SearchIcon from "@/lib/icons/SearchIcon";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ListRenderItemInfo,
  ScrollView,
} from "react-native";

type WorkoutItem = {
  id: string;
  name: string;
  category: string;
  image: any;
};

const data: WorkoutItem[] = [
  {
    id: "1",
    name: "Bench Press",
    category: "Chest",
    image: require("../assets/images/benchpress.png"),
  },
  {
    id: "2",
    name: "Push Ups",
    category: "Chest",
    image: require("../assets/images/profile.png"),
  },
  {
    id: "3",
    name: "Bicep Curl",
    category: "Arm Muscles",
    image: require("../assets/images/profile1.jpg"),
  },
  {
    id: "4",
    name: "Triceps Dip",
    category: "Arm Muscles",
    image: require("../assets/images/profile2.jpg"),
  },
    {
    id: "5",
    name: "Bicep Curl",
    category: "Arm Muscles",
    image: require("../assets/images/profile1.jpg"),
  },
    {
    id: "6",
    name: "Triceps Dip",
    category: "Arm Muscles",
    image: require("../assets/images/profile2.jpg"),
  },
    {
    id: "7",
    name: "Bench Press",
    category: "Chest",
    image: require("../assets/images/benchpress.png"),
  },
    {
    id: "8",
    name: "Bicep Curl",
    category: "Arm Muscles",
    image: require("../assets/images/profile1.jpg"),
  },
  {
    id: "9",
    name: "Triceps Dip",
    category: "Arm Muscles",
    image: require("../assets/images/profile2.jpg"),
  },
      {
    id: "10",
    name: "Bicep Curl",
    category: "Arm Muscles",
    image: require("../assets/images/profile1.jpg"),
  },
];

const WorkoutPlan = () => {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleGoBack = () => {
    router.push("/workout");
  };

  const tologworkout = () => {
    router.push("/logworkout");
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const renderItem = ({ item }: ListRenderItemInfo<WorkoutItem>) => {
    const isSelected = selectedIds.includes(item.id);

    return (
      <View className="flex flex-row items-center justify-between bg-black border-b border-[#2A2A2A] py-3">
    
        <View className="flex flex-row items-center gap-3">
          <Image source={item.image} className="w-[60px] h-[60px] rounded-md" />
          <View>
            <Text className="font-roboto font-normal text-base capitalize text-[#fff]">
              {item.name}
            </Text>
            <Text className="font-inter font-light text-sm text-[#9f9f9f]">
              {item.category}
            </Text>
          </View>
        </View>

        {/* Right: Toggle button */}
        <TouchableOpacity
          className={`w-9 h-9 rounded-full flex justify-center items-center ${
            isSelected ? "bg-green-500" : "border border-white"
          }`}
          onPress={() => toggleSelect(item.id)}
        >
          {isSelected ? (
            <CheckIcon size={20} color="#fff" />
          ) : (
            <PlusIcon size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-black">

      <View className="pt-[60px] pb-[14px] px-4 flex flex-row items-center justify-between gap-5">
        <TouchableOpacity
          onPress={handleGoBack}
          className="w-11 h-11 bg-white rounded-full border-2 border-black flex justify-center items-center"
        >
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>

        <Text className="text-white font-bold text-lg text-center flex-1">
          Chest & Arm Muscles
        </Text>

        <View className="w-11" />
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Filters */}
        <View className="mt-4 flex flex-row items-center justify-evenly px-4">
          <TouchableOpacity className="bg-white rounded-full px-8 py-2">
            <Text className="text-black font-medium">All</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-[#1a1a1a] rounded-full px-8 py-2">
            <Text className="text-white font-medium">Chest</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-[#1a1a1a] rounded-full px-8 py-2">
            <Text className="text-white font-medium">Arm Muscles</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-[#1a1a1a] rounded-full w-10 h-10 flex justify-center items-center">
            <PlusIcon size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View className="px-4 mt-6">
          <View className="flex-row items-center bg-black border border-[#4C4C4C] rounded-[10px] px-3 h-[46px]">
            <SearchIcon size={20} color="#8E8E8E" strokeWidth={2} />
            <TextInput
              placeholder="Search Workout"
              placeholderTextColor="#8E8E8E"
              className="flex-1 ml-2 text-white"
            />
          </View>
        </View>

        {/* List */}
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          className="mt-4 px-4"
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>

      {/* Continue Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        className="absolute left-[14px] right-[14px] bottom-[28px] h-[57px] rounded-[51px] bg-white border border-white flex flex-row items-center justify-center shadow-lg px-5"
        onPress={tologworkout}
      >
        <Text className="font-medium text-lg text-black tracking-[0.22px]">
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default WorkoutPlan;
