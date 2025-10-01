import React, { useEffect, useRef, useState } from "react";
import { ResizeMode, Video } from "expo-av";
import { ArrowLeftCircle, Heart, ExternalLink } from "lucide-react-native";
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BASE_FILE_URL, communityAPI } from "@/utils/api";

type ServerPost = {
  id: number;
  userId: number;
  content: string;
  fileFullpath: string;
  fileType: string;
  fileName: string;
  imageUploadedAt?: string;
  createdAt?: string;
  timeAgo?: string;
  creatorName?: string;
  reactionsSummary?: { heart: number; like: number; fire: number };
  userReaction?: "heart" | "like" | "fire" | null;
};

type Post = {
  id: number;
  mediaUri: string;
  mediaType: "image" | "video";
  user: string;
  time: string;
  content?: string;
  fileType?: string;
  serverPost?: ServerPost;
  reactionsSummary?: { heart: number; like: number; fire: number };
  userReaction?: "heart" | "like" | "fire" | null;
};

const ReactionDisplay = ({
  reactionsSummary,
}: {
  reactionsSummary: Post["reactionsSummary"];
}) => {
  if (
    !reactionsSummary ||
    (reactionsSummary.heart === 0 &&
      reactionsSummary.like === 0 &&
      reactionsSummary.fire === 0)
  ) {
    return null;
  }

  return (
    <View
      className="absolute bottom-2 right-2 flex-row items-center bg-black/50 rounded-full px-1.5 py-0.5"
      style={{ height: 20 }}
    >
      {reactionsSummary.heart > 0 && <Text style={{ fontSize: 11 }}>❤️</Text>}
      {reactionsSummary.like > 0 && <Text style={{ fontSize: 11 }}>👍</Text>}
      {reactionsSummary.fire > 0 && <Text style={{ fontSize: 11 }}>🔥</Text>}
    </View>
  );
};

