import React, { memo, useCallback } from "react";
import { Dimensions, FlatList, ListRenderItem } from "react-native";

interface VirtualizedGridProps<T> {
  data: T[];
  renderItem: ListRenderItem<T>;
  numColumns?: number;
  keyExtractor: (item: T, index: number) => string;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  showsVerticalScrollIndicator?: boolean;
  contentContainerStyle?: any;
}

const { width: screenWidth } = Dimensions.get("window");

export const VirtualizedGrid = memo(
  <T,>({
    data,
    renderItem,
    numColumns = 2,
    keyExtractor,
    onEndReached,
    onEndReachedThreshold = 0.5,
    showsVerticalScrollIndicator = false,
    contentContainerStyle,
  }: VirtualizedGridProps<T>) => {
    const getItemLayout = useCallback(
      (data: any, index: number) => {
        const itemHeight = 200; // Approximate item height
        return {
          length: itemHeight,
          offset: itemHeight * Math.floor(index / numColumns),
          index,
        };
      },
      [numColumns]
    );

    return (
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={numColumns}
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        contentContainerStyle={contentContainerStyle}
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={6}
        updateCellsBatchingPeriod={50}
      />
    );
  }
) as <T>(props: VirtualizedGridProps<T>) => JSX.Element;
