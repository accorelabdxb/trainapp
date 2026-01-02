import { ScalePress, Skeleton } from "@/components/AnimatedComponents";
import { ChallengeHeader } from "@/components/challenges/ChallengeHeader";
import { ChallengeInfo } from "@/components/challenges/ChallengeInfo";
import { ChallengeRules } from "@/components/challenges/ChallengeRules";
import { ParticipantsModal } from "@/components/challenges/ParticipantsModal";
import { useToast } from "@/context/ToastContext";
import {
  useGetChallengeDetailsQuery,
  useJoinChallengeMutation
} from "@/store/slices/challengesApi";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";

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

const WeightLossChallenge = () => {
  const { id } = useLocalSearchParams();
  const challengeId = typeof id === 'string' ? id : id?.[0];

  const {
    data: details,
    isLoading: isDetailsLoading,
  } = useGetChallengeDetailsQuery(challengeId as string, {
    skip: !challengeId
  });

  const [joinChallenge, { isLoading: isJoining }] = useJoinChallengeMutation();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const { showToast } = useToast();

  const handleGoBack = useCallback(() => {
    router.push("/challenges"); // Or router.back() depending on precise requirement
  }, [router]);

  const handleJoinChallenge = async () => {
    if (details?.isJoined) return;
    if (!challengeId) return;

    try {
      const response = await joinChallenge(challengeId).unwrap();

      if (response.success) {
        showToast("Successfully joined the challenge!", "success");
        router.push("/challenges");
      } else {
        showToast(response.message || "Failed to join.", "error");
      }
    } catch (error) {
      showToast("An error occurred. Please try again.", "error");
    }
  };

  // Memoize date formatting
  const { day, month, dateRange } = useMemo(() => {
    if (!details) return { day: "", month: "", dateRange: "" };

    const start = new Date(details.startDate);
    const end = new Date(details.endDate);

    const formatDate = (date: Date) => {
      const d = date.getDate();
      const m = date.toLocaleString("default", { month: "long" });
      const y = date.getFullYear();
      return `${d} ${m} ${y}`;
    };

    return {
      day: String(start.getDate()).padStart(2, "0"),
      month: start.toLocaleString("default", { month: "short" }),
      dateRange: `${formatDate(start)} to ${formatDate(end)}`
    };
  }, [details]);

  const spotsOpen = useMemo(() => {
    if (!details) return 0;
    return (details.maxParticipants || 0) - (details.currentParticipants || 0);
  }, [details]);

  // Loading Skeleton
  if (isDetailsLoading) {
    return (
      <View className='flex-1 bg-black'>
        <View className='pt-[60px] pb-[14px] px-4 flex flex-row items-center justify-between'>
          <Skeleton width={44} height={44} borderRadius={22} />
          <Skeleton width={200} height={24} />
          <View className='w-[44px]' />
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          <View className='relative'>
            <Skeleton width="100%" height={400} borderRadius={0} />
          </View>
          <View className='px-4 mt-7'>
            <Skeleton width="80%" height={28} style={{ marginBottom: 12 }} />
            <Skeleton width="100%" height={16} style={{ marginBottom: 4 }} />
            <Skeleton width="90%" height={16} style={{ marginBottom: 4 }} />
            <Skeleton width="60%" height={16} style={{ marginBottom: 20 }} />

            <View className='flex flex-row items-center mt-2'>
              <Skeleton width={24} height={24} borderRadius={4} style={{ marginRight: 10 }} />
              <Skeleton width={150} height={24} borderRadius={6} />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (!details) {
    return (
      <View className='flex-1 bg-black justify-center items-center'>
        <Text className='text-white'>Could not find challenge details.</Text>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-black'>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <ChallengeHeader
          title={details.title || ""}
          attachmentUrl={details.attachmentUrl ?? null}
          day={day}
          month={month}
          spotsOpen={spotsOpen}
          rewardPartnerLogo={details.rewardPartnerLogo ?? null}
          participants={participants}
          onBackPress={handleGoBack}
          onParticipantsPress={() => setModalVisible(true)}
        />

        <ChallengeInfo
          title={details.title || ""}
          description={details.description || ""}
          dateRange={dateRange}
          prizeDetails={details.prizeDetails || ""}
          rewardPartner={details.rewardPartner}
        />

        <ChallengeRules rules={details.rules || ""} />
      </ScrollView>

      <ParticipantsModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        participants={participants}
      />

      {/* Join Button */}
      <ScalePress
        scaleActive={0.96}
        onPress={handleJoinChallenge}
        disabled={details.isJoined || spotsOpen <= 0 || isJoining}
        className={`absolute left-[14px] right-[14px] bottom-[28px] h-[57px] rounded-[51px] flex flex-row items-center shadow-lg px-5 ${details.isJoined || spotsOpen <= 0
          ? "bg-gray-600 border-gray-600 justify-center"
          : "bg-white border-white justify-start"
          }`}>
        {!details.isJoined && spotsOpen > 0 && !isJoining && (
          <Text className='font-medium text-[13px] text-[#494949] text-left capitalize'>
            {spotsOpen} Spot{spotsOpen !== 1 ? "s" : ""} Open
          </Text>
        )}

        <Text
          className={`absolute left-0 right-0 text-center font-medium text-lg tracking-[0.22px] ${details.isJoined || spotsOpen <= 0 ? "text-white" : "text-black"
            }`}>
          {isJoining ? "Joining..." : details.isJoined ? "Joined" : spotsOpen > 0 ? "Join" : "Full"}
        </Text>
      </ScalePress>
    </View>
  );
};

export default WeightLossChallenge;
