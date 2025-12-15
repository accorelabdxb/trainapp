import type { ServerPost } from "@/store/slices/communityApi";
import React, { useCallback, useMemo } from "react";
import {
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import OptimizedPostCard from "./OptimizedPostCard";

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

interface VirtualizedSocialFeedProps {
  posts: Post[];
  onPostPress: (post: Post) => void;
  imageHeights: { [key: number]: number };
  videoDimensions: { [key: number]: { width: number; height: number } };
  onRefresh?: () => void;
  refreshing?: boolean;
}

const VirtualizedSocialFeed: React.FC<VirtualizedSocialFeedProps> = ({
  posts,
  onPostPress,
  imageHeights,
  videoDimensions,
  onRefresh,
  refreshing = false,
}) => {
  const screenWidth = Dimensions.get("window").width;
  const columnWidth = (screenWidth - 24) / 2;

  // Split posts into two columns
  const { columnLeft, columnRight } = useMemo(() => {
    const left: Post[] = [];
    const right: Post[] = [];
    posts.forEach((post, index) => {
      if (index % 2 === 0) {
        left.push(post);
      } else {
        right.push(post);
      }
    });
    return { columnLeft: left, columnRight: right };
  }, [posts]);

  // Memoized render item for left column
  const renderLeftItem = useCallback(
    ({ item, index }: { item: Post; index: number }) => {
      // Calculate visibility based on index (simple approximation)
      const isVisible = index < 10; // Only first 10 items are "visible"

      return (
        <View style={{ width: columnWidth }}>
          <OptimizedPostCard
            post={item}
            onPress={() => onPostPress(item)}
            imageHeight={imageHeights[item.id] || columnWidth * (3 / 4)}
            videoDimensions={videoDimensions[item.id]}
            isVisible={isVisible}
          />
        </View>
      );
    },
    [columnWidth, imageHeights, videoDimensions, onPostPress]
  );

  // Memoized render item for right column
  const renderRightItem = useCallback(
    ({ item, index }: { item: Post; index: number }) => {
      const isVisible = index < 10;

      return (
        <View style={{ width: columnWidth }}>
          <OptimizedPostCard
            post={item}
            onPress={() => onPostPress(item)}
            imageHeight={imageHeights[item.id] || columnWidth * (3 / 4)}
            videoDimensions={videoDimensions[item.id]}
            isVisible={isVisible}
          />
        </View>
      );
    },
    [columnWidth, imageHeights, videoDimensions, onPostPress]
  );

  // Render both columns side by side
  const renderRow = useCallback(
    ({
      item,
      index,
    }: {
      item: { left: Post | null; right: Post | null };
      index: number;
    }) => {
      return (
        <View style={styles.row}>
          <View style={styles.column}>
            {item.left && renderLeftItem({ item: item.left, index })}
          </View>
          <View style={styles.column}>
            {item.right && renderRightItem({ item: item.right, index })}
          </View>
        </View>
      );
    },
    [renderLeftItem, renderRightItem]
  );

  // Create row data structure
  const rowData = useMemo(() => {
    const rows: { left: Post | null; right: Post | null }[] = [];
    const maxLength = Math.max(columnLeft.length, columnRight.length);

    for (let i = 0; i < maxLength; i++) {
      rows.push({
        left: columnLeft[i] || null,
        right: columnRight[i] || null,
      });
    }

    return rows;
  }, [columnLeft, columnRight]);

  const keyExtractor = useCallback(
    (item: { left: Post | null; right: Post | null }, index: number) => {
      return `row-${index}-${item.left?.id || "empty"}-${
        item.right?.id || "empty"
      }`;
    },
    []
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => {
      // Estimate item height (adjust based on your actual item height)
      const estimatedItemHeight = columnWidth * (3 / 4) + 60; // image + user info
      return {
        length: estimatedItemHeight,
        offset: estimatedItemHeight * index,
        index,
      };
    },
    [columnWidth]
  );

  return (
    <FlatList
      data={rowData}
      renderItem={renderRow}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      numColumns={1}
      initialNumToRender={5}
      maxToRenderPerBatch={3}
      windowSize={10}
      removeClippedSubviews={true}
      updateCellsBatchingPeriod={50}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  column: {
    width: "49%",
  },
  contentContainer: {
    paddingTop: 8,
    paddingBottom: 20,
  },
});

export default VirtualizedSocialFeed;
