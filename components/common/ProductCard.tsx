import React from "react";
import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  points: number;
  image: ImageSourcePropType;
  onRedeem: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  name,
  description,
  points,
  image,
  onRedeem,
}) => {
  return (
    <TouchableOpacity
      className="bg-secbg rounded-2xl p-4 mb-4 flex-row"
      onPress={onRedeem}
    >
      <Image className="w-20 h-20 rounded-xl mr-4" source={image} />
      <View className="flex-1">
        <Text className="text-white font-bold text-lg mb-1">{name}</Text>
        <Text className="text-white/60 text-sm mb-2">
          {description.length > 40
            ? `${description.substring(0, 40)}...`
            : description}
        </Text>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Image
              className="h-4 w-4 mr-1"
              source={require("../../assets/images/star.png")}
            />
            <Text className="text-amber-400 font-bold">{points} pts</Text>
          </View>
          <TouchableOpacity
            className="bg-amber-500 px-4 py-2 rounded-full"
            onPress={onRedeem}
          >
            <Text className="text-black font-bold text-sm">Redeem</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};
