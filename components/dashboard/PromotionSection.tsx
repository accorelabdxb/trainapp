import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface PromotionSectionProps {
    onRedeemPress: () => void;
}

export const PromotionSection = React.memo(({ onRedeemPress }: PromotionSectionProps) => {

    return (
        <View className="mt-8 px-4">
            <View className="mt-8">
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
                        <View className="rounded-2xl h-auto pb-6 mt-3 me-4 flex flex-row items-center justify-center">
                            <View className="me-4 relative">
                                <TouchableOpacity
                                    className="flex flex-row items-center absolute z-10 bg-black/80 rounded-full p-2 px-4 bottom-4 right-4"
                                    onPress={onRedeemPress}
                                    activeOpacity={0.7}
                                >
                                    <Text className="text-white font-bold text-sm px-3">
                                        Redeem
                                    </Text>
                                </TouchableOpacity>
                                <Image
                                    className="rounded-xl w-80 h-80"
                                    source={require("../../assets/images/ad1.jpg")}
                                />
                            </View>
                            <View className="me-4 relative">
                                <TouchableOpacity
                                    className="flex flex-row items-center absolute z-10 bg-black/80 rounded-full p-2 px-4 bottom-4 right-4"
                                    onPress={onRedeemPress}
                                    activeOpacity={0.7}
                                >
                                    <Text className="text-white font-bold text-sm px-3">
                                        Redeem
                                    </Text>
                                </TouchableOpacity>
                                <Image
                                    className="rounded-xl w-80 h-80"
                                    source={require("../../assets/images/ad3.jpg")}
                                />
                            </View>
                            <View>
                                <TouchableOpacity
                                    className="flex flex-row items-center absolute z-10 bg-black/80 rounded-full p-2 px-4 bottom-4 right-4"
                                    onPress={onRedeemPress}
                                    activeOpacity={0.7}
                                >
                                    <Text className="text-white font-bold text-sm px-3">
                                        Redeem
                                    </Text>
                                </TouchableOpacity>
                                <Image
                                    className="rounded-xl w-80 h-80"
                                    source={require("../../assets/images/ad2.png")}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </View>
    );
});
