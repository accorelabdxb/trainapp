import WorkoutSetCard from "@/components/workout/WorkoutSetCard";
import ClockIcon from "@/lib/icons/ClockIcon";
import PlusIcon from "@/lib/icons/PlusIcon";
import SettingsIcon from "@/lib/icons/SettingsIcon";

import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const logworkout = () => {
  const router = useRouter();
  const handleGoBack = () => {
    router.push("/workoutplan");
  };
  return (
    <View className="flex-1 bg-black">
      <View className="pt-[60px] pb-[14px] px-4 flex flex-row items-center justify-between gap-5">
        <TouchableOpacity
          onPress={handleGoBack}
          className="w-11 h-11 bg-white rounded-full border-2 border-black flex justify-center items-center"
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>

        <Text
          className="text-white font-bold text-lg text-center flex-1"
          numberOfLines={1}
        >
          Log Workout
        </Text>

        <TouchableOpacity className="w-9 h-9 border border-white rounded-full flex justify-center items-center">
          <PlusIcon size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <View className="pt-8">
       <View className="flex flex-row items-center justify-between bg-secbg p-4 mx-2 rounded-2xl">

          <View className="flex flex-row items-center gap-3">
            <ClockIcon size={36} />
            <View>
              <Text className="font-inter font-light text-sm text-[#9f9f9f]">
                Duration
              </Text>
              <Text className="font-roboto font-normal text-lg text-white">
                1hr 30min
              </Text>
            </View>
          </View>
          <View className="flex flex-row items-center gap-3">
            <SettingsIcon />
            <View>
              <Text className="font-inter font-light text-sm text-[#9f9f9f]">
                Sets
              </Text>
              <Text className="font-roboto font-normal text-lg text-white">
                30
              </Text>
            </View>
          </View>
          <TouchableOpacity className="bg-white rounded-full px-8 py-2">
            <Text className="text-black font-medium">Finish</Text>
          </TouchableOpacity>
        </View>
        <WorkoutSetCard/>
      </View>
    </View>
  );
};

export default logworkout;
