import React, { memo, useRef, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  ListRenderItem,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { BaseText } from '@components/common/BaseText';
import {
  styles,
  ITEM_HEIGHT,
} from '@features/pill_reminder/styles/atoms/TimePickerColumn';

interface ITimePickerColumnProps {
  label: string;
  data: string[];
  unit: string;
  selectedValue: string;
  onSelect: (value: string) => void;
}

// 개별 피커 항목 렌더러
const PickerItemRow = memo(
  ({
    item,
    unit,
    isSelected,
    onPress,
  }: {
    item: string;
    unit: string;
    isSelected: boolean;
    onPress: () => void;
  }) => {
    return (
      <TouchableOpacity
        style={styles.pickerItem}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <BaseText
          size={16}
          weight={isSelected ? 'bold' : 'medium'}
          style={isSelected ? styles.pickerTextSelected : styles.pickerText}
        >
          {item}
          {unit}
        </BaseText>
      </TouchableOpacity>
    );
  },
);

PickerItemRow.displayName = 'PickerItemRow';

// 시간/분 스크롤 피커 컬럼 컴포넌트
export const TimePickerColumn = memo(
  ({ label, data, unit, selectedValue, onSelect }: ITimePickerColumnProps) => {
    const listRef = useRef<FlatList<string>>(null);
    const isUserScrollingRef = useRef(false);

    const targetIndex = data.indexOf(selectedValue);
    const safeIndex = targetIndex >= 0 ? targetIndex : 0;

    // 선택값이 외부에서 변경되었을 때(예: 직접 입력 또는 초기 마운트) 중앙으로 스크롤 이동
    useEffect(() => {
      if (isUserScrollingRef.current) {
        return;
      }

      if (targetIndex >= 0) {
        const timer = setTimeout(() => {
          listRef.current?.scrollToOffset({
            offset: targetIndex * ITEM_HEIGHT,
            animated: true,
          });
        }, 50);

        return () => clearTimeout(timer);
      }
    }, [targetIndex]);

    const getItemLayout = useCallback(
      (_: unknown, index: number) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      }),
      [],
    );

    // 스크롤이 끝났을 때 중앙 위치의 아이템을 선택값으로 반영
    const handleScrollEnd = useCallback(
      (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        isUserScrollingRef.current = false;
        const offsetY = e.nativeEvent.contentOffset.y;
        const index = Math.round(offsetY / ITEM_HEIGHT);
        const clampedIndex = Math.max(0, Math.min(index, data.length - 1));
        const selected = data[clampedIndex];
        if (selected && selected !== selectedValue) {
          onSelect(selected);
        }
      },
      [data, selectedValue, onSelect],
    );

    const handleScrollBegin = useCallback(() => {
      isUserScrollingRef.current = true;
    }, []);

    const renderItem: ListRenderItem<string> = useCallback(
      ({ item, index }) => {
        const isSelected = item === selectedValue;
        return (
          <PickerItemRow
            item={item}
            unit={unit}
            isSelected={isSelected}
            onPress={() => {
              onSelect(item);
              listRef.current?.scrollToOffset({
                offset: index * ITEM_HEIGHT,
                animated: true,
              });
            }}
          />
        );
      },
      [selectedValue, unit, onSelect],
    );

    const keyExtractor = useCallback((item: string) => item, []);

    return (
      <View style={styles.column}>
        <BaseText size={14} weight="semiBold" style={styles.columnLabel}>
          {label}
        </BaseText>

        <View style={styles.pickerWrapper}>
          {/* 중앙 선택 영역 인디케이터 */}
          <View style={styles.selectionIndicator} />

          <FlatList
            ref={listRef}
            data={data}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            getItemLayout={getItemLayout}
            initialScrollIndex={safeIndex}
            onScrollBeginDrag={handleScrollBegin}
            onMomentumScrollBegin={handleScrollBegin}
            onMomentumScrollEnd={handleScrollEnd}
            onScrollEndDrag={handleScrollEnd}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            style={styles.listContainer}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            initialNumToRender={20}
            maxToRenderPerBatch={15}
            windowSize={7}
            removeClippedSubviews={true}
          />
        </View>
      </View>
    );
  },
);

TimePickerColumn.displayName = 'TimePickerColumn';
