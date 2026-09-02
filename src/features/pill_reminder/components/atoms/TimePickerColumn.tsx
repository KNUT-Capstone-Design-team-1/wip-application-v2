import React, { memo, useRef, useEffect, useCallback, useMemo } from 'react';
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
          size={isSelected ? 18 : 15}
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

// 시간/분 스크롤 피커 컬럼 컴포넌트 (정밀 1:1 칸 스냅 일치)
export const TimePickerColumn = memo(
  ({ label, data, unit, selectedValue, onSelect }: ITimePickerColumnProps) => {
    const listRef = useRef<FlatList<string>>(null);
    const isUserScrollingRef = useRef(false);

    const targetIndex = data.indexOf(selectedValue);
    const safeIndex = targetIndex >= 0 ? targetIndex : 0;

    // 각 아이템별 절대 스냅 오프셋 배열 생성
    const snapOffsets = useMemo(
      () => data.map((_, i) => i * ITEM_HEIGHT),
      [data],
    );

    // 선택값이 외부에서 변경되었을 때(직접 입력, 모달 초기 오픈 등) 정확한 오프셋으로 이동
    useEffect(() => {
      const isUserScrolling = isUserScrollingRef.current;

      if (isUserScrolling) {
        return;
      }

      const isValidIndex = targetIndex >= 0;

      if (isValidIndex) {
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

    // 스크롤 멈춤 시 가장 가까운 인덱스 계산 및 정확한 중앙 칸 배치
    const syncScrollIndex = useCallback(
      (offsetY: number) => {
        isUserScrollingRef.current = false;
        const index = Math.round(offsetY / ITEM_HEIGHT);
        const clampedIndex = Math.max(0, Math.min(index, data.length - 1));
        const selected = data[clampedIndex];

        const hasSelected = Boolean(selected);

        if (hasSelected && selected) {
          if (selected !== selectedValue) {
            onSelect(selected);
          }

          // 선택 칸과 100% 일치하도록 보정
          listRef.current?.scrollToOffset({
            offset: clampedIndex * ITEM_HEIGHT,
            animated: true,
          });
        }
      },
      [data, selectedValue, onSelect],
    );

    const handleScrollBegin = useCallback(() => {
      isUserScrollingRef.current = true;
    }, []);

    const handleScrollEnd = useCallback(
      (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        syncScrollIndex(e.nativeEvent.contentOffset.y);
      },
      [syncScrollIndex],
    );

    const handleItemPress = useCallback(
      (item: string, index: number) => {
        isUserScrollingRef.current = false;
        onSelect(item);
        listRef.current?.scrollToOffset({
          offset: index * ITEM_HEIGHT,
          animated: true,
        });
      },
      [onSelect],
    );

    const renderItem: ListRenderItem<string> = useCallback(
      ({ item, index }) => {
        const isSelected = item === selectedValue;
        return (
          <PickerItemRow
            item={item}
            unit={unit}
            isSelected={isSelected}
            onPress={() => handleItemPress(item, index)}
          />
        );
      },
      [selectedValue, unit, handleItemPress],
    );

    const keyExtractor = useCallback((item: string) => item, []);

    return (
      <View style={styles.column}>
        <BaseText size={14} weight="semiBold" style={styles.columnLabel}>
          {label}
        </BaseText>

        <View style={styles.pickerWrapper}>
          {/* 중앙 선택 영역 인디케이터 (숫자와 100% 동일 높이 및 위치) */}
          <View style={styles.selectionIndicator} pointerEvents="none" />

          <FlatList
            ref={listRef}
            data={data}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            getItemLayout={getItemLayout}
            initialScrollIndex={safeIndex}
            onScrollBeginDrag={handleScrollBegin}
            onMomentumScrollBegin={handleScrollBegin}
            onScrollEndDrag={handleScrollEnd}
            onMomentumScrollEnd={handleScrollEnd}
            snapToOffsets={snapOffsets}
            snapToAlignment="start"
            disableIntervalMomentum={true}
            decelerationRate="fast"
            bounces={false}
            overScrollMode="never"
            style={styles.listContainer}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            initialNumToRender={24}
            maxToRenderPerBatch={24}
            windowSize={11}
            removeClippedSubviews={false}
          />
        </View>
      </View>
    );
  },
);

TimePickerColumn.displayName = 'TimePickerColumn';
