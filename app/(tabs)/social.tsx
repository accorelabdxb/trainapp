import { ResizeMode, Video } from "expo-av";
import { ArrowLeftCircle, Heart } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Image,
    ImageSourcePropType,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Post = {
  id: number;
  media: ImageSourcePropType;
  mediaType: "image" | "video";
  user: string;
  time: string;
};

const posts: Post[] = [
  {
    id: 1,
    media: require("../../assets/images/soc5.jpg"),
    mediaType: "image",
    user: "Nihas",
    time: "3 sec ago",
  },
  {
    id: 2,
    media: require("../../assets/images/soc2.jpg"),
    mediaType: "image",
    user: "Sharath",
    time: "1 min ago",
  },
  {
    id: 3,
    media: require("../../assets/images/soc3.jpg"),
    mediaType: "image",
    user: "Appu",
    time: "5 min ago",
  },
  {
    id: 4,
    media: require("../../assets/videos/sample.mp4"),
    mediaType: "video",
    user: "Amal",
    time: "1 hr ago",
  },
  {
    id: 5,
    media: require("../../assets/images/soc6.jpg"),
    mediaType: "image",
    user: "Pattu",
    time: "10 min ago",
  },
  {
    id: 6,
    media: require("../../assets/images/soc2.jpg"),
    mediaType: "image",
    user: "Rahul",
    time: "20 min ago",
  },
  {
    id: 7,
    media: require("../../assets/images/soc3.jpg"),
    mediaType: "image",
    user: "Amal",
    time: "1 hr ago",
  },
  {
    id: 8,
    media: require("../../assets/videos/sample2.mp4"),
    mediaType: "video",
    user: "Amal",
    time: "1 hr ago",
  },
  {
    id: 9,
    media: require("../../assets/images/soc4.jpg"),
    mediaType: "image",
    user: "Amal",
    time: "1 hr ago",
  },
];

