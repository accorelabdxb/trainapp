import React from "react";
import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ChallengeCardProps {
  id: number;
  title: string;
  endDate: string;
  image: ImageSourcePropType;
  onPress?: () => void;
  buttonText?: string;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  title,
  endDate,
  image,
  onPress,
  buttonText = "Join",
}) => {
  return (
    <View className="bg-secbg rounded-2xl w-4/12 h-auto pb-6 mt-3 me-4 flex items-center relative">
      <View className="absolute top-2 left-2 bg-white rounded-full w-auto px-3 py-1 mt-2 ms-2 z-10">
        <Text className="text-black text-xs">{endDate}</Text>
      </View>
      <Image className="w-full h-40 rounded-t-2xl" source={image} />
      <Text className="text-white mr-6 leading-5 py-4 px-4 mb-4">{title}</Text>
      <View className="absolute bottom-4 left-4 bg-white rounded-full w-auto px-3 py-1">
        <TouchableOpacity
          className="flex flex-row items-center"
          onPress={onPress}
          activeOpacity={0.7}
        >
          <Text className="text-black text-sm px-3">{buttonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
