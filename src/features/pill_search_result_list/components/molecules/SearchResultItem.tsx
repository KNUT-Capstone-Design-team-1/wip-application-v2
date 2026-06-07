import { memo } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from '@features/pill_search_result_list/styles/molecules/SearchResultItem';
import { IResultItemProps } from '@features/pill_search_result_list/types/pill_search_result_list';
import { IPillData } from '@services/database/types';
import { fontPx } from '@utils/responsive';

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
const PillInfo = ({ pill }: { pill: IPillData }) => {
  const itemNames = pill.ITEM_NAME.split(/(?=\()/, 2);

  return (
    <View style={styles.searchItemContents}>
      <Text style={styles.searchItemTitle} numberOfLines={1}>
        {itemNames[0]}
      </Text>
      {itemNames[1] && (
        <Text
          style={[styles.searchItemTitle, { fontSize: fontPx(12) }]}
          numberOfLines={1}
        >
          {itemNames[1]}
        </Text>
      )}
      <Text style={styles.searchItemClassName} numberOfLines={1}>
        {pill.CLASS_NAME}
      </Text>
      <View style={styles.infoPrintWrapper}>
        <Text style={styles.searchItemPrintText}>
          {pill.PRINT_FRONT || '없음'}
        </Text>
        <View style={styles.infoSeparator} />
        <Text style={styles.searchItemPrintText}>
          {pill.PRINT_BACK || '없음'}
        </Text>
      </View>
      <View style={styles.infoEntpWrapper}>
        <Text style={styles.searchItemEntpName} numberOfLines={1}>
          {pill.ENTP_NAME}
        </Text>
      </View>
    </View>
  );
};

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
