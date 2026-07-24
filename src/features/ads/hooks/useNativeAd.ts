import { useState, useCallback, useRef, useEffect } from 'react';
import { Platform } from 'react-native';
import { NativeAd } from 'react-native-google-mobile-ads';
import { useFocusEffect } from 'expo-router';
import { AD_UNITS } from '../constants/ad_units';
import { ADS_KEYWORDS } from '../constants/keyword';

const REFRESH_INTERVAL = 60000;

export const useNativeAd = () => {
  const [nativeAd, setNativeAd] = useState<NativeAd | null>(null);
  const [adKey, setAdKey] = useState('naitveAd' + Date.now().toLocaleString); // UI 강제 리렌더링용 키
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [isAdError, setIsAdError] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false); // 갱신 상태 알림

  // 마지막 로드 시간과 현재 광고 객체를 Ref로 추적
  const lastLoadTime = useRef<number>(0);
  const currentAdRef = useRef<NativeAd | null>(null);
  const isFetching = useRef<boolean>(false); // 중복 요청 방지용 플래그

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      if (Platform.OS === 'web') {
        setIsAdError(true);
        return;
      }

      const now = Date.now();

      // 갱신 시간 확인 및 중복 요청 방지
      if (
        isFetching.current ||
        (currentAdRef.current && now - lastLoadTime.current < REFRESH_INTERVAL)
      ) {
        return;
      }

      console.log('[useNativeAd] Create new ad');
      isFetching.current = true;
      lastLoadTime.current = Date.now();

      if (isMounted) {
        setIsRefreshing(true);
      }

      NativeAd.createForAdRequest(AD_UNITS.NATIVE, {
        keywords: ADS_KEYWORDS,
        requestNonPersonalizedAdsOnly: true,
      })
        .then((ad) => {
          isFetching.current = false;
          if (isMounted) {
            const oldAd = currentAdRef.current;

            // 새로운 광고 적용
            currentAdRef.current = ad;
            setNativeAd(ad);
            setAdKey('naitveAd' + Date.now().toLocaleString); // View의 key를 변경해서 UI 강제 리렌더링
            setIsAdLoaded(true);
            setIsAdError(false);
            setIsRefreshing(false);

            // 이전 광고 지연 제거
            if (oldAd) {
              setTimeout(() => {
                oldAd.destroy();
                console.log('[useNativeAd] Destroy old ad');
              }, 2000);
            }
          } else {
            ad.destroy();
          }
        })
        .catch((error) => {
          isFetching.current = false;
          console.error('[useNativeAd] NativeAd load error:', error);
          if (isMounted) {
            setIsAdError(true);
            setIsRefreshing(false);
          }
        });

      return () => {
        isMounted = false;
      };
    }, []),
  );

  useEffect(() => {
    return () => {
      if (currentAdRef.current) {
        currentAdRef.current.destroy();
      }
    };
  }, []);

  return { nativeAd, isAdLoaded, isAdError, adKey, isRefreshing };
};
