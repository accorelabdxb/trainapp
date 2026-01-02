import { FadeInView } from "@/components/AnimatedComponents";
import { LogoutButton } from "@/components/common/LogoutButton";
import { useProfile } from "@/context/hooks/useProfile";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Image, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AttendanceSection } from "../../components/dashboard/AttendanceSection";
import { ChallengesSection } from "../../components/dashboard/ChallengesSection";
import { GymStatsSection } from "../../components/dashboard/GymStatsSection";
import { LeaderboardSection } from "../../components/dashboard/LeaderboardSection";
import { PointsCard } from "../../components/dashboard/PointsCard";
import { PromotionSection } from "../../components/dashboard/PromotionSection";
import { UserGreeting } from "../../components/dashboard/UserGreeting";
import { Bell } from "../../lib/icons/Bell";

const Dashboard = () => {
  const router = useRouter();
  const { user } = useProfile();
  const [coinsEarned, setCoinsEarned] = useState(0);

  // useCallback to keep function reference stable
  const handlePointsPress = useCallback(() => {
    console.log("Points pressed!");
    router.push({
      pathname: "/redeem",
      params: { coins: coinsEarned },
    });
  }, [coinsEarned, router]);

  const handleRedeemPress = useCallback(() => {
    console.log("Redeem button pressed!");
    router.push("/redeem");
  }, [router]);

  const handleCoinsUpdate = useCallback((newCoins: number) => {
    // Only update if changed to avoid renders
    setCoinsEarned(prev => prev !== newCoins ? newCoins : prev);
  }, []);

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
      >
        <FadeInView duration={600} className="pt-8">
          <View className="flex flex-row items-center justify-between bg-secbg p-4 px-4 mx-2 rounded-2xl">
            <UserGreeting />
            <PointsCard onPress={handlePointsPress} coinsEarned={coinsEarned} />
          </View>

          <AttendanceSection
            userProfileExists={!!user?.isProfileExist}
            onCoinsUpdate={handleCoinsUpdate}
          />

          <GymStatsSection />

          <ChallengesSection />

          <LeaderboardSection />

          <PromotionSection onRedeemPress={handleRedeemPress} />

          <LogoutButton />
        </FadeInView>
      </ScrollView>
    </View>
  );
};

export default Dashboard;
