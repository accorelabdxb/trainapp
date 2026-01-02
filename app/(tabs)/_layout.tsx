import { AnimatedTabIcon } from '@/components/AnimatedComponents';
import { Tabs } from 'expo-router';
import { BicepsFlexed, Dumbbell, Home, PlusCircle, Users } from 'lucide-react-native';
import { View } from 'react-native';

import { HapticFeedback } from '@/utils/haptics';

export default function Layout() {
    const handleTabPress = () => {
        HapticFeedback.selection();
    };

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#1F1F1F',
                    borderTopWidth: 0,
                    height: 70,
                    paddingBottom: 10,
                    paddingTop: 5,
                },
                tabBarActiveTintColor: '#F0B32D',
                tabBarInactiveTintColor: '#888',
                tabBarHideOnKeyboard: true
            }}
        >
            <Tabs.Screen
                name="dashboard"
                listeners={{
                    tabPress: handleTabPress,
                }}
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <AnimatedTabIcon focused={focused}>
                            <Home size={24} color={color} strokeWidth={focused ? 2 : 1} />
                        </AnimatedTabIcon>
                    ),
                }}
            />
            <Tabs.Screen
                name="challenges"
                listeners={{
                    tabPress: handleTabPress,
                }}
                options={{
                    title: 'Challenges',
                    tabBarIcon: ({ color, focused }) => (
                        <AnimatedTabIcon focused={focused}>
                            <BicepsFlexed size={24} color={color} strokeWidth={focused ? 2 : 1} />
                        </AnimatedTabIcon>
                    ),
                }}
            />
            <Tabs.Screen
                name="camera"
                listeners={{
                    tabPress: handleTabPress,
                }}
                options={{
                    title: '',
                    tabBarIcon: ({ color, focused }) => (
                        <AnimatedTabIcon focused={focused}>
                            <View style={{ marginTop: 20 }}>
                                <PlusCircle size={50} color={color} strokeWidth={1} fill={focused ? "#F0B32D" : "transparent"} />
                            </View>
                        </AnimatedTabIcon>
                    ),
                    tabBarLabel: '',
                }}
            />
            <Tabs.Screen
                name="workout"
                listeners={{
                    tabPress: handleTabPress,
                }}
                options={{
                    title: 'Workout',
                    tabBarIcon: ({ color, focused }) => (
                        <AnimatedTabIcon focused={focused}>
                            <Dumbbell size={24} color={color} strokeWidth={focused ? 2 : 1} />
                        </AnimatedTabIcon>
                    ),
                }}
            />
            <Tabs.Screen
                name="social"
                listeners={{
                    tabPress: handleTabPress,
                }}
                options={{
                    title: 'Social',
                    tabBarIcon: ({ color, focused }) => (
                        <AnimatedTabIcon focused={focused}>
                            <Users size={24} color={color} strokeWidth={focused ? 2 : 1} />
                        </AnimatedTabIcon>
                    ),
                }}
            />
        </Tabs>
    );
}