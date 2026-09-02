import React, { memo, useCallback } from 'react';
import { View } from 'react-native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { router } from 'expo-router';
import PillSaveContent from '@features/pill_save/components/molecules/PillSaveContent';
import {
  IPillSaveData,
  IPillSaveListProps,
} from '@features/pill_save/types/pill_save_type';
import { styles } from '@features/pill_save/styles/organisms/PillSaveList';
import NotItem from '@components/common/NotItem';
import { useAppTrackStore } from '@store/app_track_store';

// 저장된 데이터가 없을 때 표시할 화면
const EmptyBox = memo(() => (
  <NotItem
    mainText={'보관된 알약이 없습니다.'}
    subText={'북마크 아이콘을 누르면 보관함에 저장돼요!'}
    marginTop={'40%'}
  />
));

EmptyBox.displayName = 'EmptyBox';

// 보관함 알약 목록 FlashList 컴포넌트
const PillSaveList = ({
  pillSaveData,
  onDataChange,
  isEditing,
  selectedSeqs,
  onItemSelect,
  onLongPressItem,
  remindedItemSeqs,
  onPressReminder,
}: IPillSaveListProps) => {
  // 상세 페이지로 이동
  const handlePressDetail = useCallback(
    (itemSeq: string, itemImage: string) => {
      useAppTrackStore.getState().increaseSubActionCount('save_pill');

      router.push({
        pathname: '/pill-search-result-detail',
        params: { ITEM_SEQ: itemSeq, itemImage: itemImage },
      });
    },
    [],
  );

  // 리스트 아이템 렌더링
  const renderItem: ListRenderItem<IPillSaveData> = useCallback(
    ({ item }) => {
      const isEmptyItem = item.ITEM_SEQ === 'EMPTY_ITEM';

      if (isEmptyItem) {
        return <View style={styles.emptyContainer} />;
      }

      const hasReminder = Boolean(remindedItemSeqs?.includes(item.ITEM_SEQ));

      return (
        <View style={styles.emptyContainer}>
          <PillSaveContent
            saveData={item}
            onPressDetail={() => {
              if (isEditing) {
                onItemSelect?.(item.ITEM_SEQ);
              } else {
                handlePressDetail(item.ITEM_SEQ, item.ITEM_IMAGE);
              }
            }}
            onPressDelete={() => onDataChange?.(item.ITEM_SEQ)}
            onLongPress={() => onLongPressItem?.(item.ITEM_SEQ)}
            isEditing={isEditing}
            isSelected={selectedSeqs?.includes(item.ITEM_SEQ)}
            onSelect={() => onItemSelect?.(item.ITEM_SEQ)}
            hasReminder={hasReminder}
            onPressReminder={() =>
              onPressReminder?.(item.ITEM_SEQ, item.ITEM_NAME)
            }
          />
        </View>
      );
    },
    [
      handlePressDetail,
      onDataChange,
      isEditing,
      selectedSeqs,
      onItemSelect,
      onLongPressItem,
      remindedItemSeqs,
      onPressReminder,
    ],
  );

  const hasNoData = pillSaveData.length === 0;

  if (hasNoData) {
    return <EmptyBox />;
  }

  // 2열 그리드 정렬 보정을 위해 홀수 개수일 때 더미 아이템 추가
  const isOddCount = pillSaveData.length % 2 !== 0;
  const formattedData = isOddCount
    ? [...pillSaveData, { ITEM_SEQ: 'EMPTY_ITEM' } as IPillSaveData]
    : pillSaveData;

  return (
    <FlashList
      style={styles.pillSaveListWrapper}
      contentContainerStyle={styles.pillSaveListContent}
      data={formattedData}
      renderItem={renderItem}
      keyExtractor={(item) => item.ITEM_SEQ}
      numColumns={2}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default memo(PillSaveList);
