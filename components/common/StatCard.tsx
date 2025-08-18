import React from "react";
import { Image, ImageSourcePropType, Text, View } from "react-native";

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
    <View className="bg-secbg p-6 rounded-2xl w-40 mt-3 me-4">
      <Image className="h-8 w-8" source={icon} />
      <Text className="text-white/80 font-light my-2">{label}</Text>
      <Text className="text-[#F0B32D] text-2xl">{value}</Text>
      <Text className="text-xs text-white/40">{subtitle}</Text>
    </View>
  );
};
