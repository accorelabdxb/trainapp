import { ScalePress, Skeleton } from "@/components/AnimatedComponents";
import { useToast } from "@/context/ToastContext";
import { BASE_FILE_URL, challengesAPI } from "@/utils/api";
import { useRouter } from "expo-router";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";

interface Challenge {
    id: number;
    title: string;
    endDate: string;
    attachmentUrl: string | null;
    isUserParticipating: boolean;
}

export const ChallengesSection = React.memo(() => {
    const router = useRouter();
    const { showToast } = useToast();
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                setIsLoading(true);
                const data = await challengesAPI.getAllChallenges();
                setChallenges(data);
            } catch (error) {
                console.error("Error fetching challenges on dashboard:", error);
                showToast("Failed to load challenges", "error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchChallenges();
    }, []);

    const handleChallengePress = (challengeId: number) => {
        router.push({
            pathname: "/weightlosschallenge",
            params: { id: challengeId },
        });
    };

    const formatEndDate = (endDateString: string) => {
        const endDate = moment(endDateString);
        const today = moment().startOf('day');
        const diffDays = endDate.startOf('day').diff(today, 'days');

        if (diffDays < 0) return "Ended";
        if (diffDays === 0) return "Ends today";
        if (diffDays === 1) return "Ends tomorrow";
        return `Ends in ${diffDays} days`;
    };

    return (
        <View className="mt-8 px-4">
            <Text className="text-white font-bold text-xl">Challenges</Text>

            {/* Show a loading spinner while fetching data */}
            {isLoading ? (
                <View className="flex flex-row">
                    {[1, 2].map((i) => (
                        <View key={i} className="bg-secbg rounded-2xl w-52 pb-6 mt-3 me-4 overflow-hidden">
                            <Skeleton width="100%" height={160} borderRadius={16} />
                            <View className="p-4">
                                <Skeleton width="80%" height={20} style={{ marginBottom: 10 }} />
                                <Skeleton width={60} height={20} borderRadius={12} />
                            </View>
                        </View>
                    ))}
                </View>
            ) : (
                <View className="flex flex-row justify-between items-center">
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingVertical: 0,
                        }}
                    >
                        {/* Map over the first 4 challenges from the state */}
                        {challenges.slice(0, 4).map((challenge) => (
                            <ScalePress
                                key={challenge.id}
                                className="bg-secbg rounded-2xl w-52 pb-6 mt-3 me-4 flex items-center relative"
                                onPress={() => handleChallengePress(challenge.id)}
                            >
                                <View className="absolute top-2 left-2 bg-white rounded-full w-auto px-3 py-1 mt-2 ms-2 z-10">
                                    <Text className="text-black text-xs">
                                        {formatEndDate(challenge.endDate)}
                                    </Text>
                                </View>

                                <Image
                                    className="w-full h-40 rounded-t-2xl"
                                    source={
                                        challenge.attachmentUrl
                                            ? { uri: `${BASE_FILE_URL}${challenge.attachmentUrl}` }
                                            : require("../../assets/images/challenge1.png") // Fallback image. Note: Path adjustment might be needed if component moved.
                                    }
                                />

                                <Text className="text-white leading-5 py-4 px-4 mb-4 self-start font-semibold">
                                    {challenge.title}
                                </Text>

                                <View className="absolute bottom-4 left-4 bg-white rounded-full w-auto px-3 py-1">
                                    <View className="flex flex-row items-center">
                                        <Text className="text-black text-sm px-3">
                                            {challenge.isUserParticipating ? "View" : "Join"}
                                        </Text>
                                    </View>
                                </View>
                            </ScalePress>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
});
