import { ResizeMode, Video } from "expo-av";
import React, { memo, useCallback, useRef, useState } from "react";
import { ImageSourcePropType, Text, View } from "react-native";
import { LoadingSpinner } from "./LoadingSpinner";

interface OptimizedVideoProps {
  source: ImageSourcePropType;
  style?: any;
  shouldPlay?: boolean;
  isMuted?: boolean;
  isLooping?: boolean;
  onReadyForDisplay?: (event: any) => void;
  onError?: (error: any) => void;
  useNativeControls?: boolean;
  resizeMode?: ResizeMode;
}

export const OptimizedVideo = memo<OptimizedVideoProps>(
  ({
    source,
    style,
    shouldPlay = false,
    isMuted = true,
    isLooping = true,
    onReadyForDisplay,
    onError,
    useNativeControls = false,
    resizeMode = ResizeMode.COVER,
  }) => {
    const videoRef = useRef<Video>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleLoad = useCallback(() => {
      setIsLoading(false);
    }, []);

    const handleError = useCallback(
      (error: any) => {
        setIsLoading(false);
        setHasError(true);
        onError?.(error);
      },
      [onError]
    );

    const handleReadyForDisplay = useCallback(
      (event: any) => {
        setIsLoading(false);
        onReadyForDisplay?.(event);
      },
      [onReadyForDisplay]
    );

    if (hasError) {
      return (
        <View
          style={[
            style,
            {
              backgroundColor: "#333",
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <Text className="text-white/60">Failed to load video</Text>
        </View>
      );
    }

    return (
      <View style={style}>
        {isLoading && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#000",
              zIndex: 1,
            }}
          >
            <LoadingSpinner />
          </View>
        )}
        <Video
          ref={videoRef}
          source={source as any}
          style={{ width: "100%", height: "100%" }}
          resizeMode={resizeMode}
          isMuted={isMuted}
          shouldPlay={shouldPlay}
          isLooping={isLooping}
          volume={isMuted ? 0 : 1}
          useNativeControls={useNativeControls}
          onLoad={handleLoad}
          onError={handleError}
          onReadyForDisplay={handleReadyForDisplay}
        />
      </View>
    );
  }
);
