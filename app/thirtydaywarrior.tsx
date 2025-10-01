import PositionCard from "@/components/challenges/PositionCard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronRight } from "../lib/icons/ChevronRight";
import { BASE_FILE_URL, challengesAPI } from "@/utils/api";

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
  currentParticipants: number;
}

const positions = [
  {
    id: "1",
    name: "Nihas Latheef",
    number: "3",
    profileImage: require("../assets/images/profile.png"),
  },
  {
    id: "2",
    name: "Sarah Johnson",
    number: "7",
    profileImage: require("../assets/images/profile.png"),
  },
  {
    id: "3",
    name: "Mike Chen",
    number: "12",
    profileImage: require("../assets/images/profile.png"),
  },
  {
    id: "4",
    name: "Emma Wilson",
    number: "15",
    profileImage: require("../assets/images/profile.png"),
  },
  {
    id: "5",
    name: "David Rodriguez",
    number: "21",
    profileImage: require("../assets/images/profile1.jpg"),
  },
  {
    id: "6",
    name: "Lisa Thompson",
    number: "28",
    profileImage: require("../assets/images/profile2.jpg"),
  },
  {
    id: "7",
    name: "Alex Kumar",
    number: "30",
    profileImage: require("../assets/images/profile1.jpg"),
  },
  {
    id: "8",
    name: "Jessica Brown",
    number: "25",
    profileImage: require("../assets/images/profile2.jpg"),
  },
];

const ThirtyDayWarrior = () => {
  const { id } = useLocalSearchParams();
  const [details, setDetails] = useState<ChallengeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleGoBack = () => {
    router.push("/challenges");
  };

  useEffect(() => {
    if (id) {
      const fetchDetails = async () => {
        try {
          setLoading(true);
          const data = await challengesAPI.getChallengeDetails(id as string);
          setDetails(data);
          console.log("My Challenge Details:", data);
        } catch (error) {
          console.error("Failed to fetch challenge details:", error);
          Alert.alert("Error", "Could not load challenge details.");
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    }
  }, [id]);

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

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="pt-4 pb-[10px] px-4 flex flex-row items-center justify-between">
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

      <FlatList
        data={positions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <PositionCard
              profileImage={item.profileImage}
              name={item.name}
              number={item.number}
            />
          </View>
        )}
        ListHeaderComponent={
          <>
            <View className="relative px-0">
              <Image
                source={
                  details.attachmentUrl
                    ? { uri: `${BASE_FILE_URL}${details.attachmentUrl}` }
                    : require("../assets/images/girlworkout.jpg")
                }
                className="w-full h-[400px]"
                resizeMode="cover"
              />
              <View className="absolute right-5 bottom-5 w-[110px] h-[110px] bg-white rounded-[18px] flex justify-center items-center shadow-md">
                <Image
                  source={
                    details.rewardPartnerLogo
                      ? { uri: `${BASE_FILE_URL}${details.rewardPartnerLogo}` }
                      : require("../assets/images/traininglogo.png")
                  }
                  className="w-[90px] h-[90px]"
                  resizeMode="contain"
                />
              </View>
            </View>

            <View className="px-4">
              <Text className="text-white font-bold text-[22px] leading-7 capitalize pt-7">
                {details.title}
              </Text>
              <Text className="text-[#9f9f9f] font-medium text-base leading-6 mt-3">
                {details.description}
              </Text>
              <TouchableOpacity
                className="w-[94px] h-10 rounded-[50px] bg-[#181818] flex-row items-center justify-evenly px-3 mt-6"
                activeOpacity={0.7}
              >
                <Text className="text-white font-normal text-base">
                  Read All
                </Text>
                <ChevronRight className="text-white" size={16} />
              </TouchableOpacity>
            </View>

            <View className="px-4">
              <View className="w-full h-px bg-white opacity-10 my-[28px]" />
            </View>

            <View className="px-4">
              <Text className="text-white font-bold text-[22px] leading-6 capitalize pb-3">
                Positions
              </Text>
            </View>
          </>
        }
        contentContainerStyle={{ paddingBottom: 160 }}
      />

      <TouchableOpacity
        activeOpacity={0.8}
        className="h-[57px] mb-4 rounded-[51px] bg-white border border-white flex flex-row items-center justify-center shadow-lg px-5"
        onPress={() => {}}
      >
        <Text className="text-center font-medium text-lg text-black tracking-[0.22px]">
          Redeem Prize
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ThirtyDayWarrior;