// ClockIcon.tsx
import React from "react";
import { Clock } from "lucide-react-native";

const ClockIcon = ({ size = 36, color = "white" }) => {
  return <Clock color={color} size={size} />;
};

export default ClockIcon;
