import React from "react";
import { Image, ImageSourcePropType, Text, View } from "react-native";
import { GameCard } from "./GamifiedUI";

interface StatCardProps {
  icon: ImageSourcePropType;
  label: string;
  value: string;
  subtitle: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  subtitle,
}) => {
  return (
    <GameCard
      colors={['#3a3a3a', '#1a1a1a']}
      style={{
        padding: 24,
        borderRadius: 24,
        width: 160,
        marginRight: 16,
        marginTop: 12,
      }}
      depth={5}
    >
      <View>
        <Image className="h-8 w-8 opacity-90" source={icon} />
        <Text className="text-white/70 font-medium my-3 text-sm tracking-wide">{label}</Text>
        <Text className="text-white text-3xl font-black">{value}</Text>
        <Text className="text-xs text-white/50 mt-1 font-medium">{subtitle}</Text>
      </View>
    </GameCard>
  );
};
