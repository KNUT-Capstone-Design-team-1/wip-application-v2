import { memo, useMemo, useRef } from 'react';
import { Image } from '@components/common/CustomImage';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '@features/pill_search_result_list/styles/molecules/SearchResultItem';
import { IResultItemProps } from '@features/pill_search_result_list/types/pill_search_result_list';
import { IPillData } from '@services/database/types';
import {
  normalizeImageUri,
  DEFAULT_PILL_BLURHASH,
} from '@features/pill_search_result_list/utils/pill_image_util';
import SearchResultAdItem from './SearchResultAdItem';

interface IPillThumbnail {
  imageUri?: string | null;
  itemSeq: string;
  shouldLoadImage?: boolean;
  onImageLoad?: (itemSeq: string) => void;
}

// 알약 썸네일 이미지 컴포넌트
const PillThumbnail = ({
  imageUri,
  itemSeq,
  shouldLoadImage = true,
  onImageLoad,
}: IPillThumbnail) => {
  const normalizedUri = useMemo(() => normalizeImageUri(imageUri), [imageUri]);

  // FlashList 재활용 및 스크롤 중 깜빡임 방지를 위한 동기적 래치 (useEffect/useState 제거로 2차 렌더링 방지)
  const loadedSeqRef = useRef<string | null>(shouldLoadImage ? itemSeq : null);
  if (shouldLoadImage) {
    loadedSeqRef.current = itemSeq;
  }
  const isImageActive = shouldLoadImage || loadedSeqRef.current === itemSeq;

  return (
    <View style={styles.searchItemImage}>
      {normalizedUri ? (
        isImageActive ? (
          <Image
            source={{ uri: normalizedUri }}
            placeholder={{ blurhash: DEFAULT_PILL_BLURHASH }}
            placeholderContentFit="cover"
            transition={200}
            style={styles.image}
            contentFit="cover"
            recyclingKey={itemSeq}
            cachePolicy={'memory-disk'}
            priority={'low'}
            onLoad={() => onImageLoad?.(itemSeq)}
          />
        ) : null
      ) : (
        <View style={styles.fallbackImageContainer}>
          <BaseText
            style={styles.fallbackImageText}
            weight="semiBold"
            size={14}
          >
            이미지 없음
          </BaseText>
        </View>
      )}
    </View>
  );
};

// 알약 상세 정보 텍스트 컴포넌트
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
        weight="medium"
        size={12}
        numberOfLines={1}
      >
        {pill.CLASS_NAME}
      </BaseText>
      <View style={styles.infoPrintWrapper}>
        <BaseText style={styles.searchItemPrintText} weight="medium" size={11}>
          {pill.PRINT_FRONT || '없음'}
        </BaseText>
        <View style={styles.infoSeparator} />
        <BaseText style={styles.searchItemPrintText} weight="medium" size={11}>
          {pill.PRINT_BACK || '없음'}
        </BaseText>
      </View>
      <View style={styles.infoEntpWrapper}>
        <BaseText
          style={styles.searchItemEntpName}
          weight="medium"
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
  type = 'item',
  resultItem,
  itemClickHandler,
  shouldLoadImage = true,
  onImageLoad,
  adId,
  isScrolling = false,
}: IResultItemProps) => {
  if (type === 'ads') {
    if (!adId) return null;
    return (
      <SearchResultAdItem key={adId} adId={adId} isScrolling={isScrolling} />
    );
  }

  if (!resultItem || !itemClickHandler) {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.searchItemWrapper}
      onPress={() =>
        itemClickHandler(resultItem.ITEM_SEQ, resultItem.ITEM_IMAGE)
      }
      activeOpacity={0.7}
    >
      <PillThumbnail
        key={resultItem.ITEM_SEQ}
        imageUri={resultItem.ITEM_IMAGE}
        itemSeq={resultItem.ITEM_SEQ}
        shouldLoadImage={shouldLoadImage}
        onImageLoad={onImageLoad}
      />
      <PillInfo pill={resultItem} />
    </TouchableOpacity>
  );
};

export default memo(SearchResultItem, (prev, next) => {
  if (prev.type !== next.type) return false;

  // 1. 광고 아이템일 때: 가시성은 Zustand 스토어에서 슬롯별 독립 구독
  if (prev.type === 'ads') {
    return prev.adId === next.adId && prev.isScrolling === next.isScrolling;
  }

  // 2. 일반 알약 아이템일 때: 광고 상태 변화로 인한 무차별 리렌더링 완전 차단
  return (
    prev.resultItem?.ITEM_SEQ === next.resultItem?.ITEM_SEQ &&
    prev.shouldLoadImage === next.shouldLoadImage &&
    prev.itemClickHandler === next.itemClickHandler
  );
});
