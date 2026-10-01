import React, { useCallback, useRef, useEffect } from 'react';
import { View, Image, Platform } from 'react-native';
import { useFocusEffect } from 'expo-router';
import {
  NativeAdView,
  BannerAdSize,
  NativeAsset,
  NativeAssetType,
} from 'react-native-google-mobile-ads';
import { useNativeAd } from '../hooks/useNativeAd';
import { NativeAdSkeleton } from './NativeAdSkeleton';
import { GlobalBannerAd } from './GlobalBannerAd';
import { AD_UNITS } from '../constants/ad_units';
import { styles } from '@features/ads/styles/components/GlobalNativeAd';
import { BaseText } from '@components/common/BaseText';
import { px } from '@utils/responsive';
import { Star } from 'lucide-react-native';
import { COLOR } from '@constants/color';

// AdMob 공식 네이티브 광고 유효 기간 (60분)
const AD_TTL_MS = 60 * 60 * 1000;

interface GlobalNativeAdProps {
  banner?: boolean;
  useFocusLifecycle?: boolean;
}

export const GlobalNativeAd = ({
  banner = false,
  useFocusLifecycle = false,
}: GlobalNativeAdProps) => {
  const { nativeAd, status, load } = useNativeAd({ autoLoad: true });
  const adHeight = px(90, 100);
  const lastLoadedTimeRef = useRef<number>(0);

  const isLoaded = status === 'loaded' && !!nativeAd;
  const isError = status === 'error' || status === 'no-fill';

  // 광고 로드 완료 시점 기록
  useEffect(() => {
    if (isLoaded) {
      lastLoadedTimeRef.current = Date.now();
    }
  }, [isLoaded]);

  // 바텀 탭 등 화면 복귀 시 60분 만료 여부만 체크하여 갱신 (화면 이탈 시에는 광고를 파괴하지 않고 보존)
  useFocusEffect(
    useCallback(() => {
      if (!useFocusLifecycle) return;

      const now = Date.now();
      const hasLoadedBefore = lastLoadedTimeRef.current > 0;
      const isExpired =
        hasLoadedBefore && now - lastLoadedTimeRef.current >= AD_TTL_MS;

      // 60분이 지난 만료된 광고이거나 로드 실패 상태인 경우에만 새로 로드
      if (isExpired || isError) {
        lastLoadedTimeRef.current = now;
        load();
      }
    }, [useFocusLifecycle, isError, load]),
  );

  if (Platform.OS === 'web' || !AD_UNITS.NATIVE) {
    return null;
  }

  // 네이티브 광고 로드 실패(No-Fill 또는 에러) 시 일반 배너 광고로 Fallback (상세 화면만 적용)
  if (isError) {
    if (!banner) {
      return null;
    }
    return (
      <View
        style={[
          styles.container,
          {
            height: adHeight,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <GlobalBannerAd size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
      </View>
    );
  }

  // 첫 로드 전이거나 광고 인스턴스가 없을 때만 스켈레톤 표시 (갱신 중에는 기존 광고 유지하여 깜빡임 방지)
  if (!isLoaded || !nativeAd) {
    return (
      <View style={styles.container}>
        <NativeAdSkeleton height={adHeight} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NativeAdView nativeAd={nativeAd} style={[styles.adView]}>
        <View
          style={[
            styles.bannerLayout,
            { height: adHeight },
            !banner && styles.layoutBorder,
          ]}
        >
          {nativeAd.icon && (
            <NativeAsset assetType={NativeAssetType.ICON}>
              <Image
                source={{ uri: nativeAd.icon.url }}
                style={styles.bannerLayoutIcon}
                resizeMode="contain"
              />
            </NativeAsset>
          )}

          <View style={styles.contentInfo}>
            <View style={styles.headerWrapper}>
              {/* 구글 AdMob 필수: 광고 표기 (Ad Attribution Badge) */}
              <View style={styles.adBadge}>
                <BaseText
                  size={9}
                  minSize={12}
                  weight={'bold'}
                  style={styles.adBadgeText}
                >
                  광고
                </BaseText>
              </View>
              <View style={styles.headlineWrapper}>
                <NativeAsset assetType={NativeAssetType.HEADLINE}>
                  <BaseText
                    size={14}
                    minSize={14}
                    weight={'bold'}
                    style={styles.headline}
                    numberOfLines={1}
                  >
                    {nativeAd.headline}
                  </BaseText>
                </NativeAsset>
              </View>
            </View>

            {nativeAd.advertiser ? (
              <NativeAsset assetType={NativeAssetType.ADVERTISER}>
                <BaseText
                  size={11}
                  minSize={11}
                  weight={'medium'}
                  style={styles.advertiser}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {nativeAd.advertiser}
                </BaseText>
              </NativeAsset>
            ) : (
              <NativeAsset assetType={NativeAssetType.BODY}>
                <BaseText
                  size={12}
                  minSize={12}
                  weight={'medium'}
                  style={styles.advertiser}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {nativeAd.body}
                </BaseText>
              </NativeAsset>
            )}
            <View style={styles.footerWrapper}>
              {nativeAd.starRating && (
                <View style={styles.starRatingWrapper}>
                  <Star
                    size={px(14, 18)}
                    fill={COLOR['guide']}
                    stroke={COLOR['guide']}
                  />
                  <NativeAsset assetType={NativeAssetType.STAR_RATING}>
                    <BaseText size={11} minSize={11} weight={'medium'}>
                      {nativeAd.starRating}
                    </BaseText>
                  </NativeAsset>
                </View>
              )}
              {nativeAd.callToAction && (
                <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
                  <View style={styles.bannerCallToAction}>
                    <BaseText
                      size={12}
                      minSize={14}
                      weight={'bold'}
                      style={styles.callToActionText}
                      ellipsizeMode="tail"
                    >
                      {nativeAd.callToAction}
                    </BaseText>
                  </View>
                </NativeAsset>
              )}
            </View>
          </View>
        </View>
      </NativeAdView>
    </View>
  );
};
