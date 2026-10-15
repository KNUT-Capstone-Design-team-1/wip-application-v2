import { memo, useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { Image } from '@components/common/CustomImage';
import { BaseText } from '@components/common/BaseText';
import { Star, ChevronRight } from 'lucide-react-native';
import {
  NativeAd,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
} from 'react-native-google-mobile-ads';
import { COLOR, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';
import { styles } from '@features/pill_search_result_list/styles/molecules/SearchResultAdItem';
import { searchResultAdManager } from '@features/ads/services/searchResultAdManager';
import { useSearchResultListAdStore } from '@features/pill_search_result_list/store/search_result_list_ad_store';
import SearchResultAdSkeleton from './SearchResultAdSkeleton';

export interface SearchResultAdItemProps {
  adId: string;
  isScrolling: boolean;
}

const SearchResultAdItem = ({ adId, isScrolling }: SearchResultAdItemProps) => {
  // 개별 광고 슬롯별 뷰포트 노출 가시성을 Zustand 스토어에서 독립 구독 (전체 리스트 리렌더링 격리)
  const isVisible = useSearchResultListAdStore((state) =>
    state.visibleAdSlotIds.has(adId),
  );

  // 이미 이 슬롯에 할당된 광고가 있다면 초기 state로 즉시 주입 (0ms 역스크롤 복원)
  const [nativeAd, setNativeAd] = useState<NativeAd | null>(() =>
    searchResultAdManager.getSlotAd(adId),
  );
  const [isNoFill, setIsNoFill] = useState(false);

  // 셀 재사용(FlashList recycling) 대응용 Ref
  const prevAdIdRef = useRef(adId);

  // FlashList 셀 재사용으로 adId가 교체된 경우 상태 동기화
  useEffect(() => {
    if (prevAdIdRef.current !== adId) {
      prevAdIdRef.current = adId;
      const cached = searchResultAdManager.getSlotAd(adId);
      setNativeAd(cached);
      setIsNoFill(false);
    }
  }, [adId]);

  // 뷰포트 & 스크롤 정지 연동 바인딩:
  // 1) 화면(뷰포트)에 50% 이상 노출되었고 (isVisible === true)
  // 2) 스크롤이 완전히 멈춘 상태 (!isScrolling)에서
  // 3) 아직 바인딩되지 않은 슬롯에 Preload 큐(또는 신규 로드) 광고 즉시 할당
  useEffect(() => {
    if (!isVisible || isScrolling || nativeAd || isNoFill) {
      return;
    }

    let isCancelled = false;

    searchResultAdManager
      .getOrBindAd(adId)
      .then((ad) => {
        if (isCancelled) return;
        if (ad) {
          setNativeAd(ad);
        } else {
          setIsNoFill(true);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setIsNoFill(true);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [isVisible, isScrolling, nativeAd, isNoFill, adId]);

  // No-Fill 또는 로드 에러 확정 시 UI에서 완전히 접힘 (리스트 Collapse)
  if (isNoFill) {
    return null;
  }

  // 광고 로드 완료 전이거나 뷰포트 진입 전에는 스켈레톤 유지 (Layout Jump 방지)
  if (!nativeAd) {
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
                size={12}
                minSize={12}
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
                    size={px(12, 13)}
                    fill={COLOR['guide']}
                    stroke={COLOR['guide']}
                  />
                  <BaseText
                    size={12}
                    minSize={14}
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
              <View style={styles.callToActionContainer}>
                <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
                  <BaseText
                    size={12}
                    minSize={14}
                    weight="semiBold"
                    style={styles.callToActionText}
                  >
                    {nativeAd.callToAction}
                  </BaseText>
                </NativeAsset>
                <ChevronRight size={px(12, 14)} color={COLOR_TEXT['label']} />
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </NativeAdView>
  );
};

export default memo(SearchResultAdItem);
