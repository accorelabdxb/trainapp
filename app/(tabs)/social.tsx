import { BASE_FILE_URL, communityAPI } from "@/utils/api";
import { ResizeMode, Video } from "expo-av";
import { ArrowLeftCircle, Heart } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Post = {
  id: number;
  fileFullpath: string;
  fileName: string;
  mediaType: "image" | "video";
  creatorName: string;
  createdAt: string;
  likeCount: number;
  isLiked: boolean; // Add this to track the user's like status
};

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
  const videoControlsTimeoutRef = useRef<NodeJS.Timeout | number | null>(null);
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const animatedScale = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const [showEmojiPopup, setShowEmojiPopup] = useState(false);
  const [postReaction, setPostReaction] = useState<{ [key: number]: string }>(
    {}
  );
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Calculate image heights based on actual image dimensions
  const calculateImageHeight = async (uri: string, postId: number) => {
    return new Promise<void>((resolve) => {
      Image.getSize(
        uri,
        (width, height) => {
          const ratio = height / width;
          const columnWidth = 180;
          const calculatedHeight = ratio * columnWidth;

          setImageHeights((prev) => ({
            ...prev,
            [postId]: Math.max(calculatedHeight, 150), // Minimum height of 150
          }));
          resolve();
        },
        (error) => {
          console.log("Error getting image size:", error);
          // Set default height if image size calculation fails
          setImageHeights((prev) => ({
            ...prev,
            [postId]: 200,
          }));
          resolve();
        }
      );
    });
  };

  // Load image dimensions for posts
  useEffect(() => {
    if (posts.length > 0) {
      posts.forEach(async (post) => {
        const fullUrl = `${BASE_FILE_URL}${post.fileFullpath}`;

        if (post.mediaType === "image") {
          await calculateImageHeight(fullUrl, post.id);
        } else {
          // For videos, set a default aspect ratio
          const width = 180;
          const height = width * (9 / 16); // Default to 9:16 aspect ratio

          setImageHeights((prev) => ({
            ...prev,
            [post.id]: height,
          }));

          setVideoDimensions((prev) => ({
            ...prev,
            [post.id]: { width: 16, height: 9 },
          }));
        }
      });
    }
  }, [posts]);

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
      const timeout = setTimeout(playVideo, 100);
      return () => clearTimeout(timeout);
    }
  }, [selectedImage]);

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const apiPosts = await communityAPI.getAllPosts();

        // Format posts and determine media type from filename
        const formattedPosts: Post[] = apiPosts.map((post: any) => ({
          id: post.id,
          fileFullpath: post.fileFullpath,
          fileName: post.fileName,
          mediaType: post.fileName?.toLowerCase().endsWith(".mp4")
            ? "video"
            : "image",
          creatorName: post.creatorName || "Unknown",
          createdAt: post.createdAt || "Unknown time",
          likeCount: post.likeCount || 0,
          isLiked: false, // Assume not liked initially
        }));

        setPosts(formattedPosts);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError("Could not load the feed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Format time display
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
      );

      if (diffInMinutes < 1) return "Just now";
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    } catch {
      return dateString;
    }
  };
  const handleLikeToggle = async (postToUpdate: Post, reaction: string) => {
    const originalPosts = [...posts];
    const isCurrentlyLiked = postToUpdate.isLiked;

    // Optimistic UI Update
    const updatedPosts = posts.map((p) => {
      if (p.id === postToUpdate.id) {
        return {
          ...p,
          isLiked: !isCurrentlyLiked,
          likeCount: isCurrentlyLiked ? p.likeCount - 1 : p.likeCount + 1,
        };
      }
      return p;
    });
    setPosts(updatedPosts);

    // Also update the reaction emoji state
    setPostReaction((prev) => {
      const newReactions = { ...prev };
      if (!isCurrentlyLiked) {
        newReactions[postToUpdate.id] = reaction; // Set reaction on like
      } else {
        delete newReactions[postToUpdate.id]; // Remove reaction on unlike
      }
      return newReactions;
    });

    // API Call
    try {
      if (isCurrentlyLiked) {
        await communityAPI.unlikePost(postToUpdate.id);
      } else {
        await communityAPI.likePost(postToUpdate.id);
      }
    } catch (error) {
      console.error("Failed to update like status:", error);
      // If API call fails, revert the state
      setPosts(originalPosts);
      alert("Could not update your reaction. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#FFF" />
        <Text className="text-white mt-4">Loading posts...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-black justify-center items-center px-4">
        <Text className="text-white text-lg text-center mb-4">{error}</Text>
        <TouchableOpacity
          onPress={() => {
            setError(null);
            setIsLoading(true);
            // Trigger re-fetch
            const fetchPosts = async () => {
              try {
                const apiPosts = await communityAPI.getAllPosts();
                const formattedPosts: Post[] = apiPosts.map((post: any) => ({
                  id: post.id,
                  fileFullpath: post.fileFullpath,
                  fileName: post.fileName,
                  mediaType: post.fileName?.toLowerCase().endsWith(".mp4")
                    ? "video"
                    : "image",
                  creatorName: post.creatorName || "Unknown",
                  createdAt: post.createdAt || "Unknown time",
                  likeCount: post.likeCount || 0,
                }));
                setPosts(formattedPosts);
              } catch (err) {
                setError("Could not load the feed. Please try again.");
              } finally {
                setIsLoading(false);
              }
            };
            fetchPosts();
          }}
          className="bg-blue-600 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-white text-lg">No posts available</Text>
      </View>
    );
  }

  const leftColumn: Post[] = [];
  const rightColumn: Post[] = [];

  // Distribute posts into left and right columns for balance
  posts.forEach((post, index) => {
    (index % 2 === 0 ? leftColumn : rightColumn).push(post);
  });

  const renderPost = (post: Post) => {
    const fullUrl = `${BASE_FILE_URL}${post.fileFullpath}`;

    return (
      <View key={post.id} className="mb-4">
        <TouchableOpacity
          onPress={() => {
            setSelectedImage(post);
            setShowVideoControls(false);
          }}
          activeOpacity={0.9}
        >
          <View className="relative">
            {post.mediaType === "image" ? (
              <Image
                source={{ uri: fullUrl }}
                style={{
                  width: "100%",
                  height: imageHeights[post.id] || 200,
                  borderRadius: 16,
                }}
                resizeMode="cover"
                onError={(error) => {
                  console.log("Image loading error:", error);
                }}
              />
            ) : (
              <View
                style={{
                  width: "100%",
                  aspectRatio: videoDimensions[post.id]
                    ? videoDimensions[post.id].width /
                      videoDimensions[post.id].height
                    : 16 / 9,
                  borderRadius: 16,
                  backgroundColor: "#000",
                  overflow: "hidden",
                }}
              >
                <Video
                  source={{ uri: fullUrl }}
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
                  onError={(error) => {
                    console.log("Video loading error:", error);
                  }}
                />
              </View>
            )}

            {/* Emoji Overlay on each post */}
            {/* Generic Like Overlay on each post */}
            {post.likeCount > 0 && (
              <View
                className="absolute bottom-2 right-2 flex-row bg-white rounded-full justify-center items-center"
                style={{
                  width: 20,
                  height: 20,
                  borderWidth: 1,
                  borderColor: "white",
                }}
              >
                <Text style={{ fontSize: 11 }}>❤️</Text>
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
            <Text className="text-white text-sm">{post.creatorName}</Text>
            <Text className="text-white/50 text-xs">
              {formatTime(post.createdAt)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (selectedImage) {
    const fullSelectedUrl = `${BASE_FILE_URL}${selectedImage.fileFullpath}`;
    const currentPost =
      posts.find((p) => p.id === selectedImage.id) || selectedImage;

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
                if (videoRef.current && selectedImage.mediaType === "video") {
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
              {selectedImage.creatorName}'s Post
            </Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Main Media */}
          <View className="px-2">
            <TouchableOpacity activeOpacity={0.9} onPress={openFullScreen}>
              <View className="relative">
                {selectedImage.mediaType === "image" ? (
                  <Image
                    source={{ uri: fullSelectedUrl }}
                    style={{
                      width: screenWidth - 16,
                      height: undefined,
                      aspectRatio: 1,
                      borderRadius: 24,
                    }}
                    resizeMode="contain"
                    onError={(error) => {
                      console.log("Selected image loading error:", error);
                    }}
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
                      source={{ uri: fullSelectedUrl }}
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
                      onLoad={async () => {
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
                {/* Generic Like Overlay */}
                {currentPost.likeCount > 0 && (
                  <View
                    className="absolute bottom-4 right-4 flex-row bg-white rounded-full justify-center items-center"
                    style={{
                      width: 20,
                      height: 20,
                      borderWidth: 1,
                      borderColor: "white",
                    }}
                  >
                    <Text style={{ fontSize: 11 }}>❤️</Text>
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
                    source={{ uri: fullSelectedUrl }}
                    style={{
                      width: screenWidth,
                      height: screenHeight,
                    }}
                    resizeMode="contain"
                  />
                ) : (
                  <Video
                    source={{ uri: fullSelectedUrl }}
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
                {selectedImage.creatorName}
              </Text>
              <Text className="text-white/50 text-sm">
                {formatTime(selectedImage.createdAt)}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  if (currentPost.isLiked) {
                    handleLikeToggle(currentPost, "");
                  } else {
                    setShowEmojiPopup(!showEmojiPopup);
                  }
                }}
                className="mt-1"
              >
                {currentPost.isLiked && postReaction[currentPost.id] ? (
                  <Text style={{ fontSize: 24 }}>
                    {postReaction[currentPost.id]}
                  </Text>
                ) : (
                  <Heart color="white" size={18} />
                )}
              </TouchableOpacity>

              {showEmojiPopup && (
                <View className="absolute bottom-full mb-2 flex-row bg-white rounded-full py-1 px-0 shadow-lg">
                  {["❤️", "👍", "🔥"].map((emoji) => (
                    <TouchableOpacity
                      key={emoji}
                    onPress={() => {
  if (currentPost) {
    handleLikeToggle(currentPost, emoji);
  }
  setShowEmojiPopup(false);
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
                  .map((post) => renderPost(post))}
              </View>
              <View className="w-[49%]">
                {posts
                  .filter(
                    (post) => post.id % 2 !== 0 && post.id !== selectedImage.id
                  )
             .map((post) => renderPost(post))}
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
