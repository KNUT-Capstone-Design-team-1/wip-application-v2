import { memo } from 'react';
import { Image } from '@components/common/CustomImage';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
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
        contentFit="cover"
      />
    ) : (
      <View style={styles.fallbackImageContainer}>
        <BaseText style={styles.fallbackImageText} weight="semiBold" size={14}>
          이미지 없음
        </BaseText>
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
      <View style={styles.infoTitleWrapper}>
        <BaseText
          style={styles.searchItemTitle}
          weight="bold"
          size={14}
          numberOfLines={1}
        >
          {itemNames[0]}
        </BaseText>
        {itemNames[1] && (
          <BaseText
            style={styles.searchItemTitle}
            weight="bold"
            size={12}
            numberOfLines={1}
          >
            {itemNames[1]}
          </BaseText>
        )}
      </View>
      <BaseText
        style={styles.searchItemClassName}
        weight="semiBold"
        size={12}
        numberOfLines={1}
      >
        {pill.CLASS_NAME}
      </BaseText>
      <View style={styles.infoPrintWrapper}>
        <BaseText
          style={styles.searchItemPrintText}
          weight="semiBold"
          size={11}
        >
          {pill.PRINT_FRONT || '없음'}
        </BaseText>
        <View style={styles.infoSeparator} />
        <BaseText
          style={styles.searchItemPrintText}
          weight="semiBold"
          size={11}
        >
          {pill.PRINT_BACK || '없음'}
        </BaseText>
      </View>
      <View style={styles.infoEntpWrapper}>
        <BaseText
          style={styles.searchItemEntpName}
          weight="semiBold"
          size={11}
          numberOfLines={1}
        >
          {pill.ENTP_NAME}
        </BaseText>
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
