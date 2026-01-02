import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import RNModal from "react-native-modal";

interface ParticipantsModalProps {
    isVisible: boolean;
    onClose: () => void;
    participants: any[];
}

export const ParticipantsModal = React.memo(({ isVisible, onClose, participants }: ParticipantsModalProps) => {
    return (
        <RNModal
            isVisible={isVisible}
            onBackdropPress={onClose}
            style={{ justifyContent: "flex-end", margin: 0 }}>
            <View className='flex-1 flex justify-end bg-[rgba(0,0,0,0.55)]'>
                <View className='bg-white rounded-t-[30px] px-6 pt-6 pb-0'>
                    <View className='flex flex-row justify-between items-center mb-6'>
                        <Text
                            className=' font-semibold text-xl capitalize text-black'
                            accessibilityRole='header'>
                            Participants
                        </Text>
                        <TouchableOpacity
                            onPress={onClose}
                            className='w-9 h-9 rounded-full bg-black flex justify-center items-center shadow-lg'>
                            <Text className='text-xl text-white font-bold leading-5'>
                                ✕
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={participants}
                        keyExtractor={(_, index) => index.toString()}
                        numColumns={4}
                        renderItem={({ item }) => (
                            <View className='w-1/4 flex items-center mb-3 px-1.5'>
                                <Image
                                    source={item.image}
                                    className='w-[62px] h-[62px] rounded-full mb-1.5'
                                />
                                <Text
                                    className='text-[#494949]  font-medium text-xs leading-[15px] text-center'
                                    numberOfLines={2}>
                                    {item.name}
                                </Text>
                            </View>
                        )}
                    />
                </View>
            </View>
        </RNModal>
    );
});
