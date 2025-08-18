import React from "react";
import { Image, Text, TouchableOpacity } from "react-native";
import { useUser } from "../../context/hooks/useUser";
import { ChevronRight } from "../../lib/icons/ChevronRight";
import { formatPoints } from "../../utils/codeGenerator";

interface PointsCardProps {
  onPress: () => void;
}

export const PointsCard: React.FC<PointsCardProps> = ({ onPress }) => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <TouchableOpacity
      className="bg-[#303030] p-3 ps-4 rounded-2xl flex flex-row items-center"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        className="h-8 w-8"
        source={require("../../assets/images/star.png")}
      />
      <Text className="text-white text-xl font-bold ms-2">
        {formatPoints(user.points)}
      </Text>
      <ChevronRight className="text-white" size={20} strokeWidth={1} />
    </TouchableOpacity>
  );
};
