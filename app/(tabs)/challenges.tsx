import { BASE_FILE_URL, challengesAPI } from "@/utils/api";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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
interface Challenge {
   challengeId?: number; 
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  attachmentUrl: string | null;
}

// const handleMyChallengesPress = () => {
//   // console.log("Image background button pressed!");
//   router.push("/thirtydaywarrior");
// };


const Challenges = () => {
  const handleCardPress = (challengeId: number) => {
    router.push({
      pathname: "/weightlosschallenge", // Your detail screen file
      params: { id: challengeId }, // Pass only the ID
    });
  };
  const handleMyChallengesPress = (challengeId: number) => {
    router.push({
      pathname: "/thirtydaywarrior", // Navigate to the correct page
      params: { id: challengeId },    // Pass the challenge ID
    });
  };

  const [upcomingChallenges, setUpcomingChallenges] = useState<Challenge[]>([]);
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [myChallenges, setMyChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Animation logic for the waving emoji, now correctly inside the component
  const waveAnimation = useRef(new Animated.Value(0)).current;

  const formatStartDate = (startDateString: string) => {
    const startDate = new Date(startDateString);
    const today = new Date();

    // Reset time part to compare dates only
    startDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = startDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return "Started";
    }
    if (diffDays === 0) {
      return "Starts today";
    }
    if (diffDays === 1) {
      return "Starts tomorrow";
    }
    if (diffDays <= 6) {
      return `Starts in ${diffDays} days`;
    }
    if (diffDays <= 13) {
      return "Starts next week";
    }

    // For dates further in the future, show the exact date
    const day = startDate.getDate();
    const month = startDate.toLocaleString("default", { month: "long" });

    // Function to add 'st', 'nd', 'rd', 'th' to the day
    const getOrdinalSuffix = (d: number) => {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `Starts ${day}${getOrdinalSuffix(day)} ${month}`;
  };
  const formatEndDate = (endDateString: string) => {
    const endDate = new Date(endDateString);
    const today = new Date();
    endDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return "Ended";
    }
    if (diffDays === 0) {
      return "Ends today";
    }
    if (diffDays === 1) {
      return "Ends tomorrow";
    }
    if (diffDays <= 6) {
      return `Ends in ${diffDays} days`;
    }
    if (diffDays <= 13) {
      return "Ends next week";
    }

    const day = endDate.getDate();
    const month = endDate.toLocaleString("default", { month: "long" });
    const getOrdinalSuffix = (d: number) => {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `Ends ${day}${getOrdinalSuffix(day)} ${month}`;
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
    outputRange: ["-15deg", "0deg", "15deg"],
  });

  useEffect(() => {
    // Define an async function inside the effect
    const fetchChallenges = async () => {
      try {
        setIsLoading(true);
        const data = await challengesAPI.getUpcomingChallenges();
        setUpcomingChallenges(data); // Store the fetched data in state
        // console.log("Fetched upcoming challenges:", data[0]);
      } catch (error) {
        console.error("Error fetching challenges:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenges(); // Call the function
  }, []);
  useEffect(() => {
    // Define an async function inside the effect
    const fetchActiveChallenges = async () => {
      try {
        setIsLoading(true);
        const data = await challengesAPI.getActiveChallenges();
        setActiveChallenges(data); // Store the fetched data in state
        // console.log("Fetched upcoming challenges:", data[0]);
      } catch (error) {
        console.error("Error fetching challenges:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveChallenges(); // Call the function
  }, []);
  useEffect(() => {
    // Define an async function inside the effect
    const fetchMyChallenges = async () => {
      try {
        setIsLoading(true);
        const data = await challengesAPI.getMyChallenges();
        setMyChallenges(data); // Store the fetched data in state
        // console.log("Fetched upcoming challenges:", data[0]);
      } catch (error) {
        console.error("Error fetching challenges:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyChallenges(); // Call the function
  }, []);
  if (isLoading) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }
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
        paddingVertical: 0,
      }}
    >
      {myChallenges.map((challenge) => (
        <TouchableOpacity
          key={challenge.id}
          
          onPress={() => {
              console.log("Clicked My Challenge ID:", challenge.id); // DEBUG LOG
              handleMyChallengesPress(challenge.challengeId || challenge.id); // Use challengeId if available
            }}
          activeOpacity={0.9}
        >
          <View
            className="bg-secbg rounded-2xl w-52 h-auto pb-4 mt-3 me-4 relative"
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
                  : require("../../assets/images/challenge1.png")
              }
            />
            <View className="px-4">
              <View className="mt-4">
                <Text className="text-white font-bold">{challenge.title}</Text>
              </View>

              {/* --- FINAL CODE - NO STAR --- */}
              <View className="mt-2">
                {/* Row 1: Medal and "Your Position" */}
                <View className="flex-row items-center">
                  {/* Icon container for alignment */}
                  <View className="w-6 justify-center items-center">
                    <FontAwesome5 name="medal" size={18} color="#D34848" />
                  </View>
                  <Text className="text-gray-400 text-xs ml-1">
                    Your Position
                  </Text>
                </View>

                {/* Row 2: Position Number Only */}
                <View className="flex-row items-center ">
                  {/* Spacer view to align with the icon above */}
                  <View className="w-6" />
                  <Text className="text-white font-bold text-sm ml-1">
                    2nd
                  </Text>
                </View>
              </View>
              {/* --- END OF FINAL CODE --- */}

            </View>
          </View>
        </TouchableOpacity>
      ))}
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
              {activeChallenges.map((challenge) => (
                <TouchableOpacity
                   key={challenge.id}
                  onPress={() => handleCardPress(challenge.id)}
                  activeOpacity={0.9}
                >
                  <View
                 
                    className="bg-secbg rounded-2xl w-52 h-auto pb-6 mt-3 me-4 relative"
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
                          ? {
                              uri: `${BASE_FILE_URL}${challenge.attachmentUrl}`,
                            }
                          : require("../../assets/images/challenge1.png")
                      }
                    />
                    <View className="px-4">
                      <View className="mt-4">
                        <Text className="text-white">{challenge.title}</Text>
                      </View>
                      <View className="mt-4 bg-white rounded-full w-20 px-3 py-1">
                        <View
                          className="flex flex-row items-center"
                          // onPress={() => handleJoinPress(challenge.id)}
                          // activeOpacity={0.7}
                        >
                          <Text className="text-black text-sm px-3">Join</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
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
              {upcomingChallenges.map((challenge) => (
                <TouchableOpacity
                  key={challenge.id}
                  onPress={() => handleCardPress(challenge.id)}
                  activeOpacity={0.9}
                >
                  <View
                  
                    className="bg-secbg rounded-2xl w-52 h-auto pb-6 mt-3 me-4 relative"
                  >
                    <View className="absolute top-2 left-2 bg-white rounded-full w-auto px-3 py-1 mt-2 ms-2 z-10">
                      <Text className="text-black text-xs">
                        {formatStartDate(challenge.startDate)}
                      </Text>
                    </View>
                    <Image
                      className="w-full h-40 rounded-t-2xl"
                      source={
                        challenge.attachmentUrl
                          ? {
                              uri: `${BASE_FILE_URL}${challenge.attachmentUrl}`,
                            }
                          : require("../../assets/images/challenge1.png")
                      }
                    />
                    <View className="px-4">
                      <View className="mt-4">
                        <Text className="text-white">{challenge.title}</Text>
                      </View>
                      <View className="mt-4 bg-white rounded-full w-20 px-3 py-1">
                        <TouchableOpacity
                          className="flex flex-row items-center"
                          // onPress={() => handleJoinPress(challenge.id)}
                          activeOpacity={0.7}
                        >
                          <Text className="text-black text-sm px-3">Join</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Challenges;

const styles = StyleSheet.create({});
