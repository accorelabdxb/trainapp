import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { WAVE_ANIMATION_DURATION, WAVE_PAUSE_DURATION } from "../constants";

export const useWaveAnimation = () => {
  const waveAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startWave = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnimation, {
            toValue: 1,
            duration: WAVE_ANIMATION_DURATION,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(waveAnimation, {
            toValue: -1,
            duration: WAVE_ANIMATION_DURATION,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(waveAnimation, {
            toValue: 0,
            duration: WAVE_ANIMATION_DURATION,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.delay(WAVE_PAUSE_DURATION),
        ])
      ).start();
    };

    startWave();
  }, [waveAnimation]);

  const rotateZ = waveAnimation.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["-15deg", "0deg", "15deg"],
  });

  return { rotateZ };
};
