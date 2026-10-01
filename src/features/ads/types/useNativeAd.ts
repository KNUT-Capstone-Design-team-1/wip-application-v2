import {
  NativeAd,
  NativeAdRequestOptions,
} from 'react-native-google-mobile-ads';
import { AdError } from './AdError';

export type UseNativeAdStatus =
  'idle' | 'loading' | 'loaded' | 'no-fill' | 'error';

export interface CachedNativeAdEntry {
  ad: NativeAd;
  loadedAt: number;
}

export interface UseNativeAdOptions {
  adUnitId?: string | null;
  autoLoad?: boolean; // 기본값 true (마운트 시 자동 로드)
  requestOptions?: NativeAdRequestOptions;
  cacheKey?: string; // 지정 시 캐시에서 인스턴스 보존 및 재활용
  keepAlive?: boolean; // 언마운트 시 destroyCurrentAd를 건너뛰고 캐시 보존
  onNoFill?: (error: AdError) => void;
  onError?: (error: AdError) => void;
}

export type NativeAdHookState = {
  status: UseNativeAdStatus;
  nativeAd: NativeAd | null;
  error: AdError | null;
};

export interface UseNativeAdResult {
  // 최신 v17 공식 규격
  status: UseNativeAdStatus;
  nativeAd: NativeAd | null;
  error: AdError | null;
  autoLoad: boolean;
  load: () => void;
  retry: () => void;
  destroy: () => void;
}
