import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Easing,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell } from '../../lib/icons/Bell';
import { ChevronRight } from '../../lib/icons/ChevronRight';
import { CircleChevronRight } from '../../lib/icons/CircleChevronRight';
const Dashboard = () => {
    const router = useRouter();
    const waveAnimation = useRef(new Animated.Value(0)).current;

    const handleImageButtonPress = () => {
        console.log("Image background button pressed!");
        // Example: If router is used: router.push('/your-target-screen');
    };

    const handleRedeemPress = () => {
        console.log("Redeem button pressed!");
        router.push('/redeem');
    };

    const handlePointsPress = () => {
        console.log("Points pressed!");
        router.push('/redeem');
    };

    useEffect(() => {
        const startWave = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(waveAnimation, {
                        toValue: 1, // Rotate slightly right
                        duration: 300, // Speed of one swing
                        easing: Easing.ease,
                        useNativeDriver: true, // Use native driver for performance
                    }),
                    Animated.timing(waveAnimation, {
                        toValue: -1, // Rotate slightly left
                        duration: 300,
                        easing: Easing.ease,
                        useNativeDriver: true,
                    }),
                    Animated.timing(waveAnimation, {
                        toValue: 0, // Return to original position
                        duration: 300,
                        easing: Easing.ease,
                        useNativeDriver: true,
                    }),
                    Animated.delay(500), // Pause before next wave
                ])
            ).start();
        };

        startWave();
    }, [waveAnimation]);

    const rotateZ = waveAnimation.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: ['-15deg', '0deg', '15deg'],
    });

    return (
        <View className="flex-1 bg-secbg">
            {/* Fixed Header */}
            <SafeAreaView className="bg-secbg absolute top-0 left-0 right-0 z-10 border-b border-gray-800" style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
            }}>
                <View className="px-6 bg-secbg flex flex-row items-center justify-between">
                    <Image className="h-6 w-36"
                        source={require('../../assets/images/logo.png')}
                    />
                    <View className="flex flex-row items-center justify-center">
                        <Image
                            className="h-10 w-10 rounded-full"
                            source={require('../../assets/images/profile.png')}
                        />
                        <Bell
                            className="text-white ms-6"
                            size={28}
                            strokeWidth={1.5}
                        />
                    </View>
                </View>
            </SafeAreaView>
            
            {/* Scrollable Content */}
            <ScrollView
                className="flex-1 bg-black"
                style={{ marginTop: 120 }}
                contentContainerStyle={{ paddingBottom: 10 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="pt-8">
                    <View className="flex flex-row items-center justify-between bg-secbg p-4 px-4 mx-2 rounded-2xl">
                    <View>
                        <Text className="text-white/50">Hello</Text>
                        <View>
                            <Text className="text-white text-xl font-bold">Nihas</Text>
                            <Animated.View style={{ transform: [{ rotateZ }], position: 'absolute', left: 45, top: 0 }}>
                                <Text className="text-sm text-white mt-1 ms-2">👋</Text>
                            </Animated.View>
                        </View>
                    </View>
                    <TouchableOpacity 
                        className="bg-[#303030] p-3 ps-4 rounded-2xl flex flex-row items-center"
                        onPress={handlePointsPress}
                        activeOpacity={0.7}
                    >
                        <Image className="h-8 w-8"
                            source={require('../../assets/images/star.png')}
                        />
                        <Text className="text-white text-xl font-bold ms-2">500</Text>
                        <ChevronRight
                            className="text-white"
                            size={20}
                            strokeWidth={1}
                        />
                    </TouchableOpacity>
                </View>
                <View className="bg-secbg p-4 px-4 mt-8 mx-2 rounded-2xl">
                    <View className="flex flex-row items-center justify-between mb-2">
                        <Text className="text-white text-lg">Consistency is Your Superpower! 💪</Text>
                        <CircleChevronRight
                            className="text-white/70"
                            size={18}
                            strokeWidth={1.5}
                        />

                    </View>
                    <View className="flex flex-row items-center justify-between">
                        <View className="flex justify-center items-center mt-2">
                            <Text className="font-normal text-xs text-white mb-1">Mon</Text>
                            <TouchableOpacity
                                className="bg-green-600 rounded-full w-12 h-12 p-[.9rem] border border-white/10"
                            >
                                <Text className="text-white/80 font-semibold text-sm">28</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex justify-center items-center mt-2">
                            <Text className="font-normal text-xs text-white mb-1">Mon</Text>
                            <TouchableOpacity
                                className="bg-green-600 rounded-full w-12 h-12 p-[.9rem] border border-white/10"
                            >
                                <Text className="text-white/80 font-semibold text-sm">28</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex justify-center items-center mt-2">
                            <Text className="font-normal text-xs text-white mb-1">Mon</Text>
                            <TouchableOpacity
                                className="bg-green-600 rounded-full w-12 h-12 p-[.9rem] border border-white/10"
                            >
                                <Text className="text-white/80 font-semibold text-sm">28</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex justify-center items-center mt-2">
                            <Text className="font-normal text-xs text-white mb-1">Mon</Text>
                            <TouchableOpacity
                                className="bg-input rounded-full w-12 h-12 p-[.9rem] border border-white/10"
                            >
                                <Text className="text-white/80 font-semibold text-sm">28</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex justify-center items-center mt-2">
                            <Text className="font-normal text-xs text-white mb-1">Mon</Text>
                            <TouchableOpacity
                                className="bg-green-600 rounded-full w-12 h-12 p-[.9rem] border border-white/10"
                            >
                                <Text className="text-white/80 font-semibold text-sm">28</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex justify-center items-center mt-2">
                            <Text className="font-normal text-xs text-white mb-1">Mon</Text>
                            <TouchableOpacity
                                className="bg-input rounded-full w-12 h-12 p-[.9rem] border border-white/10"
                            >
                                <Text className="text-white/80 font-semibold text-sm">28</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex justify-center items-center mt-2">
                            <Text className="font-normal text-xs text-white mb-1">Mon</Text>
                            <TouchableOpacity
                                className="bg-input rounded-full w-12 h-12 p-[.9rem] border border-white/10"
                            >
                                <Text className="text-white/80 font-semibold text-sm">28</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>

                <View className="mt-8 px-4">
                    <Text className="text-white font-bold text-xl">You’re in the gym</Text>
                    <View className="flex flex-row justify-between items-center">
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingRight: 0,
                                paddingVertical: 0
                            }}
                        >
                            <View className="bg-secbg p-6 rounded-2xl w-40 mt-3 me-4">
                                <Image className="h-8 w-8"
                                    source={require('../../assets/images/Muscle.png')}
                                />
                                <Text className="text-white/80 font-light my-2">Heights Weight lifted</Text>
                                <Text className="text-[#F0B32D] text-2xl">65 lbs</Text>
                                <Text className="text-xs text-white/40">Bench Press</Text>
                            </View>
                            <View className="bg-secbg p-6 rounded-2xl w-40 mt-3 me-4">
                                <Image className="h-8 w-8"
                                    source={require('../../assets/images/clock.png')}
                                />
                                <Text className="text-white/80 font-light my-2">Longest Duration</Text>
                                <Text className="text-[#F0B32D] text-2xl">1hr 07mns</Text>
                                <Text className="text-xs text-white/40">23 Jun 2025</Text>
                            </View>
                            <View className="bg-secbg p-6 rounded-2xl w-40 mt-3 me-4">
                                <Image className="h-8 w-8"
                                    source={require('../../assets/images/challenge.png')}
                                />
                                <Text className="text-white/80 font-light my-2">Challenges Won</Text>
                                <Text className="text-[#F0B32D] text-2xl">05</Text>
                                <Text className="text-xs text-white/40">10 Participated</Text>
                            </View>
                            <View className="bg-secbg p-6 rounded-2xl w-40 mt-3">
                                <Image className="h-9 w-8"
                                    source={require('../../assets/images/cal.png')}
                                />
                                <Text className="text-white/80 font-light my-2">5 days streak</Text>
                                <Text className="text-[#F0B32D] text-2xl">02 Times</Text>
                                <Text className="text-xs text-white/40">4th Rank</Text>
                            </View>
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
                            <View
                                className="absolute top-2 left-2 bg-white rounded-full w-auto px-3 py-1 mt-2 ms-2 z-10">
                                <Text className="text-black text-xs">Nihas Latheef</Text>
                            </View>
                            <View className="rounded-2xl flex items-center justify-center">
                                <Image className="w-full h-full"
                                    source={require('../../assets/images/photooftheday.jpg')}
                                />
                                <View
                                    className="absolute bottom-2 bg-black/80 rounded-full w-auto px-3 py-1 mt-2 ms-2 z-10">
                                    {/* FIXED LINE: Wrapped text in <Text> */}
                                    <Text className="text-white font-bold text-xs">Body Zone Star of the week</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-secbg rounded-2xl w-6/12 h-60 overflow-hidden"
                            onPress={handleImageButtonPress}
                            activeOpacity={0.7}
                        >
                            <View
                                className="absolute top-2 left-2 bg-white rounded-full w-auto px-3 py-1 mt-2 ms-2 z-10">
                                <Text className="text-black text-xs">Manuprasad</Text>
                            </View>
                            <View className="rounded-2xl flex items-center justify-center">
                                <Image className="w-full h-full"
                                    source={require('../../assets/images/starof.jpg')}
                                />
                                <View
                                    className="absolute bottom-2 bg-black/80 rounded-full w-auto px-3 py-1 mt-2 ms-2 z-10">
                                    {/* FIXED LINE: Wrapped text in <Text> */}
                                    <Text className="text-white font-bold text-xs">Photo of the day</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="mt-8 px-4">
                    <Text className="text-white font-bold text-xl">Challenges</Text>
                    <View className="flex flex-row justify-between items-center">
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingRight: 0,
                                paddingVertical: 0
                            }}
                        >
                            <View className="bg-secbg rounded-2xl w-4/12 h-auto pb-6 mt-3 me-4 flex items-center relative">
                                <View
                                    className="absolute top-2 left-2 bg-white rounded-full w-auto px-3 py-1 mt-2 ms-2 z-10">
                                    <Text className="text-black text-xs">Ends in 3 Days</Text>
                                </View>
                                <Image className="w-full h-40 rounded-t-2xl"
                                    source={require('../../assets/images/challenge1.png')} />
                                {/* This text was already wrapped, but ensuring no surrounding raw text */}
                                <Text className="text-white mr-6 leading-5 py-4 px-4 mb-4">Attendance Challenge</Text>
                                <View
                                    className="absolute bottom-4 left-4 bg-white rounded-full w-auto px-3 py-1">
                                    <TouchableOpacity
                                        className="flex flex-row items-center"
                                        onPress={handleImageButtonPress}
                                        activeOpacity={0.7}
                                    >
                                        <Text className="text-black text-sm px-3">Join</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View className="bg-secbg rounded-2xl w-4/12 h-auto pb-6 mt-3 me-4 flex items-center relative">
                                <View
                                    className="absolute top-2 left-2 bg-white rounded-full w-auto px-3 py-1 mt-2 ms-2 z-10">
                                    <Text className="text-black text-xs">Ends in 3 Days</Text>
                                </View>
                                <Image className="w-full h-40 rounded-t-2xl"
                                    source={require('../../assets/images/challenge2.png')} />
                                <Text className="text-white mr-6 leading-5 py-4 px-4 mb-4">Attendance Challenge</Text>
                                <View
                                    className="absolute bottom-4 left-4 bg-white rounded-full w-auto px-3 py-1">
                                    <TouchableOpacity
                                        className="flex flex-row items-center"
                                        onPress={handleImageButtonPress}
                                        activeOpacity={0.7}
                                    >
                                        <Text className="text-black text-sm px-3">Join</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View className="bg-secbg rounded-2xl w-4/12 h-auto pb-6 mt-3 me-4 flex items-center relative">
                                <View
                                    className="absolute top-2 left-2 bg-white rounded-full w-auto px-3 py-1 mt-2 ms-2 z-10">
                                    <Text className="text-black text-xs">Ends in 3 Days</Text>
                                </View>
                                <Image className="w-full h-40 rounded-t-2xl"
                                    source={require('../../assets/images/challenge1.png')} />
                                <Text className="text-white mr-6 leading-5 py-4 px-4 mb-4">Attendance Challenge</Text>
                                <View
                                    className="absolute bottom-4 left-4 bg-white rounded-full w-auto px-3 py-1">
                                    <TouchableOpacity
                                        className="flex flex-row items-center"
                                        onPress={handleImageButtonPress}
                                        activeOpacity={0.7}
                                    >
                                        <Text className="text-black text-sm px-3">Join</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
                <View className="mt-8 px-4">
                    <Text className="text-white font-bold text-xl">Leaderboard for the week</Text>
                    <View
                        className="flex flex-row items-start mt-6">
                        <View className="w-4/12 h-auto flex flex-col">
                            <View
                                className="flex-1 items-center mt-14">
                                <Image className="rounded-full w-14 h-14 mb-2"
                                    source={require('../../assets/images/profile.png')} />
                                <Text className="text-white text-center">Nihas Latheef</Text>
                            </View>
                            <Image
                                source={require('../../assets/images/silver.png')} className='w-full' />
                        </View>

                        <View className="w-4/12 h-auto flex flex-col">
                            <View className="flex-1 items-center">
                                <Image className="rounded-full w-20 h-20 mb-2 border border-amber-300 border-2"
                                    source={require('../../assets/images/profile.png')} />
                                <Text className="text-white mb-4 text-center">Manu Prasad</Text>
                            </View>
                            <Image
                                source={require('../../assets/images/gold.png')}  className='w-full'/>
                        </View>

                        <View className="w-4/12 h-auto flex flex-col">
                            <View className="flex-1 items-center">
                                <Image className="rounded-full w-12 h-12 mb-2 mt-24"
                                    source={require('../../assets/images/profile.png')} />
                                <Text className="text-white text-center ">Choice Joseph</Text>
                            </View>
                            <Image
                                source={require('../../assets/images/bronze.png')}  className='w-full'/>
                        </View>
                    </View>

                    <View className="mt-8">
                        <View className="flex flex-row justify-between items-center">
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingRight: 0,
                                    paddingVertical: 0
                                }}
                            >
                                <View
                                    className="rounded-2xl h-auto pb-6 mt-3 me-4 flex flex-row items-center justify-center">
                                    <View className="me-4 relative">
                                        <TouchableOpacity
                                            className="flex flex-row items-center absolute z-10 bg-black/80 rounded-full p-2 px-4 bottom-4 right-4"
                                            onPress={handleRedeemPress}
                                            activeOpacity={0.7}
                                        >
                                            <Text className="text-white font-bold text-sm px-3">Redeem</Text>
                                        </TouchableOpacity>
                                        <Image className="rounded-xl w-80 h-80"
                                            source={require('../../assets/images/ad1.jpg')} />
                                    </View>
                                    <View className="me-4 relative">
                                        <TouchableOpacity
                                            className="flex flex-row items-center absolute z-10 bg-black/80 rounded-full p-2 px-4 bottom-4 right-4"
                                            onPress={handleRedeemPress}
                                            activeOpacity={0.7}
                                        >
                                            <Text className="text-white font-bold text-sm px-3">Redeem</Text>
                                        </TouchableOpacity>
                                        <Image className="rounded-xl w-80 h-80"
                                            source={require('../../assets/images/ad3.jpg')} /> {/* FIXED PATH HERE */}
                                    </View>
                                    <View>
                                        <TouchableOpacity
                                            className="flex flex-row items-center absolute z-10 bg-black/80 rounded-full p-2 px-4 bottom-4 right-4"
                                            onPress={handleRedeemPress}
                                            activeOpacity={0.7}
                                        >
                                            <Text className="text-white font-bold text-sm px-3">Redeem</Text>
                                        </TouchableOpacity>
                                        <Image className="rounded-xl w-80 h-80"
                                            source={require('../../assets/images/ad2.png')} />
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    </View>

                </View>
            </View>
            </ScrollView>
        </View>
    );
};

export default Dashboard;

const styles = StyleSheet.create({});