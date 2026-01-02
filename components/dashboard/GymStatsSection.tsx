import { StatCard } from "@/components/common/StatCard";
import { workoutStats } from "@/data/mockData";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export const GymStatsSection = React.memo(() => {
    const handleImageButtonPress = () => {
        console.log("Image background button pressed!");
    };

    return (
        <>
            <View className="mt-8 px-4">
                <Text className="text-white font-bold text-xl">
                    You're in the gym
                </Text>
                <View className="flex flex-row justify-between items-center">
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingRight: 0,
                            paddingVertical: 0,
                        }}
                    >
                        {workoutStats.map((stat, index) => (
                            <StatCard
                                key={index}
                                icon={stat.icon}
                                label={stat.label}
                                value={stat.value}
                                subtitle={stat.subtitle}
                            />
                        ))}
                    </ScrollView>
                </View>
            </View>

            <View className="mt-8 px-4">
                <View className="flex flex-row justify-between items-center">
                    <TouchableOpacity
                        className="bg-secbg rounded-2xl me-4 w-6/12 h-60 overflow-hidden"
                        onPress={handleImageButtonPress}
                        activeOpacity={0.7}
                    >
                        <View className="absolute top-2 left-2 bg-white rounded-full w-auto px-3 py-1 mt-2 ms-2 z-10">
                            <Text className="text-black text-xs">Nihas Latheef</Text>
                        </View>
                        <View className="rounded-2xl flex items-center justify-center">
                            <Image
                                className="w-full h-full"
                                source={require("../../assets/images/photooftheday.jpg")}
                            />
                            <View className="absolute bottom-2 bg-black/80 rounded-full w-auto px-3 py-1 mt-2 ms-2 z-10">
                                <Text className="text-white font-bold text-xs">
                                    Body Zone Star of the week
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-secbg rounded-2xl w-6/12 h-60 overflow-hidden"
                        onPress={handleImageButtonPress}
                        activeOpacity={0.7}
                    >
                        <View className="absolute top-2 left-2 bg-white rounded-full w-auto px-3 py-1 mt-2 ms-2 z-10">
                            <Text className="text-black text-xs">Manuprasad</Text>
                        </View>
                        <View className="rounded-2xl flex items-center justify-center">
                            <Image
                                className="w-full h-full"
                                source={require("../../assets/images/starof.jpg")}
                            />
                            <View className="absolute bottom-2 bg-black/80 rounded-full w-auto px-3 py-1 mt-2 ms-2 z-10">
                                <Text className="text-white font-bold text-xs">
                                    Photo of the day
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
});
