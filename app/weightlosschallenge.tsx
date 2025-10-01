import OctagonAlertIcon from "@/lib/icons/OctaganAlert";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Calendar, ChevronLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import RNModal from "react-native-modal";

import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { BASE_FILE_URL, challengesAPI } from "@/utils/api";

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
interface ChallengeDetail {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  attachmentUrl: string | null;
  prizeDetails: string;
  rules: string;
  rewardPartnerLogo: string | null;
  rewardPartner?: {
    name: string;
    address: string;
    contact: string;
    logo: string;
  };
  isJoined: boolean;
    maxParticipants: number; 
  currentParticipants: number
}

const WeightLossChallenge = () => {
  const { id } = useLocalSearchParams();
  console.log("id", id);
  const [details, setDetails] = useState<ChallengeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const handleGoBack = () => {
    router.push("/challenges");
  };


const handleJoinChallenge = () => {

  if (details?.isJoined) return;

  
  Alert.alert(
    "Join Challenge",
    "Are you sure you want to join this challenge?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Join",
      
        onPress: async () => {
          if (!id) return;
          try {
            setLoading(true); 
            const response = await challengesAPI.joinChallenge(id as string);

            if (response.success) {
              // 1. Success alert is removed.
              // 2. Navigate directly to the challenges list.
              router.push("/challenges");
            } else {
              // Error handling remains the same.
              Alert.alert("Error", response.message || "Failed to join.");
            }
          } catch (error) {
            Alert.alert("Error", "An error occurred. Please try again.");
          }finally {
          setLoading(false);
        }
        },
      },
    ]
  );
};

  useEffect(() => {
    if (id) {
      const fetchDetails = async () => {
        try {
          setLoading(true);
          const data = await challengesAPI.getChallengeDetails(id as string);
          setDetails(data);
          console.log("object", data);
        } catch (error) {
          console.error("Failed to fetch details:", error);
          Alert.alert("Error", "Could not load challenge details.");
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    }
  }, [id]);
  

  // Handle loading and error states
  if (loading) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }
  if (!details) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-white">Could not find challenge details.</Text>
      </View>
    );
  }
  const startDate = new Date(details.startDate);
  const day = String(startDate.getDate()).padStart(2, "0");
  const month = startDate.toLocaleString("default", { month: "short" });
  const formatDate = (date: Date) => {
    const day = date.getDate();
    // Use 'long' for the full month name (e.g., "May", "September")
    const monthName = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${monthName} ${year}`;
  };

  // 2. Create the full date range string
  const dateRange = `${formatDate(startDate)} to ${formatDate(
    new Date(details.endDate)
  )}`;
  const spotsOpen = details.maxParticipants - details.currentParticipants;

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
          className="text-white font-bold text-lg leading-6 capitalize text-center flex-1"
          numberOfLines={1}
        >
          {details.title}
        </Text>

        <View className="w-[44px]" />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="relative">
          <Image
            source={
              details.attachmentUrl
                ? { uri: `${BASE_FILE_URL}${details.attachmentUrl}` }
                : require("../assets/images/challenge2.png") // Fallback image
            }
            className="w-full h-[400px]"
            resizeMode="cover"
          />

          <View className="absolute top-5 left-5 w-[60px] h-[60px] bg-white rounded-xl flex justify-center items-center">
            <Text className="font-bold text-base text-gray-900 leading-5">
              {day}
            </Text>
            <Text className="text-[14px] text-[#111]">{month}</Text>
          </View>

          <View className="absolute top-5 right-5 flex flex-row gap-2 items-center bg-white h-7 rounded-[14px] px-[14px] border border-gray-200">
            <OctagonAlertIcon size={16} color="#ff0000" />
            <Text className=" text-gray-600 font-semibold text-sm text-center capitalize">
             {spotsOpen} Spot{spotsOpen !== 1 ? 's' : ''} Open
            </Text>
          </View>

          <View className="absolute right-5 bottom-5 w-[110px] h-[110px] bg-white rounded-[18px] flex justify-center items-center shadow-md">
            <Image
              source={
                details.attachmentUrl
                  ? { uri: `${BASE_FILE_URL}${details.rewardPartnerLogo}` }
                  : require("../assets/images/challenge2.png") // Fallback image
              }
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
              <Text className="text-black font-bold text-[16px]">+5</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Text Section */}
        <View className="px-4">
          <Text className="text-white font-bold text-[22px] leading-7 capitalize pt-7">
            {details.title}
          </Text>
          <Text className="text-[#9f9f9f] font-medium text-base leading-6 mt-3">
            {details.description}
          </Text>

          {/* Date Row */}
          <View className="flex flex-row items-center mt-5">
            <Calendar color="#fff" size={22} className="mr-2.5" />
            <Text className="text-white font-semibold text-base leading-[22px] px-2.5 py-1 rounded-md">
              {/* 3. Use the dynamic dateRange variable here */}
              {dateRange}
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
          <Text className=" font-semibold text-[16px] leading-[24px] text-white capitalize mb-1">
            The Prize:
          </Text>
          <Text className=" font-semibold text-base leading-6 text-[#9f9f9f] capitalize mb-1">
            {details.prizeDetails}
          </Text>
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          <Text className="text-white  font-bold text-[22px] leading-7 capitalize pb-4 mt-10">
            Reward Partner
          </Text>
          {details.rewardPartner && (
            <View className="flex flex-row items-center pb-6">
              <View className="w-[110px] h-[110px] bg-white rounded-[18px] flex justify-center items-center shadow-md">
                <Image
                  source={{
                    uri: `${BASE_FILE_URL}${details.rewardPartner.logo}`,
                  }}
                  className="w-[90px] h-[90px]"
                  resizeMode="contain"
                />
              </View>
              <View className="ml-6 mr-6 flex justify-center flex-1">
                <Text className=" font-semibold text-xl text-white mb-1">
                  {details.rewardPartner.name}
                </Text>
                <Text className=" font-medium text-base text-[#9f9f9f] leading-[22px]">
                  {details.rewardPartner.address}
                </Text>
                <Text className=" font-semibold text-base text-[#9f9f9f] leading-[22px]">
                  {details.rewardPartner.contact}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View className="px-4">
          <View className="w-full h-px bg-white opacity-10 my-[28px]" />
        </View>

        <View className="px-4">
          <Text className="text-white  font-bold text-[22px] leading-6 capitalize pb-3">
            The Rules
          </Text>

          <View>
            {
              // 1. Parse the rules string into an array of individual rules
              // This regex finds all text enclosed in "quotes" and removes the quotes.
              details.rules
                .match(/"([^"]*)"/g)
                ?.map((rule) => rule.replace(/"/g, ""))
                .map((rule, i) => (
                  // 2. Map over the dynamic rules to display them
                  <Text
                    key={i}
                    className="text-[#9f9f9f] font-medium text-base leading-[26px] mb-3"
                  >
                    {i + 1}. {rule}
                  </Text>
                ))
            }
          </View>
        </View>
      </ScrollView>

      <RNModal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
        <View className="flex-1 flex justify-end bg-[rgba(0,0,0,0.55)]">
          <View className="bg-white rounded-t-[30px] px-6 pt-6 pb-0">
            <View className="flex flex-row justify-between items-center mb-6">
              <Text
                className=" font-semibold text-xl capitalize text-black"
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
                    className="text-[#494949]  font-medium text-xs leading-[15px] text-center"
                    numberOfLines={2}
                  >
                    {item.name}
                  </Text>
                </View>
              )}
            />
          </View>
        </View>
      </RNModal>
   // In WeightLossChallenge.tsx, replace the bottom TouchableOpacity with this code

<TouchableOpacity
  activeOpacity={0.8}
  onPress={handleJoinChallenge}
  disabled={details.isJoined || spotsOpen <= 0}
  className={`absolute left-[14px] right-[14px] bottom-[28px] h-[57px] rounded-[51px] flex flex-row items-center shadow-lg px-5 ${
    details.isJoined || spotsOpen <= 0
      ? "bg-gray-600 border-gray-600 justify-center"
      : "bg-white border-white justify-start"
  }`}
>
 {!details.isJoined && spotsOpen > 0 && (
    <Text className="font-medium text-[13px] text-[#494949] text-left capitalize">
      {spotsOpen} Spot{spotsOpen !== 1 ? "s" : ""} Open
    </Text>
  )}

  <Text
    className={`absolute left-0 right-0 text-center font-medium text-lg tracking-[0.22px] ${
      details.isJoined || spotsOpen <= 0 ? "text-white" : "text-black"
    }`}
  >
    {details.isJoined
      ? "Joined"
      : spotsOpen > 0
      ? "Join"
      : "Full"}
  </Text>
</TouchableOpacity>
    </View>
  );
};

export default WeightLossChallenge;
