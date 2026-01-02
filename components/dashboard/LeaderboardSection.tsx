import React from "react";
import { Image, Text, View } from "react-native";

export const LeaderboardSection = React.memo(() => {
    return (
        <View className="mt-8 px-4">
            <Text className="text-white font-bold text-xl">
                Leaderboard for the week
            </Text>
            <View className="flex flex-row items-start mt-6">
                <View className="w-4/12 h-auto flex flex-col">
                    <View className="flex-1 items-center mt-14">
                        <Image
                            className="rounded-full w-14 h-14 mb-2"
                            source={require("../../assets/images/profile.png")}
                        />
                        <Text className="text-white text-center">Nihas Latheef</Text>
                    </View>
                    <Image
                        source={require("../../assets/images/silver.png")}
                        className="w-full"
                    />
                </View>

                <View className="w-4/12 h-auto flex flex-col">
                    <View className="flex-1 items-center">
                        <Image
                            className="rounded-full w-20 h-20 mb-2  border-amber-300 border-2"
                            source={require("../../assets/images/profile.png")}
                        />
                        <Text className="text-white mb-4 text-center">
                            Manu Prasad
                        </Text>
                    </View>
                    <Image
                        source={require("../../assets/images/gold.png")}
                        className="w-full"
                    />
                </View>

                <View className="w-4/12 h-auto flex flex-col">
                    <View className="flex-1 items-center">
                        <Image
                            className="rounded-full w-12 h-12 mb-2 mt-24"
                            source={require("../../assets/images/profile.png")}
                        />
                        <Text className="text-white text-center ">Choice Joseph</Text>
                    </View>
                    <Image
                        source={require("../../assets/images/bronze.png")}
                        className="w-full"
                    />
                </View>
            </View>
        </View>
    );
});
