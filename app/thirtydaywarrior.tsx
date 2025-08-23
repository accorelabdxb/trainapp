import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ChevronRight } from "../lib/icons/ChevronRight";
import PositionCard from "@/components/challenges/PositionCard";

const positions = [
  {
    id: 1,
    name: "Nihas latheef",
    number: "3",
    profileImage: require("../assets/images/profile.png"), // Replace with actual image paths
  },
  {
    id: 2,
    name: "Sarah Johnson",
    number: "7",
    profileImage: require("../assets/images/profile.png"),
  },
  {
    id: 3,
    name: "Mike Chen",
    number: "12",
    profileImage: require("../assets/images/profile.png"),
  },
  {
    id: 4,
    name: "Emma Wilson",
    number: "15",
    profileImage: require("../assets/images/profile.png"),
  },
  {
    id: 5,
    name: "David Rodriguez",
    number: "21",
    profileImage: require("../assets/images/profile1.jpg"),
  },
  {
    id: 6,
    name: "Lisa Thompson",
    number: "28",
    profileImage: require("../assets/images/profile2.jpg"),
  },
  {
    id: 7,
    name: "Alex Kumar",
    number: "30",
    profileImage: require("../assets/images/profile1.jpg"),
  },
  {
    id: 8,
    name: "Jessica Brown",
    number: "25",
    profileImage: require("../assets/images/profile2.jpg"),
  },
];

const thirtydaywarrior = () => {
  const router = useRouter();
  const handleGoBack = () => {
    router.push("/challenges");
  };
  return (
    <View className="flex-1 bg-black">
      <View className="pt-[60px] pb-[14px] px-4 flex flex-row items-center justify-between">
        <TouchableOpacity
          onPress={handleGoBack}
          className="w-11 h-11 bg-white rounded-full border-2 border-black flex justify-center items-center"
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>

        <Text
          className="text-white font-bold text-lg font-sans leading-6 capitalize text-center flex-1"
          numberOfLines={1}
        >
          30 day warrior
        </Text>

        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="relative">
          <Image
            source={require("../assets/images/girlworkout.jpg")}
            className="w-full h-[400px]"
            resizeMode="cover"
          />
          <View className="absolute right-5 bottom-5 w-[110px] h-[110px] bg-white rounded-[18px] flex justify-center items-center shadow-md">
            <Image
              source={require("../assets/images/traininglogo.png")}
              className="w-[90px] h-[90px]"
              resizeMode="cover"
            />
          </View>
        </View>
        <View className="px-4">
          <Text className="text-white font-sans font-bold text-[22px] leading-7 capitalize pt-7">
            30-Day Warrior
          </Text>
          <Text className="text-[#9f9f9f] font-sans font-medium text-base leading-6 mt-3">
            Become The Most Consistent Version Of Yourself.{"\n"}
            Build The Habit That Gets Results. Check-In For 30{"\n"}
            Days This Month To Prove Your Dedication.
          </Text>
          <TouchableOpacity
            className="w-[94px] h-10 rounded-[50px] bg-[#181818] flex-row  items-center justify-evenly px-3 mt-6"
            activeOpacity={0.7}
          >
            <Text className="text-white font-normal text-base">Read All</Text>
            <ChevronRight className="text-white" size={16} />
          </TouchableOpacity>
        </View>
        <View className="px-4">
          <View className="w-full h-px bg-white opacity-10 my-[28px]" />
        </View>
        <View className="px-4">
          <Text className="text-white font-sans font-bold text-[22px] leading-6 capitalize pb-3">
            Positions
          </Text>
          <View>
            {positions.map((participant, index) => (
              <PositionCard
                key={participant.id}
                profileImage={participant.profileImage}
                name={participant.name}
                number={participant.number}
              />
            ))}
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        activeOpacity={0.8}
        className="absolute left-[14px] right-[14px] bottom-[28px] h-[57px] rounded-[51px] bg-white border border-white flex flex-row items-center justify-start shadow-lg px-5"
        onPress={() => {}}
      >
        <Text className="absolute left-0 right-0 text-center font-medium text-lg text-black tracking-[0.22px]">
          Redeem Prize
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default thirtydaywarrior;
