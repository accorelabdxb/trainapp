import OctagonAlertIcon from "@/lib/icons/OctaganAlert";
import { useRouter } from "expo-router";
import { Calendar, ChevronLeft } from "lucide-react-native";
import React, { useState } from "react";

import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const participants = [
  { name: "Nihas Latheef", image: require("../assets/images/profile.png") },
  { name: "Nihas Latheef", image: require("../assets/images/profile1.jpg") },
  { name: "Nihas Latheef", image: require("../assets/images/profile2.jpg") },
  { name: "Nihas Latheef", image: require("../assets/images/profile1.jpg") },
  { name: "Nihas Latheef", image: require("../assets/images/profile2.jpg") },
  { name: "Nihas Latheef", image: require("../assets/images/profile.png") },
  { name: "Nihas Latheef", image: require("../assets/images/profile2.jpg") },
  { name: "Nihas Latheef", image: require("../assets/images/profile1.jpg") },
  { name: "Nihas Latheef", image: require("../assets/images/profile.png") },
  { name: "Nihas Latheef", image: require("../assets/images/profile2.jpg") },
];



const screenWidth = Dimensions.get("window").width;

const WeightLossChallenge = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

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
          Weight Loss Challenge
        </Text>

        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="relative">
          <Image
            source={require("../assets/images/challenge2.png")}
            className="w-full h-[400px]"
            resizeMode="cover"
          />

          <View className="absolute top-5 left-5 w-[60px] h-[60px] bg-white rounded-xl flex justify-center items-center">
            <Text className="font-bold text-base text-gray-900 leading-5">
              01
            </Text>
            <Text style={{ fontSize: 14, color: "#111" }}>May</Text>
          </View>

          <View className="absolute top-5 right-5 flex flex-row gap-2 items-center bg-white h-7 rounded-[14px] px-[14px] border border-gray-200">
            <OctagonAlertIcon size={16} color="#ff0000" />
            <Text className="font-sans text-gray-600 font-semibold text-sm text-center capitalize">
              3 Spots Open
            </Text>
          </View>

  
          <View className="absolute right-5 bottom-5 w-[110px] h-[110px] bg-white rounded-[18px] flex justify-center items-center shadow-md">
            <Image
              source={require("../assets/images/traininglogo.png")}
              className="w-[90px] h-[90px]"
              resizeMode="contain"
            />
          </View>

          {/* Avatar Group with +5 badge */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setModalVisible(true)}
            className="absolute bottom-5 left-[18px] flex flex-row items-center h-8"
          >
            {[0, 1, 2].map((idx) => (
              <Image
                key={idx}
                source={participants[idx].image}
                className="w-8 h-8 rounded-full border-2 border-white -ml-2.5 z-10"
              />
            ))}
            <View className="w-8 h-8 rounded-full bg-white border-2 border-white -ml-2.5 flex justify-center items-center z-20">
              <Text style={{ color: "#000", fontWeight: "700", fontSize: 16 }}>
                +5
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Text Section */}
        <View className="px-4">
          <Text className="text-white font-sans font-bold text-[22px] leading-7 capitalize pt-7">
            Weight Loss Challenge
          </Text>
          <Text className="text-[#9f9f9f] font-sans font-medium text-base leading-6 mt-3">
            Become The Most Consistent Version Of Yourself.{"\n"}
            Build The Habit That Gets Results. Check-In For 30{"\n"}
            Days This Month To Prove Your Dedication.
          </Text>

          {/* Date Row */}
          <View className="flex flex-row items-center mt-5">
            <Calendar color="#fff" size={22} className="mr-2.5" />
            <Text className="text-white font-sans font-semibold text-base leading-[22px] px-2.5 py-1 rounded-md">
              01 May 2025 to 30 May 2025
            </Text>
          </View>
        </View>

        <View className="px-4 w-full aspect-[361/236] overflow-hidden mt-10 rounded-t-[18px]">
          <Image
            source={require("../assets/images/whey.png")}
            className="w-full h-full rounded-t-[18px]"
            resizeMode="cover"
          />
        </View>

        {/* Prize Description */}
        <View className="bg-[#181818] rounded-b-[18px] mx-4 py-5 px-[18px]">
          <Text
            style={{
              fontFamily: "Inter",
              fontWeight: "600",
              fontSize: 16,
              lineHeight: 24,
              color: "#fff",
              textTransform: "capitalize",
              marginBottom: 4,
            }}
          >
            The Prize:
          </Text>
          <Text className="font-sans font-semibold text-base leading-6 text-[#9f9f9f] capitalize mb-1">
            The First 10 Members To Complete The Challenge Will Receive A 2lb
            Tub Of Whey Protein
          </Text>
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          <Text className="text-white font-sans font-bold text-[22px] leading-7 capitalize pb-4 mt-10">
            Reward Partner
          </Text>
          <View className="flex flex-row items-center pb-6">
            <View className="w-[110px] h-[110px] bg-white rounded-[18px] flex justify-center items-center shadow-md">
              <Image
                source={require("../assets/images/traininglogo.png")}
                className="w-[90px] h-[90px]"
                resizeMode="contain"
              />
            </View>
            <View className="ml-6 flex justify-center flex-1">
              <Text className="font-sans font-semibold text-xl text-white mb-1">
                Leefit Kettlebells
              </Text>
              <Text className="font-sans font-medium text-base text-[#9f9f9f] leading-[22px]">
                32, Alkhoori Building, 32 Street,
              </Text>
              <Text className="font-sans font-medium text-base text-[#9f9f9f] leading-[22px]">
                Al Karama, Dubai.
              </Text>
              <Text className="font-sans font-semibold text-base text-[#9f9f9f] leading-[22px] mt-3">
                +971 545 254 896
              </Text>
            </View>
          </View>
        </View>

        <View className="px-4">
          <View className="w-full h-px bg-white opacity-10 my-[28px]" />
        </View>

        <View className="px-4">
          <Text className="text-white font-sans font-bold text-[22px] leading-6 capitalize pb-3">
            The Rules
          </Text>

          <View>
            {[
              "Check into the gym 30 times between July 1st and July 30th.",
              "Your attendance is automatically tracked when you scan your QR code at the front desk",
              "The first 10 members to complete the challenge will receive a 2lb tub of whey protein",
              "Maximum 10 members allowed",
            ].map((rule, i) => (
              <Text
                key={i}
                className={`text-[#9f9f9f] font-sans font-medium text-base leading-[26px] ${
                  i === 3 ? "" : "mb-3"
                }`}
              >
                {i + 1}. {rule}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>

     
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 flex justify-end bg-[rgba(0,0,0,0.55)]">
          <View className="bg-white rounded-t-[30px] w-full max-h-full px-6 pt-9 pb-9">
            {/* Modal header */}
            <View className="flex flex-row justify-between items-center mb-6">
              <Text
                className="font-sans font-semibold text-xl capitalize text-black"
                accessibilityRole="header"
              >
                Participants
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="w-9 h-9 rounded-full bg-black flex justify-center items-center shadow-lg"
              >
                <Text className="text-xl text-white font-bold leading-5">
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={participants}
              keyExtractor={(_, index) => index.toString()}
              numColumns={4}
              renderItem={({ item }) => (
                <View className="w-1/4 flex items-center mb-3 px-1.5">
                  <Image
                    source={item.image}
                    className="w-[62px] h-[62px] rounded-full mb-1.5"
                  />
                  <Text
                    className="text-[#494949] font-sans font-medium text-xs leading-[15px] text-center"
                    numberOfLines={2}
                  >
                    {item.name}
                  </Text>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        activeOpacity={0.8}
        className="absolute left-[14px] right-[14px] bottom-[28px] h-[57px] rounded-[51px] bg-white border border-white flex flex-row items-center justify-start shadow-lg px-5"
        onPress={() => {}}
      >
        <Text className="font-medium text-[13px] text-[#494949] text-left capitalize">
          3 Spots Open
        </Text>

        <Text className="absolute left-0 right-0 text-center font-medium text-lg text-black tracking-[0.22px]">
          Join
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default WeightLossChallenge;
