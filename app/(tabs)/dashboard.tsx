import { Celebration, FadeInView } from "@/components/AnimatedComponents";
import { ApiErrorBoundary } from "@/components/common/ApiErrorBoundary";
import { LogoutButton } from "@/components/common/LogoutButton";
import { useProfile } from "@/context/hooks/useProfile";
import { usePrefetchOnFocus } from "@/hooks/usePrefetch";
import {
  useCheckInMutation,
  useGetAttendanceSummaryQuery,
} from "@/store/slices/attendanceApi";
import { useGetAllChallengesQuery } from "@/store/slices/challengesApi";
import { BASE_FILE_URL } from "@/utils/api";
import * as HapticFeedback from "expo-haptics";
import { useRouter } from "expo-router";
import { Flame } from "lucide-react-native";
import moment from "moment";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GameButton, GameCard, SectionHeader } from "../../components/common/GamifiedUI";
import { StatCard } from "../../components/common/StatCard";
import { PointsCard } from "../../components/dashboard/PointsCard";
import { UserGreeting } from "../../components/dashboard/UserGreeting";
import { workoutStats } from "../../data/mockData";
import { Bell } from "../../lib/icons/Bell";
import { CircleChevronRight } from "../../lib/icons/CircleChevronRight";
interface Challenge {
  id: number;
  title: string;
  endDate: string;
  attachmentUrl: string | null;
  isUserParticipating: boolean;
}

