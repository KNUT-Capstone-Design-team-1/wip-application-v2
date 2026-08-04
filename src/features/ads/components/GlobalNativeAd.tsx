import React from 'react';
import { View, Image, Platform } from 'react-native';
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

interface GlobalNativeAdProps {
  banner?: boolean;
}

export const GlobalNativeAd = ({ banner = false }: GlobalNativeAdProps) => {
  const { nativeAd, isAdLoaded, isAdError, adKey, isRefreshing } =
    useNativeAd();
  const adHeight = px(90, 100);

  if (Platform.OS === 'web' || !AD_UNITS.NATIVE) {
    return null;
  }

  // 네이티브 광고 로드 실패(No-Fill 또는 에러) 시 일반 배너 광고로 Fallback (상세 화면만 적용)
  if (isAdError) {
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

  if (!isAdLoaded || !nativeAd || isRefreshing) {
    return (
      <View style={styles.container}>
        <NativeAdSkeleton height={adHeight} />
      </View>
    );
  }

  return (
    <View key={adKey} style={styles.container}>
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
              <View style={{ flex: 1 }}>
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
