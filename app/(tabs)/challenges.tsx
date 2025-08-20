import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Easing } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const handleImageButtonPress = () => {
  // console.log("Image background button pressed!");
  router.push('/weightlosschallenge');
};

const Challenges = () => {
  // Animation logic for the waving emoji, now correctly inside the component
  const waveAnimation = useRef(new Animated.Value(0)).current;

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
    outputRange: ["-15deg", "0deg", "15deg"],
  });

  return (
    <View className="flex-1 bg-secbg">
      {/* Fixed Header */}
      <SafeAreaView
        className="bg-secbg absolute top-0 left-0 right-0 z-10 border-b border-gray-800"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <View className="px-6 bg-secbg flex flex-row items-center justify-between">
          <Text className="text-white text-3xl font-bold ">Challenges</Text>
        </View>
      </SafeAreaView>

      {/* Scrollable Content with top margin to account for fixed header */}
      <ScrollView
        className="flex-1 bg-black px-3"
        style={{ marginTop: 120 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="pt-4">
          <Text className="text-white font-bold text-xl">My Challenges</Text>
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
              <View className="bg-secbg rounded-2xl w-4/12 h-auto pb-6 mt-3 me-4 flex items-center relative">
                <View className="absolute top-2 left-2 bg-white rounded-full w-auto px-3 py-1 mt-2 ms-2 z-10">
                  <Text className="text-black text-xs">Ends in 3 Days</Text>
                </View>
                <Image
                  className="w-full h-40 rounded-t-2xl"
                  source={require("../../assets/images/challenge1.png")}
                />
                {/* This text was already wrapped, but ensuring no surrounding raw text */}
                <Text className="text-white mr-6 leading-5 py-4 px-4 mb-4">
                  Attendance Challenge
                </Text>
                <View className="absolute bottom-4 left-4 bg-white rounded-full w-auto px-3 py-1">
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
                <View className="absolute top-2 left-2 bg-white rounded-full w-auto px-3 py-1 mt-2 ms-2 z-10">
                  <Text className="text-black text-xs">Ends in 3 Days</Text>
                </View>
                <Image
                  className="w-full h-40 rounded-t-2xl"
                  source={require("../../assets/images/challenge2.png")}
                />
                <Text className="text-white mr-6 leading-5 py-4 px-4 mb-4">
                  Attendance Challenge
                </Text>
                <View className="absolute bottom-4 left-4 bg-white rounded-full w-auto px-3 py-1">
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
                <View className="absolute top-2 left-2 bg-white rounded-full w-auto px-3 py-1 mt-2 ms-2 z-10">
                  <Text className="text-black text-xs">Ends in 3 Days</Text>
                </View>
                <Image
                  className="w-full h-40 rounded-t-2xl"
                  source={require("../../assets/images/challenge1.png")}
                />
                <Text className="text-white mr-6 leading-5 py-4 px-4 mb-4">
                  Attendance Challenge
                </Text>
                <View className="absolute bottom-4 left-4 bg-white rounded-full w-auto px-3 py-1">
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
        <View className="mt-8">
          <Text className="text-white font-bold text-xl">
            Active Challenges
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
              <View className="bg-secbg rounded-2xl w-4/12 h-auto pb-6 mt-3 me-4 flex items-center relative">
                <View className="absolute top-2 left-2 bg-white rounded-full w-auto px-3 py-1 mt-2 ms-2 z-10">
                  <Text className="text-black text-xs">Ends in 3 Days</Text>
                </View>
                <Image
                  className="w-full h-40 rounded-t-2xl"
                  source={require("../../assets/images/challenge1.png")}
                />
                {/* This text was already wrapped, but ensuring no surrounding raw text */}
                <Text className="text-white mr-6 leading-5 py-4 px-4 mb-4">
                  Attendance Challenge
                </Text>
                <View className="absolute bottom-4 left-4 bg-white rounded-full w-auto px-3 py-1">
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
                <View className="absolute top-2 left-2 bg-white rounded-full w-auto px-3 py-1 mt-2 ms-2 z-10">
                  <Text className="text-black text-xs">Ends next week</Text>
                </View>
                <Image
                  className="w-full h-40 rounded-t-2xl"
                  source={require("../../assets/images/challenge2.png")}
                />
                <Text className="text-white mr-6 leading-5 py-4 px-4 mb-4">
                  Weight loss Challenge
                </Text>
                <View className="absolute bottom-4 left-4 bg-white rounded-full w-auto px-3 py-1">
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
                <View className="absolute top-2 left-2 bg-white rounded-full w-auto px-3 py-1 mt-2 ms-2 z-10">
                  <Text className="text-black text-xs">Ends in 3 Days</Text>
                </View>
                <Image
                  className="w-full h-40 rounded-t-2xl"
                  source={require("../../assets/images/challenge1.png")}
                />
                <Text className="text-white mr-6 leading-5 py-4 px-4 mb-4">
                  Attendance Challenge
                </Text>
                <View className="absolute bottom-4 left-4 bg-white rounded-full w-auto px-3 py-1">
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
        <View className="mt-8">
          <Text className="text-white font-bold text-xl">
            Upcoming Challenges
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
              <View className="bg-secbg rounded-2xl w-4/12 h-auto pb-6 mt-3 me-4 flex items-center relative">
                <View className="absolute top-2 left-2 bg-white rounded-full w-auto px-3 py-1 mt-2 ms-2 z-10">
                  <Text className="text-black text-xs">Ends in 3 Days</Text>
                </View>
                <Image
                  className="w-full h-40 rounded-t-2xl"
                  source={require("../../assets/images/challenge1.png")}
                />
                {/* This text was already wrapped, but ensuring no surrounding raw text */}
                <Text className="text-white mr-6 leading-5 py-4 px-4 mb-4">
                  Attendance Challenge
                </Text>
                <View className="absolute bottom-4 left-4 bg-white rounded-full w-auto px-3 py-1">
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
                <View className="absolute top-2 left-2 bg-white rounded-full w-auto px-3 py-1 mt-2 ms-2 z-10">
                  <Text className="text-black text-xs">Ends in 3 Days</Text>
                </View>
                <Image
                  className="w-full h-40 rounded-t-2xl"
                  source={require("../../assets/images/challenge2.png")}
                />
                <Text className="text-white mr-6 leading-5 py-4 px-4 mb-4">
                  Attendance Challenge
                </Text>
                <View className="absolute bottom-4 left-4 bg-white rounded-full w-auto px-3 py-1">
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
                <View className="absolute top-2 left-2 bg-white rounded-full w-auto px-3 py-1 mt-2 ms-2 z-10">
                  <Text className="text-black text-xs">Ends in 3 Days</Text>
                </View>
                <Image
                  className="w-full h-40 rounded-t-2xl"
                  source={require("../../assets/images/challenge1.png")}
                />
                <Text className="text-white mr-6 leading-5 py-4 px-4 mb-4">
                  Attendance Challenge
                </Text>
                <View className="absolute bottom-4 left-4 bg-white rounded-full w-auto px-3 py-1">
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
      </ScrollView>
    </View>
  );
};

export default Challenges;

const styles = StyleSheet.create({});