const Social = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [imageHeights, setImageHeights] = useState<{ [key: number]: number }>(
    {}
  );
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [videoDimensions, setVideoDimensions] = useState<{
    [key: number]: { width: number; height: number };
  }>({});
  const [showVideoControls, setShowVideoControls] = useState(false);
  const videoControlsTimeoutRef = useRef<number | null>(null);
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const animatedScale = React.useRef(new Animated.Value(0)).current;
  const animatedOpacity = React.useRef(new Animated.Value(0)).current;
  const [showEmojiPopup, setShowEmojiPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const videoRef = useRef<Video>(null);

  // --- SCROLL FIX 1: Create a ref for the ScrollView ---
  const scrollViewRef = useRef<ScrollView>(null);

  const getFileUrl = (fileFullpath: string) => {
    if (!fileFullpath) return "";
    return (
      BASE_FILE_URL +
      fileFullpath
        .split("/")
        .map((seg) => encodeURIComponent(seg))
        .join("/")
    );
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await communityAPI.getAllPosts();
      const mapped: Post[] = (res || []).map((p: ServerPost) => {
        const isVideo = p.fileType?.toLowerCase().includes("video");
        return {
          id: p.id,
          mediaUri: getFileUrl(p.fileFullpath),
          mediaType: isVideo ? "video" : "image",
          user: p.creatorName || "Unknown",
          time: p.timeAgo || "",
          content: p.content,
          fileType: p.fileType,
          serverPost: p,
          reactionsSummary: p.reactionsSummary,
          userReaction: p.userReaction,
        };
      });

      setPosts(mapped);

      const columnWidth = (screenWidth - 24) / 2;

      mapped.forEach((post) => {
        if (post.mediaType === "image" && post.mediaUri) {
          Image.getSize(
            post.mediaUri,
            (width, height) => {
              const ratio = height / width;
              setImageHeights((prev) => ({
                ...prev,
                [post.id]: ratio * columnWidth,
              }));
            },
            (err) => {
              setImageHeights((prev) => ({
                ...prev,
                [post.id]: columnWidth * (3 / 4),
              }));
            }
          );
        } else {
          setImageHeights((prev) => ({
            ...prev,
            [post.id]: columnWidth * (9 / 16),
          }));
          setVideoDimensions((prev) => ({
            ...prev,
            [post.id]: { width: 16, height: 9 },
          }));
        }
      });
    } catch (error) {
      console.error("Error fetching community posts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleReact = async (
    postId: number,
    reactionName: "heart" | "like" | "fire"
  ) => {
    const reactionTypeMap = { heart: 1, like: 2, fire: 3 };
    const reactionType = reactionTypeMap[reactionName];

    const originalPosts = [...posts];
    const postIndex = originalPosts.findIndex((p) => p.id === postId);
    if (postIndex === -1) return;

    const postToUpdate = { ...originalPosts[postIndex] };
    const currentReaction = postToUpdate.userReaction;

    const newSummary = {
      heart: 0,
      like: 0,
      fire: 0,
      ...postToUpdate.reactionsSummary,
    };

    if (currentReaction === reactionName) {
      postToUpdate.userReaction = null;
      newSummary[reactionName] = Math.max(0, newSummary[reactionName] - 1);
    } else {
      if (currentReaction) {
        newSummary[currentReaction] = Math.max(
          0,
          newSummary[currentReaction] - 1
        );
      }
      postToUpdate.userReaction = reactionName;
      newSummary[reactionName] = newSummary[reactionName] + 1;
    }

    postToUpdate.reactionsSummary = newSummary;

    const newPosts = [...originalPosts];
    newPosts[postIndex] = postToUpdate;

    setPosts(newPosts);

    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(postToUpdate);
    }

    try {
      if (postToUpdate.userReaction === null) {
        await communityAPI.removeReaction(postId);
      } else {
        await communityAPI.addOrUpdateReaction(postId, reactionType);
      }
    } catch (error) {
      console.error("Failed to update reaction:", error);
      setPosts(originalPosts);
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(originalPosts[postIndex]);
      }
    }
  };

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

  const handleSelectPost = async (post: Post) => {
    setShowVideoControls(false);

    try {
      if ((communityAPI as any).getPostById) {
        const detailed: ServerPost = await (communityAPI as any).getPostById(
          post.id
        );
        const mapped: Post = {
          id: detailed.id,
          mediaUri: getFileUrl(detailed.fileFullpath),
          mediaType: detailed.fileType?.toLowerCase().includes("video")
            ? "video"
            : "image",
          user: detailed.creatorName || post.user,
          time: detailed.timeAgo || post.time,
          content: detailed.content,
          fileType: detailed.fileType,
          serverPost: detailed,
          reactionsSummary: detailed.reactionsSummary,
          userReaction: detailed.userReaction,
        };
        setSelectedPost(mapped);
      } else {
        setSelectedPost(post);
      }

      // --- SCROLL FIX 2: Call the scrollTo method here ---
      scrollViewRef.current?.scrollTo({ y: 0, animated: false }); // Use animated: true for a smooth scroll
    } catch (err) {
      console.warn("Failed to fetch post by id, falling back to local:", err);
      setSelectedPost(post);
      // --- Also scroll to top on fallback ---
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }
  };

  useEffect(() => {
    return () => {
      if (videoControlsTimeoutRef.current) {
        clearTimeout(videoControlsTimeoutRef.current);
      }
    };
  }, [selectedPost]);

  useEffect(() => {
    if (
      selectedPost &&
      selectedPost.mediaType === "video" &&
      videoRef.current
    ) {
      const playVideo = async () => {
        try {
          await videoRef.current?.playAsync();
        } catch (error) {
          console.log("Error starting video:", error);
        }
      };
      setTimeout(playVideo, 100);
    }
  }, [selectedPost]);

  const columnLeft: Post[] = [];
  const columnRight: Post[] = [];
  posts.forEach((p, i) => {
    (i % 2 === 0 ? columnLeft : columnRight).push(p);
  });

  const reactionEmojiMap = {
    heart: "❤️",
    like: "👍",
    fire: "🔥",
  };

  const renderPost = (post: Post) => (
    <View key={post.id} className="mb-4">
      <TouchableOpacity
        onPress={() => handleSelectPost(post)}
        activeOpacity={0.9}
      >
        <View className="relative">
          {post.mediaType === "image" ? (
            <Image
              source={{ uri: post.mediaUri }}
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
                source={{ uri: post.mediaUri }}
                style={{ width: "100%", height: "100%" }}
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

          <ReactionDisplay reactionsSummary={post.reactionsSummary} />
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

  if (selectedPost) {
    return (
      <View className="flex-1 bg-black pt-10">
        <ScrollView
          // --- SCROLL FIX 3: Attach the ref to the ScrollView ---
          ref={scrollViewRef}
          className="flex-1"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchPosts();
              }}
            />
          }
        >
          <View className="flex-row items-center justify-between px-4 pb-4">
            <TouchableOpacity
              onPress={() => {
                if (videoRef.current && selectedPost?.mediaType === "video") {
                  videoRef.current.pauseAsync();
                }
                setSelectedPost(null);
                setShowVideoControls(false);
              }}
              className="p-2"
            >
              <ArrowLeftCircle size={24} strokeWidth={1} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-lg font-semibold">
              {selectedPost.user}'s Post
            </Text>
            <View style={{ width: 40 }} />
          </View>

          <View className="px-2">
            <TouchableOpacity activeOpacity={0.9} onPress={openFullScreen}>
              <View className="relative">
                {selectedPost.mediaType === "image" ? (
                  <Image
                    source={{ uri: selectedPost.mediaUri }}
                    style={{
                      width: screenWidth - 16,
                      height: undefined,
                      aspectRatio: 1,
                      borderRadius: 24,
                    }}
                    resizeMode="contain"
                  />
                ) : (
                  <View
                    style={{
                      width: screenWidth - 16,
                      aspectRatio: videoDimensions[selectedPost.id]
                        ? videoDimensions[selectedPost.id].width /
                          videoDimensions[selectedPost.id].height
                        : 16 / 9,
                      borderRadius: 24,
                      overflow: "hidden",
                      backgroundColor: "#000",
                    }}
                  >
                    <Video
                      ref={videoRef}
                      source={{ uri: selectedPost.mediaUri }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode={ResizeMode.COVER}
                      isMuted={true}
                      shouldPlay={true}
                      isLooping={true}
                      volume={0}
                      useNativeControls={showVideoControls}
                      onLoad={async () => {
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
                          [selectedPost.id]: { width, height },
                        }));
                      }}
                      onError={(error) => {
                        console.log("Video loading error:", error);
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
                <ReactionDisplay
                  reactionsSummary={selectedPost.reactionsSummary}
                />
              </View>
            </TouchableOpacity>
          </View>

          <Modal
            visible={showFullScreen}
            transparent={true}
            animationType="none"
            onRequestClose={closeFullScreen}
          >
            <Animated.View
              className="flex-1 bg-black"
              style={{ opacity: animatedOpacity }}
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
                {selectedPost.mediaType === "image" ? (
                  <Image
                    source={{ uri: selectedPost.mediaUri }}
                    style={{ width: screenWidth, height: screenHeight }}
                    resizeMode="contain"
                  />
                ) : (
                  <Video
                    source={{ uri: selectedPost.mediaUri }}
                    style={{ width: screenWidth, height: screenHeight }}
                    resizeMode={ResizeMode.CONTAIN}
                    useNativeControls
                    shouldPlay
                    onError={(e) => console.log("Full screen video error:", e)}
                  />
                )}
              </Animated.View>
            </Animated.View>
          </Modal>

          <View className="flex-row items-start px-4 py-4">
            <Image
              source={require("../../assets/images/profile.png")}
              className="w-12 h-12 rounded-full"
            />
            <View className="ml-3 flex-1">
              <View className="flex-row justify-between gap-2">
                <Text className="text-white text-base font-semibold">
                  {selectedPost.user}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    /* your action here */
                  }}
                >
                  <ExternalLink size={16} color="white" />
                </TouchableOpacity>
              </View>
              <Text className="text-white/50 text-sm">{selectedPost.time}</Text>
              <Text className="text-white text-sm">{selectedPost.content}</Text>

              <TouchableOpacity
                onPress={() => setShowEmojiPopup(!showEmojiPopup)}
                className="mt-1 p-1"
              >
                {selectedPost.userReaction ? (
                  <Text className="text-xl">
                    {reactionEmojiMap[selectedPost.userReaction]}
                  </Text>
                ) : (
                  <Heart color="white" size={18} />
                )}
              </TouchableOpacity>

              {showEmojiPopup && (
                <View className="absolute bottom-full mb-2 flex-row bg-white rounded-full py-1 px-1 shadow-lg">
                  <TouchableOpacity
                    onPress={() => {
                      handleReact(selectedPost.id, "heart");
                      setShowEmojiPopup(false);
                    }}
                    className="mx-2"
                  >
                    <Text className="text-2xl">❤️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      handleReact(selectedPost.id, "like");
                      setShowEmojiPopup(false);
                    }}
                    className="mx-2"
                  >
                    <Text className="text-2xl">👍</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      handleReact(selectedPost.id, "fire");
                      setShowEmojiPopup(false);
                    }}
                    className="mx-2"
                  >
                    <Text className="text-2xl">🔥</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          <View className="px-2 mt-4">
            <Text className="text-white text-base font-semibold px-2 mb-3">
              More to explore
            </Text>
            <View className="flex-row justify-between">
              <View className="w-[49%]">
                {posts
                  .filter(
                    (post) => post.id % 2 === 0 && post.id !== selectedPost.id
                  )
                  .map((post) => (
                    <TouchableOpacity
                      key={post.id}
                      onPress={() => handleSelectPost(post)}
                      className="mb-4"
                    >
                      <View className="relative">
                        {post.mediaType === "image" ? (
                          <Image
                            source={{ uri: post.mediaUri }}
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
                              source={{ uri: post.mediaUri }}
                              style={{ width: "100%", height: "100%" }}
                              resizeMode={ResizeMode.COVER}
                              isMuted
                              shouldPlay
                              isLooping
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
                        <ReactionDisplay
                          reactionsSummary={post.reactionsSummary}
                        />
                      </View>
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
                    (post) => post.id % 2 !== 0 && post.id !== selectedPost.id
                  )
                  .map((post) => (
                    <TouchableOpacity
                      key={post.id}
                      onPress={() => handleSelectPost(post)}
                      className="mb-4"
                    >
                      <View className="relative">
                        {post.mediaType === "image" ? (
                          <Image
                            source={{ uri: post.mediaUri }}
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
                              source={{ uri: post.mediaUri }}
                              style={{ width: "100%", height: "100%" }}
                              resizeMode={ResizeMode.COVER}
                              isMuted
                              shouldPlay
                              isLooping
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
                        <ReactionDisplay
                          reactionsSummary={post.reactionsSummary}
                        />
                      </View>
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

      {loading && (
        <View
          style={{
            position: "absolute",
            top: 140,
            left: 0,
            right: 0,
            alignItems: "center",
            zIndex: 50,
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      )}

      <ScrollView
        className="flex-1 bg-black px-3"
        style={{ marginTop: 120, paddingTop: 8 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchPosts();
            }}
          />
        }
      >
        <View className="flex-row justify-between">
          <View className="w-[49%]">{columnLeft.map(renderPost)}</View>
          <View className="w-[49%]">{columnRight.map(renderPost)}</View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Social;