const Social = () => {
  const [imageHeights, setImageHeights] = useState<{ [key: number]: number }>(
    {}
  );
  const [selectedImage, setSelectedImage] = useState<Post | null>(null);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [videoDimensions, setVideoDimensions] = useState<{
    [key: number]: { width: number; height: number };
  }>({});
  const [videoLoadingStates, setVideoLoadingStates] = useState<{
    [key: number]: boolean;
  }>({});
  const [showVideoControls, setShowVideoControls] = useState(false);
  const videoControlsTimeoutRef = useRef<number | null>(null);
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const animatedScale = React.useRef(new Animated.Value(0)).current;
  const animatedOpacity = React.useRef(new Animated.Value(0)).current;
  const [showEmojiPopup, setShowEmojiPopup] = useState(false);
  const [postEmojis, setPostEmojis] = useState<{ [key: number]: string[] }>({});

  const videoRef = useRef<Video>(null);

  const openFullScreen = () => {
    setShowFullScreen(true);
    Animated.parallel([
      Animated.spring(animatedScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 30,
        friction: 7,
      }),
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeFullScreen = () => {
    Animated.parallel([
      Animated.spring(animatedScale, {
        toValue: 0,
        useNativeDriver: true,
        tension: 30,
        friction: 7,
      }),
      Animated.timing(animatedOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowFullScreen(false);
      animatedScale.setValue(0);
      animatedOpacity.setValue(0);
    });
  };

  useEffect(() => {
    posts.forEach(async (post) => {
      if (post.mediaType === "image") {
        const source = Image.resolveAssetSource(post.media);
        const ratio = source.height / source.width;
        const width = 180; // approximate column width
        const height = ratio * width;

        setImageHeights((prev) => ({
          ...prev,
          [post.id]: height,
        }));
      } else {
        // For videos, set a reasonable default height and let onReadyForDisplay update the aspect ratio
        const width = 180;
        const height = width * (9 / 16); // Default to 9:16 aspect ratio for videos

        setImageHeights((prev) => ({
          ...prev,
          [post.id]: height,
        }));

        // Set default video dimensions
        setVideoDimensions((prev) => ({
          ...prev,
          [post.id]: { width: 16, height: 9 },
        }));
      }
    });
  }, []);

  // Cleanup timeout when component unmounts or selected image changes
  useEffect(() => {
    return () => {
      if (videoControlsTimeoutRef.current) {
        clearTimeout(videoControlsTimeoutRef.current);
      }
    };
  }, [selectedImage]);

  // Ensure video starts playing when selected
  useEffect(() => {
    if (
      selectedImage &&
      selectedImage.mediaType === "video" &&
      videoRef.current
    ) {
      const playVideo = async () => {
        try {
          await videoRef.current?.playAsync();
          console.log("Video started playing");
        } catch (error) {
          console.log("Error starting video:", error);
        }
      };
      // Small delay to ensure video is loaded
      setTimeout(playVideo, 100);
    }
  }, [selectedImage]);

  const leftColumn: Post[] = [];
  const rightColumn: Post[] = [];

  // Distribute into left and right columns for balance
  posts.forEach((post, index) => {
    (index % 2 === 0 ? leftColumn : rightColumn).push(post);
  });

  const renderPost = (post: Post) => (
  <View key={post.id} className="mb-4">
    <TouchableOpacity
      onPress={() => {
        setSelectedImage(post);
        setShowVideoControls(false);
      }}
      activeOpacity={0.9}
    >
      <View className="relative"> {/* Add relative container here */}

        {post.mediaType === "image" ? (
          <Image
            source={post.media}
            style={{
              width: "100%",
              height: imageHeights[post.id] || 200,
              borderRadius: 16,
            }}
            resizeMode="cover"
          />
        ) : (
          <View
            style={{
              width: "100%",
              aspectRatio: videoDimensions?.[post.id]
                ? videoDimensions[post.id].width /
                  videoDimensions[post.id].height
                : 16 / 9,
              borderRadius: 16,
              backgroundColor: "#000",
              overflow: "hidden",
            }}
          >
            <Video
              source={post.media as any}
              style={{
                width: "100%",
                height: "100%",
              }}
              resizeMode={ResizeMode.COVER}
              isMuted={true}
              shouldPlay={true}
              isLooping={true}
              volume={0}
              onReadyForDisplay={(event) => {
                const { width, height } = event.naturalSize;
                setVideoDimensions((prev) => ({
                  ...prev,
                  [post.id]: { width, height },
                }));
              }}
            />
          </View>
        )}

        {/* Emoji Overlay on each post */}
        {postEmojis[post.id] && postEmojis[post.id].length > 0 && (
          <View
            className="absolute bottom-2 right-2 flex-row"
            style={{ height: 20 }}
          >
            {postEmojis[post.id].map((emoji, i) => (
              <View
                key={emoji}
                className="bg-white rounded-full justify-center items-center"
                style={{
                  width: 20,
                  height: 20,
                  marginLeft: i === 0 ? 0 : -6,
                  borderWidth: 1,
                  borderColor: "white",
                  zIndex: 10 + i,
                  elevation: 10 + i,
                }}
              >
                <Text style={{ fontSize: 11 }}>{emoji}</Text>
              </View>
            ))}
          </View>
        )}

      </View>
    </TouchableOpacity>
    <View className="flex-row items-center mt-2">
      <Image
        source={require("../../assets/images/profile.png")}
        className="w-8 h-8 rounded-full"
      />
      <View className="ml-2">
        <Text className="text-white text-sm">{post.user}</Text>
        <Text className="text-white/50 text-xs">{post.time}</Text>
      </View>
    </View>
  </View>
);


  const renderThumbnail = ({ item }: { item: Post }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedImage(item);
        setShowVideoControls(false); // Reset video controls when selecting new item
      }}
      className={`mx-1 mb-2 ${
        selectedImage?.id === item.id ? "opacity-50" : ""
      }`}
    >
      <Image
        source={item.media}
        style={{
          width: (screenWidth - 40) / 4,
          height: (screenWidth - 40) / 4,
          borderRadius: 12,
        }}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  if (selectedImage) {
    return (
      <View className="flex-1 bg-black pt-10">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          ref={(ref) => {
            if (ref) {
              ref.scrollTo({ y: 0, animated: false });
            }
          }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 pb-4">
            <TouchableOpacity
              onPress={() => {
                // Stop video when going back
                if (videoRef.current && selectedImage?.mediaType === "video") {
                  videoRef.current.pauseAsync();
                }
                setSelectedImage(null);
                setShowVideoControls(false);
              }}
              className="p-2"
            >
              <ArrowLeftCircle size={24} strokeWidth={1} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-lg font-semibold">
              {selectedImage.user}'s Post
            </Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Main Image */}
          <View className="px-2">
            <TouchableOpacity activeOpacity={0.9} onPress={openFullScreen}>
              <View className="relative">
                {selectedImage.mediaType === "image" ? (
                  <Image
                    source={selectedImage.media}
                    style={{
                      width: screenWidth - 16,
                      height: undefined,
                      aspectRatio:
                        Image.resolveAssetSource(selectedImage.media).width /
                        Image.resolveAssetSource(selectedImage.media).height,
                      borderRadius: 24,
                    }}
                    resizeMode="contain"
                  />
                ) : (
                  <View
                    style={{
                      width: screenWidth - 16,
                      aspectRatio: videoDimensions[selectedImage.id]
                        ? videoDimensions[selectedImage.id].width /
                          videoDimensions[selectedImage.id].height
                        : 16 / 9,
                      borderRadius: 24,
                      overflow: "hidden",
                      backgroundColor: "#000",
                    }}
                  >
                    <Video
                      ref={videoRef}
                      source={selectedImage.media as any}
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                      resizeMode={ResizeMode.COVER}
                      isMuted={true}
                      shouldPlay={true}
                      isLooping={true}
                      volume={0}
                      useNativeControls={showVideoControls}
                      onLoad={async (status) => {
                        console.log("Video loaded successfully");
                        try {
                          if (videoRef.current) {
                            await videoRef.current.playAsync();
                          }
                        } catch (error) {
                          console.log("Error auto-playing video:", error);
                        }
                      }}
                      onReadyForDisplay={(event) => {
                        const { width, height } = event.naturalSize;
                        setVideoDimensions((prev) => ({
                          ...prev,
                          [selectedImage.id]: { width, height },
                        }));
                      }}
                      onError={(error) => {
                        console.log("Video loading error:", error);
                      }}
                      onLoadStart={() => {
                        console.log(
                          "Video loading started for",
                          selectedImage.id
                        );
                      }}
                    />
                    {!showVideoControls && (
                      <TouchableOpacity
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: "transparent",
                        }}
                        onPress={() => {
                          setShowVideoControls(true);
                          if (videoRef.current) {
                            videoRef.current.setIsMutedAsync(false);
                            videoRef.current.setVolumeAsync(1);
                          }
                          if (videoControlsTimeoutRef.current) {
                            clearTimeout(videoControlsTimeoutRef.current);
                          }
                          videoControlsTimeoutRef.current = setTimeout(() => {
                            setShowVideoControls(false);
                            if (videoRef.current) {
                              videoRef.current.setIsMutedAsync(true);
                              videoRef.current.setVolumeAsync(0);
                            }
                          }, 5000);
                        }}
                        activeOpacity={1}
                      />
                    )}
                  </View>
                )}

                {/* Emoji Overlay */}
             {postEmojis[selectedImage.id] &&
  postEmojis[selectedImage.id].length > 0 && (
    <View
      className="absolute bottom-4 right-4 flex-row"
      style={{ height: 20 }} // Set fixed height for emoji size consistency
    >
      {postEmojis[selectedImage.id].map((emoji, i) => (
        <View
          key={emoji}
          className="bg-white rounded-full justify-center items-center"
          style={{
            width: 20,
            height: 20,
            marginLeft: i === 0 ? 0 : -6, 
            borderWidth: 1,
            borderColor: "white", 
            zIndex: 10 + i, 
            elevation: 10 + i,
          }}
        >
          <Text style={{ fontSize: 11 }}>{emoji}</Text>
        </View>
      ))}
    </View>
)}

              </View>
            </TouchableOpacity>
          </View>

          {/* Full Screen Modal */}
          <Modal
            visible={showFullScreen}
            transparent={true}
            animationType="none"
            onRequestClose={closeFullScreen}
          >
            <Animated.View
              className="flex-1 bg-black"
              style={{
                opacity: animatedOpacity,
              }}
            >
              <TouchableOpacity
                className="absolute top-16 right-4 z-10 p-4"
                onPress={closeFullScreen}
              >
                <Text className="text-white text-xl">✕</Text>
              </TouchableOpacity>
              <Animated.View
                style={{
                  flex: 1,
                  transform: [
                    {
                      scale: animatedScale.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1],
                      }),
                    },
                  ],
                }}
                className="justify-center items-center"
              >
                {selectedImage.mediaType === "image" ? (
                  <Image
                    source={selectedImage.media}
                    style={{
                      width: screenWidth,
                      height: screenHeight,
                    }}
                    resizeMode="contain"
                  />
                ) : (
                  <Video
                    source={selectedImage.media as any}
                    style={{
                      width: screenWidth,
                      height: screenHeight,
                    }}
                    resizeMode={ResizeMode.CONTAIN}
                    useNativeControls
                    shouldPlay={true}
                    onError={(error) => {
                      console.log("Full screen video error:", error);
                    }}
                    onLoadStart={() => {
                      console.log("Full screen video loading started");
                    }}
                  />
                )}
              </Animated.View>
            </Animated.View>
          </Modal>

          {/* User Info */}
          <View className="flex-row items-center px-4 py-4">
            <Image
              source={require("../../assets/images/profile.png")}
              className="w-12 h-12 rounded-full"
            />
            <View className="ml-3 relative">
              <Text className="text-white text-base font-semibold">
                {selectedImage.user}
              </Text>
              <Text className="text-white/50 text-sm">
                {selectedImage.time}
              </Text>

              <TouchableOpacity
                onPress={() => setShowEmojiPopup(!showEmojiPopup)}
                className="mt-1"
              >
                <Heart color="white" size={18} />
              </TouchableOpacity>

              {showEmojiPopup && (
                <View className="absolute bottom-full mb-2 flex-row bg-white rounded-full py-1 px-1 shadow-lg">
                  {["❤️", "👍", "🔥"].map((emoji) => (
                    <TouchableOpacity
                      key={emoji}
                      onPress={() => {
                        console.log("Selected emoji:", emoji);
                        setShowEmojiPopup(false);

                        setPostEmojis((prev) => {
                          const emojis = prev[selectedImage.id] || [];
                          if (emojis.includes(emoji)) {
                            // Already chosen; skip adding duplicate
                            return prev;
                          }
                          return {
                            ...prev,
                            [selectedImage.id]: [...emojis, emoji],
                          };
                        });
                      }}
                      className="mx-2"
                    >
                      <Text className="text-2xl">{emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* More to explore */}
          <View className="px-2 mt-4">
            <Text className="text-white text-base font-semibold px-2 mb-3">
              More to explore
            </Text>
            <View className="flex-row justify-between">
              <View className="w-[49%]">
                {posts
                  .filter(
                    (post) => post.id % 2 === 0 && post.id !== selectedImage.id
                  )
                  .map((post) => (
                    <TouchableOpacity
                      key={post.id}
                      onPress={() => {
                        setSelectedImage(post);
                        setShowVideoControls(false);
                      }}
                      className="mb-4"
                    >
                      {post.mediaType === "image" ? (
                        <Image
                          source={post.media}
                          style={{
                            width: "100%",
                            height: imageHeights[post.id] || 200,
                            borderRadius: 16,
                          }}
                          resizeMode="cover"
                        />
                      ) : (
                        <View
                          style={{
                            width: "100%",
                            aspectRatio: videoDimensions?.[post.id]
                              ? videoDimensions[post.id].width /
                                videoDimensions[post.id].height
                              : 16 / 9,
                            borderRadius: 16,
                            backgroundColor: "#000",
                            overflow: "hidden",
                          }}
                        >
                          <Video
                            source={post.media as any}
                            style={{
                              width: "100%",
                              height: "100%",
                            }}
                            resizeMode={ResizeMode.COVER}
                            isMuted={true}
                            shouldPlay={true}
                            isLooping={true}
                            volume={0}
                            onReadyForDisplay={(event) => {
                              const { width, height } = event.naturalSize;
                              setVideoDimensions((prev) => ({
                                ...prev,
                                [post.id]: { width, height },
                              }));
                            }}
                          />
                        </View>
                      )}
                      <View className="flex-row items-center mt-2">
                        <Image
                          source={require("../../assets/images/profile.png")}
                          className="w-8 h-8 rounded-full"
                        />
                        <View className="ml-2">
                          <Text className="text-white text-sm">
                            {post.user}
                          </Text>
                          <Text className="text-white/50 text-xs">
                            {post.time}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
              </View>
              <View className="w-[49%]">
                {posts
                  .filter(
                    (post) => post.id % 2 !== 0 && post.id !== selectedImage.id
                  )
                  .map((post) => (
                    <TouchableOpacity
                      key={post.id}
                      onPress={() => {
                        setSelectedImage(post);
                        setShowVideoControls(false);
                      }}
                      className="mb-4"
                    >
                      {post.mediaType === "image" ? (
                        <Image
                          source={post.media}
                          style={{
                            width: "100%",
                            height: imageHeights[post.id] || 200,
                            borderRadius: 16,
                          }}
                          resizeMode="cover"
                        />
                      ) : (
                        <View
                          style={{
                            width: "100%",
                            aspectRatio: videoDimensions?.[post.id]
                              ? videoDimensions[post.id].width /
                                videoDimensions[post.id].height
                              : 16 / 9,
                            borderRadius: 16,
                            backgroundColor: "#000",
                            overflow: "hidden",
                          }}
                        >
                          <Video
                            source={post.media as any}
                            style={{
                              width: "100%",
                              height: "100%",
                            }}
                            resizeMode={ResizeMode.COVER}
                            isMuted={true}
                            shouldPlay={true}
                            isLooping={true}
                            volume={0}
                            onReadyForDisplay={(event) => {
                              const { width, height } = event.naturalSize;
                              setVideoDimensions((prev) => ({
                                ...prev,
                                [post.id]: { width, height },
                              }));
                            }}
                          />
                        </View>
                      )}
                      <View className="flex-row items-center mt-2">
                        <Image
                          source={require("../../assets/images/profile.png")}
                          className="w-8 h-8 rounded-full"
                        />
                        <View className="ml-2">
                          <Text className="text-white text-sm">
                            {post.user}
                          </Text>
                          <Text className="text-white/50 text-xs">
                            {post.time}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-secbg">
      {/* Fixed Header */}
      <SafeAreaView
        className="bg-secbg absolute top-0 left-0 right-0 z-10 border-b border-gray-800"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <View className="px-6 bg-secbg flex flex-row items-center justify-between">
          <Text className="text-white text-3xl font-bold">Social</Text>
        </View>
      </SafeAreaView>

      {/* Scrollable Content */}
      <ScrollView
        className="flex-1 bg-black px-3"
        style={{ marginTop: 120, paddingTop: 8 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row justify-between">
          <View className="w-[49%]">{leftColumn.map(renderPost)}</View>
          <View className="w-[49%]">{rightColumn.map(renderPost)}</View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Social;
