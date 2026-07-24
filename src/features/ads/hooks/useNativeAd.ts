import { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import { NativeAd } from 'react-native-google-mobile-ads';
import { useFocusEffect } from 'expo-router';
import { AD_UNITS } from '../constants/ad_units';
import { ADS_KEYWORDS } from '../constants/keyword';

export const useNativeAd = () => {
  const [nativeAd, setNativeAd] = useState<NativeAd | null>(null);
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [isAdError, setIsAdError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      let loadedAd: NativeAd | null = null;

      if (Platform.OS === 'web') {
        setIsAdError(true);
        return;
      }

      const testAdUnitId = AD_UNITS.NATIVE;

      NativeAd.createForAdRequest(testAdUnitId, {
        keywords: ADS_KEYWORDS,
        requestNonPersonalizedAdsOnly: true,
      })
        .then((ad) => {
          if (isMounted) {
            loadedAd = ad;
            setNativeAd(ad);
            setIsAdLoaded(true);
            setIsAdError(false);
          } else {
            ad.destroy();
          }
        })
        .catch((error) => {
          console.error('[useNativeAd] NativeAd load error:', error);
          if (isMounted) {
            setIsAdError(true);
          }
        });

      return () => {
        isMounted = false;
        if (loadedAd) {
          loadedAd.destroy();
        }
        setIsAdLoaded(false);
        setNativeAd(null);
      };
    }, []),
  );

  return { nativeAd, isAdLoaded, isAdError };
};
