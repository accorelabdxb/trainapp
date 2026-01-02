import OctagonAlertIcon from "@/lib/icons/OctaganAlert";
import { BASE_FILE_URL } from "@/utils/api";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface ChallengeHeaderProps {
    title: string;
    attachmentUrl: string | null;
    day: string;
    month: string;
    spotsOpen: number;
    rewardPartnerLogo: string | null;
    participants: any[]; // Typing this 'any' for now as the array is local in the parent
    onBackPress: () => void;
    onParticipantsPress: () => void;
}

export const ChallengeHeader = React.memo(({
    title,
    attachmentUrl,
    day,
    month,
    spotsOpen,
    rewardPartnerLogo,
    participants,
    onBackPress,
    onParticipantsPress
}: ChallengeHeaderProps) => {

    return (
        <View className='relative'>
            <View className='pt-[60px] pb-[14px] px-4 flex flex-row items-center justify-between absolute top-0 left-0 right-0 z-10'>
                <TouchableOpacity
                    onPress={onBackPress}
                    className='w-11 h-11 bg-white rounded-full border-2 border-black flex justify-center items-center'
                    activeOpacity={0.7}>
                    <ChevronLeft
                        size={24}
                        color='#000'
                    />
                </TouchableOpacity>

                <Text
                    className='text-white font-bold text-lg leading-6 capitalize text-center flex-1 mx-2 shadow-sm'
                    style={{ textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 10 }}
                    numberOfLines={1}>
                    {title}
                </Text>

                <View className='w-[44px]' />
            </View>

            <Image
                source={
                    attachmentUrl
                        ? { uri: `${BASE_FILE_URL}${attachmentUrl}` }
                        : require("../../assets/images/challenge2.png") // Fallback
                }
                className='w-full h-[400px]'
                resizeMode='cover'
            />

            <View className='absolute top-28 left-5 w-[60px] h-[60px] bg-white rounded-xl flex justify-center items-center'>
                <Text className='font-bold text-base text-gray-900 leading-5'>
                    {day}
                </Text>
                <Text className='text-[14px] text-[#111]'>{month}</Text>
            </View>

            <View className='absolute top-28 right-5 flex flex-row gap-2 items-center bg-white h-7 rounded-[14px] px-[14px] border border-gray-200'>
                <OctagonAlertIcon
                    size={16}
                    color='#ff0000'
                />
                <Text className=' text-gray-600 font-semibold text-sm text-center capitalize'>
                    {spotsOpen} Spot{spotsOpen !== 1 ? "s" : ""} Open
                </Text>
            </View>

            <View className='absolute right-5 bottom-5 w-[110px] h-[110px] bg-white rounded-[18px] flex justify-center items-center shadow-md'>
                <Image
                    source={
                        rewardPartnerLogo
                            ? { uri: `${BASE_FILE_URL}${rewardPartnerLogo}` }
                            : require("../../assets/images/challenge2.png")
                    }
                    className='w-[90px] h-[90px]'
                    resizeMode='contain'
                />
            </View>

            {/* Avatar Group with +5 badge */}
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={onParticipantsPress}
                className='absolute bottom-5 left-[18px] flex flex-row items-center h-8'>
                {[0, 1, 2].map((idx) => (
                    <Image
                        key={idx}
                        source={participants[idx]?.image}
                        className='w-8 h-8 rounded-full border-2 border-white -ml-2.5 z-10'
                    />
                ))}
                <View className='w-8 h-8 rounded-full bg-white border-2 border-white -ml-2.5 flex justify-center items-center z-20'>
                    <Text className='text-black font-bold text-[16px]'>+5</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
});
