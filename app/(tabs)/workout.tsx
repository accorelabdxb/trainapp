import { ChevronRight, Clock, Dumbbell, Hash, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import RNModal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';

// Get screen width for responsive chart sizing
const screenWidth = Dimensions.get("window").width;

const chartData = {
    labels: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
    datasets: [
        {
            data: [0.2, 6.8, 8.2, 6.2, 9.6, 5.8, 2.2]
        }
    ]
};

const chartConfig = {
    backgroundGradientFrom: '#131514',
    backgroundGradientTo: '#131514',
    decimalPlaces: 0,
    color: () => '#3B82F6',
    fillShadowGradient: '#3B82F6',
    fillShadowGradientOpacity: 1,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.7})`,
    barPercentage: 0.8,
    useShadowColorFromDataset: false,
    formatYLabel: (yLabel: string) => `${Math.round(parseFloat(yLabel))}h`,
    propsForHorizontalLabels: {
        strokeWidth: "0",
    },
    propsForVerticalLabels: {
        strokeWidth: "0",
    },
};

const Workout = () => {
    const waveAnimation = useRef(new Animated.Value(0)).current;
    const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(waveAnimation, {
                    toValue: 1, duration: 300, easing: Easing.ease, useNativeDriver: true,
                }),
                Animated.timing(waveAnimation, {
                    toValue: -1, duration: 300, easing: Easing.ease, useNativeDriver: true,
                }),
                Animated.timing(waveAnimation, {
                    toValue: 0, duration: 300, easing: Easing.ease, useNativeDriver: true,
                }),
                Animated.delay(500),
            ])
        ).start();
    }, [waveAnimation]);

    return (
        <View className="flex-1 bg-black px-3 pt-16">
            <SafeAreaView className="bg-secbg absolute top-0 left-0 right-0 z-10 border-b border-gray-800" style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
            }}>
                <View className="px-6 bg-secbg flex flex-row items-center justify-between">
                    <Text className="text-white text-3xl font-bold ">Challenges</Text>
                </View>
            </SafeAreaView>
            <ScrollView
                className="flex-1 bg-black px-3"
                style={{ marginTop: 100 }}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
            >


                {/* Last Workout Section */}
                <View className="flex bg-secbg rounded-2xl p-4">
                    <View className="flex flex-row items-center justify-between mb-4">
                        <View className="flex flex-row items-center">
                            <Text className="text-white text-xl font-bold me-4">Last Workout</Text>
                            <View className="bg-white/50 rounded-full p-1 px-3">
                                <Text className="text-black text-xs">22 Jun</Text>
                            </View>
                        </View>
                        <TouchableOpacity>
                            <ChevronRight className="text-white/70" size={18} strokeWidth={1.5} />
                        </TouchableOpacity>
                    </View>

                    <View className="flex flex-row items-center justify-between">
                        <View className="flex flex-row items-center">
                            <Clock className="text-white me-2" size={18} strokeWidth={1} />
                            <View>
                                <Text className="text-white/50 text-xs">Duration</Text>
                                <Text className="text-white">1hr 07mn</Text>
                            </View>
                        </View>
                        <View className="flex flex-row items-center">
                            <Hash className="text-white me-2" size={18} strokeWidth={1} />
                            <View>
                                <Text className="text-white/50 text-xs">Set</Text>
                                <Text className="text-white">30</Text>
                            </View>
                        </View>
                        <View className="flex flex-row items-center">
                            <Dumbbell className="text-white me-2" size={18} strokeWidth={1} />
                            <View>
                                <Text className="text-white/50 text-xs">Weight</Text>
                                <Text className="text-white">50 lbs</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Chart Section */}
                <View className="bg-secbg p-4 pt-6 rounded-xl mt-8">
                    <Text className="text-white text-lg font-bold mb-4">5 days & 10.03 hrs this week</Text>
                    <BarChart
                        style={{ borderRadius: 16, marginLeft: -15 }}
                        data={chartData}
                        width={screenWidth - 70}
                        height={220}
                        yAxisLabel=""
                        yAxisSuffix="h"
                        chartConfig={chartConfig}
                        verticalLabelRotation={0}
                        showBarTops={true}
                        showValuesOnTopOfBars={false}
                        flatColor={false}
                        yAxisInterval={2}
                        segments={5}
                        withInnerLines={false}
                        fromZero={true}
                    />
                </View>

                {/* Calendar Section */}
                <View className="mt-8">
                    <View className="flex flex-row items-center justify-between">
                        <Text className="text-white font-bold text-xl">You're Gym Log</Text>
                        <TouchableOpacity className="flex flex-row items-center">
                            <Text className="text-white me-2">View All</Text>
                            <ChevronRight className="text-white/70" size={18} strokeWidth={1.5} />
                        </TouchableOpacity>
                    </View>

                    <View className="bg-secbg p-4 mt-4 mb-16 rounded-2xl">
                        <Text className="text-white font-bold text-xl mb-4">June</Text>
                        <View className="flex flex-row justify-between mb-2">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                                <View key={index} className="w-[13%] items-center">
                                    <Text className="font-normal text-xs text-white">{day}</Text>
                                </View>
                            ))}
                        </View>
                        {Array.from({ length: Math.ceil(30 / 7) }).map((_, weekIndex) => {
                            const start = weekIndex * 7 + 1;
                            const end = Math.min(start + 6, 30);
                            const isLastWeek = end === 30;
                            return (
                                <View key={weekIndex}
                                    className={`flex flex-row ${isLastWeek ? 'justify-start' : 'justify-between'} mb-2`}>
                                    {Array.from({ length: end - start + 1 }).map((_, dayIndex) => {
                                        const date = start + dayIndex;
                                        const isGreen = [
                                            1, 2, 4, 5, 6, 8, 10, 11, 13, 15, 17, 18, 20, 21, 23, 24, 25, 27, 28, 29
                                        ].includes(date);
                                        return (
                                            <View key={date} className="flex justify-center items-center w-[13%]">
                                                <TouchableOpacity
                                                    className={`${isGreen ? 'bg-green-600' : 'bg-input'} rounded-full w-12 h-12 border border-white/10 items-center justify-center`}
                                                >
                                                    <Text className="text-white/80 font-semibold text-sm">{date}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        );
                                    })}
                                </View>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>

            {/* FAB Button */}
            <TouchableOpacity
                className="bg-white rounded-full px-5 py-3 shadow-lg shadow-black/40 absolute bottom-3 right-3"
                activeOpacity={0.8}
                onPress={() => setModalVisible(true)}
            >
                <Text className="text-black font-semibold text-sm">Add Workout</Text>
            </TouchableOpacity>

            {/* Bottom Modal */}
            <RNModal
                isVisible={isModalVisible}
                onBackdropPress={() => setModalVisible(false)}
                style={{ justifyContent: 'flex-end', margin: 0 }}
            >
                <View className="bg-white rounded-t-3xl p-6 pb-14">
                    <View className="flex flex-row items-center justify-between">
                        <Text className="text-black font-bold text-2xl mb-4">What’s your workout today?</Text>
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            className="bg-black rounded-full"
                        >
                            <Text className="text-white text-center font-semibold w-12 h-12 pt-3 pe-1"> <X
                                className="text-white" size={20} /> </Text>
                        </TouchableOpacity>
                    </View>
                    <View className="flex flex-row items-start justify-between mt-6">
                        <View className="flex items-center w-4/12">
                            <TouchableOpacity
                                className="rounded-full border-gray-200 border-2 w-15 h-15 p-4 flex items-center justify-center"
                            >
                                <Image className="w-10 h-10"
                                    source={require('../../assets/images/arms.png')} />
                            </TouchableOpacity>
                            <Text className="text-black text-center w-full mt-4 font-semibold">Arm Muscles</Text>
                        </View>
                        <View className="flex items-center w-4/12">
                            <TouchableOpacity
                                className="rounded-full border-gray-200 border-2 w-15 h-15 p-4 flex items-center justify-center"
                            >
                                <Image className="w-10 h-10"
                                    source={require('../../assets/images/chest.png')} />
                            </TouchableOpacity>
                            <Text className="text-black text-center w-full mt-4 font-semibold">Chest Muscles</Text>
                        </View>
                        <View className="flex items-center w-4/12">
                            <TouchableOpacity
                                className="rounded-full border-gray-200 border-2 w-15 h-15 p-4 flex items-center justify-center"
                            >
                                <Image className="w-10 h-10"
                                    source={require('../../assets/images/abdomen.png')} />
                            </TouchableOpacity>
                            <Text className="text-black text-center w-full mt-4 font-semibold">Abdominal Muscles</Text>
                        </View>
                    </View>
                    <View className="flex flex-row items-start justify-between mt-6">
                        <View className="flex items-center w-4/12">
                            <TouchableOpacity
                                className="rounded-full border-gray-200 border-2 w-15 h-15 p-4 flex items-center justify-center"
                            >
                                <Image className="w-10 h-10"
                                    source={require('../../assets/images/back.png')} />
                            </TouchableOpacity>
                            <Text className="text-black text-center w-full mt-4 font-semibold">Back Muscles</Text>
                        </View>
                        <View className="flex items-center  w-4/12">
                            <TouchableOpacity
                                className="rounded-full border-gray-200 border-2 w-15 h-15 p-4 flex items-center justify-center"
                            >
                                <Image className="w-10 h-10"
                                    source={require('../../assets/images/glute.png')} />
                            </TouchableOpacity>
                            <Text className="text-black text-center w-full mt-4 font-semibold">Gluteal Muscles</Text>
                        </View>
                        <View className="flex items-center w-4/12">
                            <TouchableOpacity
                                className="rounded-full border-gray-200 border-2 w-15 h-15 p-4 flex items-center justify-center"
                            >
                                <Image className="w-10 h-10"
                                    source={require('../../assets/images/leg.png')} />
                            </TouchableOpacity>
                            <Text className="text-black text-center w-full mt-4 font-semibold ">Lower Limb
                                Muscles</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        className=" bg-black rounded-full py-4 mt-4"
                    >
                        <Text className="text-white text-center w-full text-lg ">Continue</Text>
                    </TouchableOpacity>

                </View>
            </RNModal>
        </View>
    );
};

export default Workout;