import { BASE_FILE_URL } from "@/utils/api";
import { Calendar } from "lucide-react-native";
import React from "react";
import { Image, Text, View } from "react-native";

interface ChallengeInfoProps {
    title: string;
    description: string;
    dateRange: string;
    prizeDetails: string;
    rewardPartner: {
        name: string;
        address: string;
        contact: string;
        logo: string;
    } | undefined;
}

export const ChallengeInfo = React.memo(({ title, description, dateRange, prizeDetails, rewardPartner }: ChallengeInfoProps) => {
    return (
        <>
            {/* Text Section */}
            <View className='px-4'>
                <Text className='text-white font-bold text-[22px] leading-7 capitalize pt-7'>
                    {title}
                </Text>
                <Text className='text-[#9f9f9f] font-medium text-base leading-6 mt-3'>
                    {description}
                </Text>

                {/* Date Row */}
                <View className='flex flex-row items-center mt-5'>
                    <Calendar
                        color='#fff'
                        size={22}
                        className='mr-2.5'
                    />
                    <Text className='text-white font-semibold text-base leading-[22px] px-2.5 py-1 rounded-md'>
                        {dateRange}
                    </Text>
                </View>
            </View>

            <View className='px-4 w-full aspect-[361/236] overflow-hidden mt-10 rounded-t-[18px]'>
                <Image
                    source={require("../../assets/images/whey.png")}
                    className='w-full h-full rounded-t-[18px]'
                    resizeMode='cover'
                />
            </View>

            {/* Prize Description */}
            <View className='bg-[#181818] rounded-b-[18px] mx-4 py-5 px-[18px]'>
                <Text className=' font-semibold text-[16px] leading-[24px] text-white capitalize mb-1'>
                    The Prize:
                </Text>
                <Text className=' font-semibold text-base leading-6 text-[#9f9f9f] capitalize mb-1'>
                    {prizeDetails}
                </Text>
            </View>

            <View style={{ paddingHorizontal: 16 }}>
                <Text className='text-white  font-bold text-[22px] leading-7 capitalize pb-4 mt-10'>
                    Reward Partner
                </Text>
                {rewardPartner ? (
                    <View className='flex flex-row items-center pb-6'>
                        <View className='w-[110px] h-[110px] bg-white rounded-[18px] flex justify-center items-center shadow-md'>
                            <Image
                                source={{
                                    uri: `${BASE_FILE_URL}${rewardPartner.logo}`,
                                }}
                                className='w-[90px] h-[90px]'
                                resizeMode='contain'
                            />
                        </View>
                        <View className='ml-6 mr-6 flex justify-center flex-1'>
                            <Text className=' font-semibold text-xl text-white mb-1'>
                                {rewardPartner.name}
                            </Text>
                            <Text className=' font-medium text-base text-[#9f9f9f] leading-[22px]'>
                                {rewardPartner.address}
                            </Text>
                            <Text className=' font-semibold text-base text-[#9f9f9f] leading-[22px]'>
                                {rewardPartner.contact}
                            </Text>
                        </View>
                    </View>
                ) : null}
            </View>

            <View className='px-4'>
                <View className='w-full h-px bg-white opacity-10 my-[28px]' />
            </View>
        </>
    );
});
