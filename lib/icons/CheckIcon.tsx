
import React from "react";
import { View, ViewStyle } from "react-native";
import { Check as LucideCheck } from "lucide-react-native";

export type CheckIconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
  /** Optional circular background */
  rounded?: boolean;
  bgColor?: string;
  style?: ViewStyle;
};

const CheckIcon: React.FC<CheckIconProps> = ({
  size = 24,
  color = "#10B981", // emerald-500
  strokeWidth = 2,
  rounded = false,
  bgColor = "transparent",
  style,
}) => {
  if (!rounded) {
    return (
      <LucideCheck size={size} color={color} strokeWidth={strokeWidth} />
    );
  }

  // Rounded badge version (circle behind the check)
  const box = Math.max(size + 12, size); // a bit of padding around the icon
  return (
    <View
      style={[
        {
          width: box,
          height: box,
          borderRadius: box / 2,
          backgroundColor: bgColor,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <LucideCheck size={size} color={color} strokeWidth={strokeWidth} />
    </View>
  );
};

export default CheckIcon;
