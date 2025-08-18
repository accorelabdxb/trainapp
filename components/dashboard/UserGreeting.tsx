import React from "react";
import { Animated, Text, View } from "react-native";
import { useUser } from "../../context/hooks/useUser";
import { useWaveAnimation } from "../../hooks/useWaveAnimation";

export const UserGreeting: React.FC = () => {
  const { user } = useUser();
  const { rotateZ } = useWaveAnimation();

  if (!user) return null;

  return (
    <View>
      <Text className="text-white/50">Hello</Text>
      <View>
        <Text className="text-white text-xl font-bold">{user.name}</Text>
        <Animated.View
          style={{
            transform: [{ rotateZ }],
            position: "absolute",
            left: user.name.length * 8 + 5, // Approximate character width
            top: 0,
          }}
        >
          <Text className="text-sm text-white mt-1 ms-2">👋</Text>
        </Animated.View>
      </View>
    </View>
  );
};
