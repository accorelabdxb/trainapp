import React from "react";
import { Image, Text, View } from "react-native";
import { useUser } from "../../context/hooks/useUser";
import { ChevronRight } from "../../lib/icons/ChevronRight";
import { formatPoints } from "../../utils/codeGenerator";
import { GameCard } from "../common/GamifiedUI";

interface PointsCardProps {
  onPress: () => void;
  coinsEarned?: number;
}

export const PointsCard: React.FC<PointsCardProps> = ({ onPress, coinsEarned = 0 }) => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <GameCard
      onPress={onPress}
      colors={['#FFD700', '#FFA500']} // Gold gradient
      style={{
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 24,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        minWidth: 120,
      }}
      depth={4}
    >
      <View className="flex-row items-center">
        <Image
          className="h-6 w-6"
          source={require("../../assets/images/star.png")}
          style={{ tintColor: '#7a5901' }} // Darken the star icon slightly for contrast against gold
        />
        <Text className="text-black text-xl font-extrabold ms-2 leading-none pt-1">
          {formatPoints(coinsEarned)}
        </Text>
      </View>
      <ChevronRight className="text-black/60 ms-2" size={20} strokeWidth={2} />
    </GameCard>
  );
};
