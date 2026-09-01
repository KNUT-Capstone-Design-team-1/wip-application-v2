import { memo, useCallback } from 'react';
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
import { px } from '@utils/responsive';
import { useAppTrackStore } from '@store/app_track_store';

// 저장된 데이터가 없을 때 표시할 화면
const EmptyBox = () => (
  <NotItem
    mainText={'보관된 알약이 없습니다.'}
    subText={'북마크 아이콘을 누르면 보관함에 저장돼요!'}
    marginTop={'40%'}
  />
);

const PillSaveList = ({
  pillSaveData,
  onDataChange,
  isEditing,
  selectedSeqs,
  onItemSelect,
  onLongPressItem,
}: IPillSaveListProps) => {
  /**
   * 상세 페이지로 이동
   */
  const handlePressDetail = useCallback(
    (itemSeq: string, itemImage: string) => {
      // 보관함에 등록한 알약의 상세정보를 확인해야지만 기능을 사용했다고 판단
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
      if (item.ITEM_SEQ === 'EMPTY_ITEM') {
        return <View style={styles.emptyContainer} />;
      }

      return (
        <View style={styles.emptyContainer}>
          <PillSaveContent
            saveData={item}
            onPressDetail={() =>
              isEditing
                ? onItemSelect?.(item.ITEM_SEQ)
                : handlePressDetail(item.ITEM_SEQ, item.ITEM_IMAGE)
            }
            onPressDelete={() => onDataChange?.(item.ITEM_SEQ)}
            onLongPress={() => onLongPressItem?.(item.ITEM_SEQ)}
            isEditing={isEditing}
            isSelected={selectedSeqs?.includes(item.ITEM_SEQ)}
            onSelect={() => onItemSelect?.(item.ITEM_SEQ)}
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
    ],
  );

  if (pillSaveData.length === 0) {
    return <EmptyBox />;
  }

  // 다열 정렬을 맞추기 위해 아이템 개수가 안 맞으면 빈 아이템 추가
  const formattedData =
    pillSaveData.length % 2 !== 0
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
