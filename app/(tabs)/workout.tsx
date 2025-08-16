import React from 'react';
import {
    ScrollView,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Workout = () => {
    return (
        <View className="flex-1 bg-secbg">
            {/* Fixed Header */}
            <SafeAreaView className="bg-secbg absolute top-0 left-0 right-0 z-10 border-b border-gray-800" style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
            }}>
                <View className="px-6 bg-secbg flex flex-row items-center justify-between">
                    <Text className="text-white text-3xl font-bold py-4">Workout</Text>
                </View>
            </SafeAreaView>
            
            {/* Scrollable Content */}
            <ScrollView 
                className="flex-1 bg-black px-4"
                style={{ marginTop: 120 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="pt-8">
                    <Text className="text-white text-xl font-bold mb-4">Your Workouts</Text>
                    <View className="bg-secbg rounded-2xl p-4 mb-4">
                        <Text className="text-white text-lg">Workout content will go here</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default Workout;
