import { memo, useEffect } from 'react';
import { View } from 'react-native';
import { Image } from '@components/common/CustomImage';
import { BaseText } from '@components/common/BaseText';
import { Star, ChevronRight } from 'lucide-react-native';
import {
  NativeAdView,
  NativeAsset,
  NativeAssetType,
} from 'react-native-google-mobile-ads';
import { COLOR, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';
import { styles } from '@features/pill_search_result_list/styles/molecules/SearchResultAdItem';
import { useNativeAd } from '@features/ads/hooks/useNativeAd';

import SearchResultAdSkeleton from './SearchResultAdSkeleton';

export interface SearchResultAdItemProps {
  adId: string;
  isScrolling: boolean;
  isVisible?: boolean;
  onNoFill?: (adId: string) => void;
}

const SearchResultAdItem = ({
  adId,
  isScrolling,
  isVisible = false,
  onNoFill,
}: SearchResultAdItemProps) => {
  // useNativeAd 단일 훅 사용: 캐싱, keepAlive, On-Demand 제어
  const { nativeAd, status, load } = useNativeAd({
    autoLoad: false,
    cacheKey: adId,
    keepAlive: true,
    onNoFill: () => onNoFill?.(adId),
  });

  // 뷰포트 기반 On-Demand 로드:
  // 1) 화면(뷰포트)에 실제로 진입했고 (isVisible === true)
  // 2) 스크롤이 완전히 멈춘 상태 (!isScrolling)에서
  // 3) 최소 250ms 이상 안정적으로 머물렀을 때만 실제 광고 로드 실행
  useEffect(() => {
    if (status !== 'idle' || isScrolling || !isVisible) return;

    const timer = setTimeout(() => {
      load();
    }, 250);

    return () => clearTimeout(timer);
  }, [status, isScrolling, isVisible, load]);

  // No-Fill 또는 로드 에러 발생 시 UI에서 완전히 접힘 (리스트 Collapse)
  if (status === 'no-fill' || status === 'error') {
    return null;
  }

  // 광고 로드 완료 전이거나 아직 인스턴스가 없는 경우 스켈레톤 유지
  if (status !== 'loaded' || !nativeAd) {
    return <SearchResultAdSkeleton />;
  }

  const imageUrl = nativeAd.icon?.url || nativeAd.images?.[0]?.url;

  return (
    <NativeAdView nativeAd={nativeAd} style={styles.nativeAdViewContainer}>
      <View style={styles.searchItemWrapper}>
        {/* 1. 좌측 썸네일 이미지 (일반 알약과 동일한 100x100 규격) */}
        <View style={styles.searchItemImage}>
          {imageUrl ? (
            <NativeAsset assetType={NativeAssetType.ICON}>
              <Image
                source={{ uri: imageUrl }}
                style={styles.image}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
              />
            </NativeAsset>
          ) : (
            <View style={styles.fallbackIconContainer}>
              <BaseText
                size={14}
                minSize={14}
                weight="bold"
                style={styles.fallbackIconText}
              >
                AD
              </BaseText>
            </View>
          )}
        </View>

        {/* 2. 우측 상세 정보 영역 (일반 알약 SearchResultItem과 1:1 대응 4단 구조) */}
        <View style={styles.searchItemContents}>
          {/* 1단: [광고] 뱃지 + 헤드라인 (알약의 ITEM_NAME 위치) */}
          <View style={styles.headerWrapper}>
            <View style={styles.adBadge}>
              <BaseText
                size={9}
                minSize={9}
                weight="bold"
                style={styles.adBadgeText}
              >
                광고
              </BaseText>
            </View>
            <NativeAsset assetType={NativeAssetType.HEADLINE}>
              <BaseText
                size={14}
                minSize={14}
                weight="bold"
                style={styles.headline}
                numberOfLines={1}
              >
                {nativeAd.headline}
              </BaseText>
            </NativeAsset>
          </View>

          {/* 2단: 광고주명 (알약의 CLASS_NAME 위치) */}
          {nativeAd.advertiser ? (
            <NativeAsset assetType={NativeAssetType.ADVERTISER}>
              <BaseText
                size={12}
                minSize={12}
                weight="medium"
                style={styles.advertiser}
                numberOfLines={1}
              >
                {nativeAd.advertiser}
              </BaseText>
            </NativeAsset>
          ) : null}

          {/* 3단: 설명 문구 (최대 2줄) */}
          {nativeAd.body ? (
            <NativeAsset assetType={NativeAssetType.BODY}>
              <BaseText
                size={11}
                minSize={11}
                weight="medium"
                style={styles.body}
                numberOfLines={2}
              >
                {nativeAd.body}
              </BaseText>
            </NativeAsset>
          ) : null}

          {/* 4단: 하단 평점(좌측) + CTA 액션 링크(우측) */}
          <View style={styles.bottomWrapper}>
            {nativeAd.starRating ? (
              <NativeAsset assetType={NativeAssetType.STAR_RATING}>
                <View style={styles.ratingWrapper}>
                  <Star
                    size={px(11, 12)}
                    fill={COLOR['guide']}
                    stroke={COLOR['guide']}
                  />
                  <BaseText
                    size={11}
                    minSize={11}
                    weight="semiBold"
                    style={styles.ratingText}
                  >
                    {nativeAd.starRating.toFixed(1)}
                  </BaseText>
                </View>
              </NativeAsset>
            ) : (
              <View />
            )}

            {nativeAd.callToAction ? (
              <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
                <View style={styles.callToActionContainer}>
                  <BaseText
                    size={11}
                    minSize={11}
                    weight="semiBold"
                    style={styles.callToActionText}
                  >
                    {nativeAd.callToAction}
                  </BaseText>
                  <ChevronRight size={px(12, 13)} color={COLOR_TEXT['label']} />
                </View>
              </NativeAsset>
            ) : null}
          </View>
        </View>
      </View>
    </NativeAdView>
  );
};

export default memo(SearchResultAdItem);
