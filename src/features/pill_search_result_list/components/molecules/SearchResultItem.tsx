import { memo } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from '@features/pill_search_result_list/styles/molecules/SearchResultItem';
import { IResultItemProps } from '@features/pill_search_result_list/types/pill_search_result_list';
import { IPillData } from '@services/database/types';

/**
 * 알약 썸네일 이미지 컴포넌트
 */
const PillThumbnail = ({ imageUri }: { imageUri: string }) => (
  <View style={styles.searchItemImage}>
    {imageUri ? (
      <Image
        source={{ uri: imageUri }}
        style={{ width: '100%', height: '100%' }}
        resizeMode="contain"
      />
    ) : (
      <View style={styles.fallbackImageContainer}>
        <Text style={styles.fallbackImageText}>이미지 없음</Text>
      </View>
    )}
  </View>
);

/**
 * 알약 상세 정보 텍스트 컴포넌트
 */
const PillInfo = ({ pill }: { pill: IPillData }) => (
  <View style={styles.searchItemContents}>
    <Text style={styles.searchItemTitle} numberOfLines={1}>
      {pill.ITEM_NAME}
    </Text>
    <Text style={styles.searchItemEntpName} numberOfLines={1}>
      {pill.ENTP_NAME}
    </Text>

    <View style={styles.infoFooter}>
      <Text style={styles.searchItemEtcOtcCode}>{pill.ETC_OTC_CODE}</Text>
      <View style={styles.infoSeparator} />
      <Text style={styles.searchItemPrintFront}>
        식별표기: {pill.PRINT_FRONT || '없음'}
      </Text>
    </View>
  </View>
);

const SearchResultItem = ({
  resultItem,
  itemClickHandler,
}: IResultItemProps) => {
  return (
    <TouchableOpacity
      style={styles.searchItemWrapper}
      onPress={() =>
        itemClickHandler(resultItem.ITEM_SEQ, resultItem.ITEM_IMAGE)
      }
      activeOpacity={0.7}
    >
      <PillThumbnail imageUri={resultItem.ITEM_IMAGE} />
      <PillInfo pill={resultItem} />
    </TouchableOpacity>
  );
};

export default memo(SearchResultItem);
