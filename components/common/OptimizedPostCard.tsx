import { ServerPost } from "@/store/slices/communityApi";
import { BASE_FILE_URL } from "@/utils/api";
import { ResizeMode, Video } from "expo-av";
import { Image } from "expo-image";
import { memo, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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

interface OptimizedPostCardProps {
  post: Post;
  onPress: () => void;
  imageHeight?: number;
  videoDimensions?: { width: number; height: number };
  isVisible: boolean; // For video management
}

const OptimizedPostCard = memo<OptimizedPostCardProps>(
  ({ post, onPress, imageHeight = 200, videoDimensions, isVisible }) => {
    const videoRef = useRef<Video>(null);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);

    // Video management: pause/unload when off-screen
    useEffect(() => {
      if (post.mediaType === "video" && videoRef.current) {
        if (isVisible) {
          // Only play when visible
          videoRef.current.playAsync().catch(() => {});
          setIsVideoLoaded(true);
        } else {
          // Pause and unload when off-screen to save battery
          videoRef.current.pauseAsync().catch(() => {});
          videoRef.current.unloadAsync().catch(() => {});
          setIsVideoLoaded(false);
        }
      }
    }, [isVisible, post.mediaType]);

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

    const mediaUri =
      post.mediaUri ||
      (post.serverPost ? getFileUrl(post.serverPost.fileFullpath) : "");

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
          <View style={styles.mediaContainer}>
            {post.mediaType === "image" ? (
              <Image
                source={{ uri: mediaUri }}
                style={[styles.image, { height: imageHeight }]}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
                placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
                recyclingKey={post.id.toString()}
              />
            ) : (
              <View
                style={[
                  styles.videoContainer,
                  {
                    aspectRatio: videoDimensions
                      ? videoDimensions.width / videoDimensions.height
                      : 16 / 9,
                  },
                ]}
              >
                {isVisible && (
                  <Video
                    ref={videoRef}
                    source={{ uri: mediaUri }}
                    style={styles.video}
                    resizeMode={ResizeMode.COVER}
                    isMuted={true}
                    shouldPlay={isVisible}
                    isLooping={true}
                    volume={0}
                    useNativeControls={false}
                    onReadyForDisplay={() => setIsVideoLoaded(true)}
                  />
                )}
                {!isVideoLoaded && (
                  <View style={styles.videoPlaceholder}>
                    <Text style={styles.placeholderText}>Loading...</Text>
                  </View>
                )}
              </View>
            )}

            {/* Reaction Display */}
            {post.reactionsSummary &&
              (post.reactionsSummary.heart > 0 ||
                post.reactionsSummary.like > 0 ||
                post.reactionsSummary.fire > 0) && (
                <View style={styles.reactionsContainer}>
                  {post.reactionsSummary.heart > 0 && (
                    <Text style={styles.reactionEmoji}>❤️</Text>
                  )}
                  {post.reactionsSummary.like > 0 && (
                    <Text style={styles.reactionEmoji}>👍</Text>
                  )}
                  {post.reactionsSummary.fire > 0 && (
                    <Text style={styles.reactionEmoji}>🔥</Text>
                  )}
                </View>
              )}
          </View>
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <Image
            source={require("../../assets/images/profile.png")}
            style={styles.avatar}
            contentFit="cover"
            cachePolicy="memory-disk"
            recyclingKey="profile-avatar"
          />
          <View style={styles.userDetails}>
            <Text style={styles.username}>{post.user}</Text>
            <Text style={styles.time}>{post.time}</Text>
          </View>
        </View>
      </View>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison for memoization
    return (
      prevProps.post.id === nextProps.post.id &&
      prevProps.post.userReaction === nextProps.post.userReaction &&
      prevProps.post.reactionsSummary?.heart ===
        nextProps.post.reactionsSummary?.heart &&
      prevProps.post.reactionsSummary?.like ===
        nextProps.post.reactionsSummary?.like &&
      prevProps.post.reactionsSummary?.fire ===
        nextProps.post.reactionsSummary?.fire &&
      prevProps.isVisible === nextProps.isVisible &&
      prevProps.imageHeight === nextProps.imageHeight
    );
  }
);

OptimizedPostCard.displayName = "OptimizedPostCard";

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  mediaContainer: {
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    borderRadius: 16,
  },
  videoContainer: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#000",
    overflow: "hidden",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  videoPlaceholder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#fff",
    fontSize: 12,
  },
  reactionsContainer: {
    position: "absolute",
    bottom: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    height: 20,
  },
  reactionEmoji: {
    fontSize: 11,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  userDetails: {
    marginLeft: 8,
  },
  username: {
    color: "#fff",
    fontSize: 14,
  },
  time: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 12,
  },
});

export default OptimizedPostCard;
