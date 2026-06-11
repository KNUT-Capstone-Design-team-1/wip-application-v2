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
import { getPillDatasByItemSeq } from '@services/database/queries/pill_data';
import NotItem from '@components/common/NotItem';
import { px } from '@utils/responsive';

/**
 * 저장된 데이터가 없을 때 표시할 화면
 */
const EmptyBox = () => (
  <NotItem
    mainText={'보관된 알약이 없습니다.'}
    subText={'북마크 아이콘을 누르면 보관함에 저장돼요!'}
    marginTop={'60%'}
  />
);

const PillSaveList = ({ pillSaveData, onDataChange }: IPillSaveListProps) => {
  /**
   * 상세 페이지로 이동
   */
  const handlePressDetail = useCallback(
    async (itemSeq: string, itemImage: string) => {
      const result = await getPillDatasByItemSeq([itemSeq]);
      if (result.length > 0) {
        router.push({
          pathname: '/pill-search-result-detail',
          params: {
            itemDetail: JSON.stringify(result[0]),
            itemImage: itemImage,
          },
        });
      }
    },
    [],
  );

  /**
   * 리스트 아이템 렌더링
   */
  const renderItem: ListRenderItem<IPillSaveData> = useCallback(
    ({ item }) => {
      if (item.ITEM_SEQ === 'EMPTY_ITEM') {
        return <View style={{ flex: 1, padding: px(6) }} />;
      }

      return (
        <View style={{ flex: 1, padding: px(6) }}>
          <PillSaveContent
            saveData={item}
            onPressDetail={() =>
              handlePressDetail(item.ITEM_SEQ, item.ITEM_IMAGE)
            }
            onPressDelete={() => onDataChange?.(item.ITEM_SEQ)}
          />
        </View>
      );
    },
    [handlePressDetail, onDataChange],
  );

  if (pillSaveData.length === 0) {
    return <EmptyBox />;
  }

  // 2열 정렬을 맞추기 위해 홀수일 경우 빈 아이템 추가
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
