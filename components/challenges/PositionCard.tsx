import React from "react";
import { Image, ImageSourcePropType, Text, View } from "react-native";

interface PositionCardProps {
  profileImage: ImageSourcePropType;
  name: string;
  number: string | number;
}

const PositionCard = ({ profileImage, name, number }: PositionCardProps) => {
  return (
    <View className='px-4'>
      <View className='w-full h-[60px] rounded-[15px] bg-neutral-700 flex-row gap-3 items-center mb-3'>
        <Image
          source={profileImage}
          style={{ width: 42, height: 42 }}
          className='ml-3 rounded-full'
          resizeMode='cover'
        />

        <Text className='flex-1 ml-2 text-white font-medium text-sm capitalize'>
          {name}
        </Text>

        <Text className='mr-4 text-white font-bold text-lg'>{number}</Text>
      </View>
    </View>
  );
};

export default PositionCard;