const Dashboard = () => {
  const router = useRouter();
  const { user } = useProfile();
  console.log("user:", user);

  // Prefetch adjacent tab data for better performance
  usePrefetchOnFocus();
  const [attendance, setAttendance] = React.useState<Record<string, boolean>>(
    {}
  );
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const [coinsEarned, setCoinsEarned] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const [showCelebration, setShowCelebration] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh or refetch data
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // RTK Query hooks
  const startDate = moment().startOf("week").format("YYYY-MM-DD");
  const endDate = moment().endOf("week").format("YYYY-MM-DD");
  const { data: attendanceData, isLoading: isLoadingAttendance } =
    useGetAttendanceSummaryQuery(
      { startDate, endDate },
      { skip: !user?.isProfileExist }
    );
  const { data: challenges = [], isLoading: isLoadingChallenges } =
    useGetAllChallengesQuery();
  const [checkIn, { isLoading: isCheckingIn }] = useCheckInMutation();

  const handleImageButtonPress = () => {
    console.log("Image background button pressed!");
  };

  const handleRedeemPress = () => {
    console.log("Redeem button pressed!");
    router.push("/redeem");
  };
  const handleAttendanceSummaryPress = () => {
    router.push("/attendancesummary");
  };

  const handlePointsPress = () => {
    HapticFeedback.impactAsync(HapticFeedback.ImpactFeedbackStyle.Light); // Add haptic feedback
    // Trigger celebration
    setShowCelebration(true);
    // You might also want to navigate or show a modal here
    router.push({
      pathname: "/redeem",
      params: { coins: coinsEarned },
    });
  };

  const daysOfWeek = Array.from({ length: 7 }).map((_, i) =>
    moment().startOf("week").add(i, "day")
  );

  // Process attendance data from RTK Query
  useEffect(() => {
    if (!attendanceData) return;

    const newCoinsEarned = attendanceData?.totalcoinsEarned || 0;
    console.log("coins earned:", newCoinsEarned);
    setCoinsEarned(newCoinsEarned);

    const mapped: Record<string, boolean> = {};

    const currentWeekDays = Array.from({ length: 7 }).map((_, i) =>
      moment().startOf("week").add(i, "day").format("YYYY-MM-DD")
    );

    currentWeekDays.forEach((dateStr) => {
      mapped[dateStr] = false;
    });

    if (attendanceData?.history && Array.isArray(attendanceData.history)) {
      attendanceData.history.forEach(
        (entry: { checkInTime: string; Checkinstatus: number }) => {
          const dateStr = moment
            .utc(entry.checkInTime)
            .local()
            .format("YYYY-MM-DD");

          // Only mark as true if user actually checked in (status = 1)
          if (entry.Checkinstatus === 1) {
            mapped[dateStr] = true;
          }
        }
      );
    }

    setAttendance(mapped);
  }, [attendanceData]);

  const handleCheckIn = async (dateStr: string) => {
    const todayStr = moment().format("YYYY-MM-DD");

    // only allow today's check-in
    if (dateStr !== todayStr) return;

    // Check if already checked in today
    if (attendance[todayStr] === true) {
      console.log("Already checked in today!");
      return;
    }

    try {
      await checkIn().unwrap();
      console.log("Check-in successful");

      setAttendance((prev) => ({
        ...prev,
        [todayStr]: true,
      }));
    } catch (err) {
      console.error("Error during check-in:", err);
    }
  };
  const handleChallengePress = (challengeId: number) => {
    router.push({
      pathname: "/weightlosschallenge", // Your details screen
      params: { id: challengeId }, // Pass the challenge ID
    });
  };
  const formatEndDate = (endDateString: string) => {
    const endDate = moment(endDateString);
    const today = moment().startOf("day");
    const diffDays = endDate.startOf("day").diff(today, "days");

    if (diffDays < 0) return "Ended";
    if (diffDays === 0) return "Ends today";
    if (diffDays === 1) return "Ends tomorrow";
    return `Ends in ${diffDays} days`;
  };

  return (
    <ApiErrorBoundary>
      <View className="flex-1 bg-black">
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
            <Image
              className="h-6 w-36"
              source={require("../../assets/images/logo.png")}
            />
            <View className="flex flex-row items-center justify-center">
              <Image
                className="h-10 w-10 rounded-full"
                source={require("../../assets/images/profile.png")}
              />
              <Bell className="text-white ms-6" size={28} strokeWidth={1.5} />
            </View>
          </View>
        </SafeAreaView>

        {/* Scrollable Content */}
        <ScrollView
          className="flex-1 bg-black"
          style={{ marginTop: 120 }}
          contentContainerStyle={{ paddingBottom: 10 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
          }
        >
          <View className="pt-8">
            <View className="pt-8 mb-4">
              <GameCard
                colors={['#1a1a1a', '#000000']}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}
                depth={6}
              >
                <View>
                  <UserGreeting />
                  <View className="flex-row items-center mt-2 bg-neutral-900/50 self-start px-2 py-1 rounded-full border border-neutral-800">
                    <Flame size={14} color="#FFeb3b" fill="#FFeb3b" />
                    <Text className="text-white/90 text-xs ml-1 font-bold">3 Day Streak</Text>
                  </View>
                </View>
                <PointsCard
                  onPress={handlePointsPress}
                  coinsEarned={coinsEarned}
                />
              </GameCard>
            </View>

            <GameCard
              colors={['#252525', '#121212']}
              style={{ marginTop: 16, marginHorizontal: 8, padding: 20 }}
              depth={6}
            >
              <View className="flex flex-row items-center justify-between mb-4">
                <Text className="text-white text-lg font-bold">
                  Consistency is Power 💪
                </Text>
                <TouchableOpacity onPress={handleAttendanceSummaryPress} activeOpacity={0.7} className="bg-neutral-800 p-2 rounded-full">
                  <CircleChevronRight
                    className="text-white/90"
                    size={20}
                    strokeWidth={2}
                  />
                </TouchableOpacity>
              </View>

              {/* Loading state for attendance dates */}
              {isLoadingAttendance ? (
                <View className="flex items-center justify-center h-20 mt-2">
                  <ActivityIndicator size="large" color="#ffffff" />
                  <Text className="text-white/70 text-sm mt-2">
                    Loading attendance...
                  </Text>
                </View>
              ) : (
                <View className="flex flex-row items-center justify-between">
                  {daysOfWeek.map((day) => {
                    const dateStr = day.format("YYYY-MM-DD");
                    const todayStr = moment().format("YYYY-MM-DD");
                    const attended = attendance[dateStr] || false;
                    const isToday = dateStr === todayStr;

                    return (
                      <View
                        key={dateStr}
                        className="flex justify-center items-center mt-2"
                      >
                        <Text className="font-normal text-xs text-white mb-1">
                          {day.format("ddd")}
                        </Text>
                        <TouchableOpacity
                          className={`rounded-full w-12 h-12 border border-white/10 flex items-center justify-center ${attended ? "bg-green-600" : "bg-input"
                            } ${isCheckingIn && isToday ? "opacity-70" : ""}`}
                          onPress={() => {
                            if (isToday && !isCheckingIn) {
                              handleCheckIn(dateStr);
                            } else if (!isToday) {
                              console.log("Can only check in for today");
                            }
                          }}
                          disabled={isCheckingIn && isToday}
                        >
                          {isCheckingIn && isToday ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                          ) : (
                            <Text className="text-white/80 font-semibold text-sm">
                              {day.format("D")}
                            </Text>
                          )}
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              )}
            </GameCard>

            <View className="mt-8 px-4">
              <SectionHeader title="You're in the gym" />
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
                  {workoutStats.map((stat, index) => (
                    <FadeInView key={index} delay={index * 100} duration={400}>
                      <StatCard
                        icon={stat.icon}
                        label={stat.label}
                        value={stat.value}
                        subtitle={stat.subtitle}
                      />
                    </FadeInView>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View className="mt-8 px-4">
              <View className="flex flex-row justify-between items-center">
                <GameCard
                  colors={['#1a1a1a', '#000000']}
                  style={{ width: '48%', height: 240, borderRadius: 16, padding: 0 }}
                  onPress={handleImageButtonPress}
                  depth={8}
                >
                  <View className="absolute top-2 left-2 bg-white rounded-full w-auto px-3 py-1 mt-2 ms-2 z-10 shadow-sm">
                    <Text className="text-black text-xs font-bold">Nihas Latheef</Text>
                  </View>
                  <Image
                    className="w-80 h-full rounded-2xl opacity-90"
                    source={require("../../assets/images/photooftheday.jpg")}
                    resizeMode="cover"
                  />
                  <View className="absolute bottom-2 bg-black/80 rounded-full w-auto px-3 py-1 mt-2 ms-2 z-10 border border-white/20">
                    <Text className="text-white font-bold text-xs">
                      Body Zone Star of the week
                    </Text>
                  </View>
                </GameCard>
                <GameCard
                  colors={['#1a1a1a', '#000000']}
                  style={{ width: '48%', height: 240, borderRadius: 16, padding: 0 }}
                  onPress={handleImageButtonPress}
                  depth={8}
                >
                  <View className="absolute top-2 left-2 bg-white rounded-full w-auto px-3 py-1 mt-2 ms-2 z-10 shadow-sm">
                    <Text className="text-black text-xs font-bold">Manuprasad</Text>
                  </View>
                  <Image
                    className="w-full h-full rounded-2xl opacity-90"
                    source={require("../../assets/images/photooftheday.jpg")}
                    resizeMode="cover"
                  />
                  <View className="absolute bottom-2 bg-black/80 rounded-full w-auto px-3 py-1 mt-2 ms-2 z-10 border border-white/20">
                    <Text className="text-white font-bold text-xs">
                      Photo of the day
                    </Text>
                  </View>
                </GameCard>
              </View>
            </View>

            <View className="mt-8 px-4">
              <SectionHeader title="Challenges" />

              {/* Show a loading spinner while fetching data */}
              {isLoadingChallenges ? (
                <View className="flex items-center justify-center h-48">
                  <ActivityIndicator size="large" color="#ffffff" />
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
                      <GameCard
                        key={challenge.id}
                        colors={['#1F1F1F', '#121212']}
                        style={{ width: 220, paddingBottom: 24, marginRight: 16, marginTop: 12, borderRadius: 16, overflow: 'hidden', padding: 0 }}
                        onPress={() => handleChallengePress(challenge.id)}
                        depth={8}
                      >
                        <View className="absolute top-2 left-2 bg-white rounded-full w-auto px-3 py-1 mt-2 ms-2 z-10 shadow-sm">
                          <Text className="text-black text-xs font-bold">
                            {formatEndDate(challenge.endDate)}
                          </Text>
                        </View>

                        <Image
                          className="w-full h-40 rounded-t-2xl opacity-90"
                          source={
                            challenge.attachmentUrl
                              ? {
                                uri: `${BASE_FILE_URL}${challenge.attachmentUrl}`,
                              }
                              : require("../../assets/images/challenge1.png")
                          }
                          resizeMode="cover"
                        />

                        <Text className="text-white text-lg leading-6 py-4 px-4 font-bold">
                          {challenge.title}
                        </Text>

                        <View className="px-4 pb-0">
                          <GameButton
                            onPress={() => handleChallengePress(challenge.id)}
                            title={challenge.isUserParticipating ? "View Status" : "Join Now"}
                            variant={challenge.isUserParticipating ? "secondary" : "primary"}
                            style={{ paddingVertical: 10, borderRadius: 12 }}
                            textStyle={{ fontSize: 13 }}
                          />
                        </View>
                      </GameCard>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <View className="mt-8 px-4">
              <Text className="text-white font-bold text-xl">
                Leaderboard for the week
              </Text>
              <View className="flex flex-row items-start mt-6">
                <View className="w-4/12 h-auto flex flex-col">
                  <View className="flex-1 items-center mt-14">
                    <Image
                      className="rounded-full w-14 h-14 mb-2"
                      source={require("../../assets/images/profile.png")}
                    />
                    <Text className="text-white text-center">
                      Nihas Latheef
                    </Text>
                  </View>
                  <Image
                    source={require("../../assets/images/silver.png")}
                    className="w-full"
                  />
                </View>

                <View className="w-4/12 h-auto flex flex-col">
                  <View className="flex-1 items-center">
                    <Image
                      className="rounded-full w-20 h-20 mb-2  border-amber-300 border-2"
                      source={require("../../assets/images/profile.png")}
                    />
                    <Text className="text-white mb-4 text-center">
                      Manu Prasad
                    </Text>
                  </View>
                  <Image
                    source={require("../../assets/images/gold.png")}
                    className="w-full"
                  />
                </View>

                <View className="w-4/12 h-auto flex flex-col">
                  <View className="flex-1 items-center">
                    <Image
                      className="rounded-full w-12 h-12 mb-2 mt-24"
                      source={require("../../assets/images/profile.png")}
                    />
                    <Text className="text-white text-center ">
                      Choice Joseph
                    </Text>
                  </View>
                  <Image
                    source={require("../../assets/images/bronze.png")}
                    className="w-full"
                  />
                </View>
              </View>

              <View className="mt-8">
                <View className="flex flex-row justify-between items-center">
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingRight: 16,
                      paddingVertical: 10,
                    }}
                  >
                    {[
                      require("../../assets/images/ad1.jpg"),
                      require("../../assets/images/ad3.jpg"),
                      require("../../assets/images/ad2.png")
                    ].map((imgSource, idx) => (
                      <GameCard
                        key={idx}
                        colors={['#000', '#111']}
                        style={{ marginRight: 16, borderRadius: 24, padding: 0 }}
                        depth={10}
                        onPress={() => { }} // dummy
                        disabled={true}
                      >
                        <Image
                          style={{ width: 300, height: 300, borderRadius: 24, opacity: 0.9 }}
                          source={imgSource}
                          resizeMode="cover"
                        />
                        <View className="absolute bottom-6 right-6 z-20">
                          <GameButton
                            title="Redeem"
                            onPress={handleRedeemPress}
                            variant="accent"
                            style={{ borderRadius: 30, paddingVertical: 10, paddingHorizontal: 20 }}
                            textStyle={{ color: 'black', fontSize: 13 }}
                          />
                        </View>
                      </GameCard>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </View>
            <LogoutButton />
          </View>
        </ScrollView>
      </View >
      <Celebration trigger={showCelebration} onFinished={() => setShowCelebration(false)} />
    </ApiErrorBoundary >
  );
};

export default Dashboard;
