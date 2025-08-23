import React from 'react'
import { Image, Text, View, ImageSourcePropType } from 'react-native'

interface PositionCardProps {
  profileImage: ImageSourcePropType
  name: string
  number: string | number
}

const PositionCard = ({ profileImage, name, number }: PositionCardProps) => {
  return (
    <View className="w-full h-[60px] rounded-[15px] bg-neutral-700 flex-row gap-3 items-center mb-3">

      <Image
        source={profileImage}
        className="w-[42px] h-[42px] ml-3 rounded-full"
        resizeMode="cover"
      />
      
   
      <Text className="flex-1 ml-2 text-white font-medium text-sm capitalize">
        {name}
      </Text>
      
 
      <Text className="mr-4 text-white font-bold text-lg">
        {number}
      </Text>
    </View>
  )
}

export default PositionCard