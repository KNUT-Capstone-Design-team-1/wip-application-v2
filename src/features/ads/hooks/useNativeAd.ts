import { useState, useCallback, useRef, useEffect } from 'react';
import { Platform } from 'react-native';
import {
  NativeAd,
  NativeAdRequestOptions,
} from 'react-native-google-mobile-ads';
import { AD_UNITS } from '../constants/ad_units';
import { ADS_KEYWORDS } from '../constants/keyword';
import {
  AdError,
  CachedNativeAdEntry,
  NativeAdHookState,
  UseNativeAdOptions,
  UseNativeAdResult,
} from '../types';

// reference: https://github.com/invertase/react-native-google-mobile-ads/blob/main/packages/core/src/hooks/useNativeAd.ts

const DEFAULT_REQUEST_OPTIONS: NativeAdRequestOptions = {
  keywords: ADS_KEYWORDS,
  requestNonPersonalizedAdsOnly: true,
};

// 네이티브 광고 스마트 쿨다운 (60초):
// - 1분 이내의 고속 연속 재검색 시: 기존 광고를 0ms로 재사용하여 무효 트래픽(Invalid Traffic) 원천 차단
// - 1분 경과 후의 검색 시: 기존 광고 만료 파기 후 새 광고를 요청하여 수익성(eCPM/CTR) 극대화
const AD_COOLDOWN_MS = 60 * 1000;

// 모듈 레벨 NativeAd 캐시 (cacheKey -> { ad, loadedAt })
const nativeAdCache = new Map<string, CachedNativeAdEntry>();

/**
 * 60초 쿨다운 이내의 유효한 캐시 광고 인스턴스 조회 (60초 경과 시 만료 파기 및 캐시 제거)
 */
const getValidCachedAd = (key?: string): NativeAd | null => {
  if (!key) return null;
  const entry = nativeAdCache.get(key);
  if (!entry) return null;

  // 60초 쿨다운이 경과한 광고는 만료 처리 (네이티브 메모리 해제 후 새 광고 로드 허용)
  if (Date.now() - entry.loadedAt >= AD_COOLDOWN_MS) {
    try {
      entry.ad.destroy();
    } catch {}
    nativeAdCache.delete(key);
    return null;
  }

  return entry.ad;
};

function isLoadNoFill(error: any): boolean {
  if (!error) return false;

  if (
    error.reason === 'no-fill' ||
    error.reason === 'mediation-no-fill' ||
    error.userInfo?.reason === 'no-fill'
  ) {
    return true;
  }

  const code = String(error.code || '').toLowerCase();
  const message = String(error.message || '').toLowerCase();

  return (
    code.includes('no-fill') ||
    code.includes('error-code-no-fill') ||
    message.includes('no fill') ||
    message.includes('no ad to show')
  );
}

const initState: NativeAdHookState = {
  status: 'idle',
  nativeAd: null,
  error: null,
};

/**
 * 순수 On-Demand 네이티브 광고 Hook
 * - 타이머 기반 자동 갱신(interval)을 제거하고, 마운트 시 1회 로드 및 명시적 load/destroy 제어 제공
 * - 컴포넌트 언마운트 시 네이티브 메모리 완전 해제 (단, keepAlive: true 시 캐시 유지)
 */
export const useNativeAd = (
  options?: UseNativeAdOptions,
): UseNativeAdResult => {
  const adUnitId =
    options?.adUnitId !== undefined ? options.adUnitId : AD_UNITS.NATIVE;
  const autoLoad = options?.autoLoad ?? true;
  const cacheKey = options?.cacheKey;
  const keepAlive = options?.keepAlive ?? false;
  const onNoFill = options?.onNoFill;
  const onError = options?.onError;
  const requestOptions = options?.requestOptions ?? DEFAULT_REQUEST_OPTIONS;

  // 캐시에 이미 로드된 유효한 광고(60초 TTL 이내)가 있다면 초기 상태로 즉시 주입 (0ms 복원, 재요청 0)
  const cachedAd = getValidCachedAd(cacheKey);
  const [state, setState] = useState<NativeAdHookState>(() =>
    cachedAd
      ? { status: 'loaded', nativeAd: cachedAd, error: null }
      : initState,
  );

  // 생명주기 및 메모리 관리 Ref
  const mountedRef = useRef(true);
  const generationRef = useRef(0);
  const inflightRef = useRef<Promise<void> | null>(null);
  const inflightSignatureRef = useRef<string | null>(null);

  const currentAdRef = useRef<NativeAd | null>(cachedAd);
  const oldAdRef = useRef<NativeAd | null>(null);
  const oldAdDestroyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // 현재 options 최신 참조 유지 (이벤트 핸들러 및 최신 콜백 안정성 확보)
  const optionsRef = useRef({
    adUnitId,
    requestOptions,
    autoLoad,
    cacheKey,
    keepAlive,
    onNoFill,
    onError,
  });
  optionsRef.current = {
    adUnitId,
    requestOptions,
    autoLoad,
    cacheKey,
    keepAlive,
    onNoFill,
    onError,
  };

  // 광고 객체 파괴 및 메모리 해제 헬퍼
  const destroyCurrentAd = useCallback(() => {
    if (oldAdDestroyTimerRef.current) {
      clearTimeout(oldAdDestroyTimerRef.current);
      oldAdDestroyTimerRef.current = null;
    }
    if (oldAdRef.current) {
      oldAdRef.current.destroy();
      oldAdRef.current = null;
    }
    if (currentAdRef.current) {
      if (optionsRef.current.cacheKey) {
        nativeAdCache.delete(optionsRef.current.cacheKey);
      }
      currentAdRef.current.destroy();
      currentAdRef.current = null;
    }
  }, []);

  const load = useCallback(() => {
    if (!mountedRef.current) return;

    if (Platform.OS === 'web' || !optionsRef.current.adUnitId) {
      const err = new Error(
        'Native ads are not supported on web or missing adUnitId',
      ) as AdError;
      err.reason = 'invalid-request';
      setState({ status: 'error', nativeAd: null, error: err });
      return;
    }

    // 60초 쿨다운 이내의 유효한 광고가 이미 캐시되어 있다면 구글 서버 재요청을 원천 차단하고 즉시 복원
    const validCachedAd = getValidCachedAd(optionsRef.current.cacheKey);
    if (validCachedAd) {
      currentAdRef.current = validCachedAd;
      setState({ status: 'loaded', nativeAd: validCachedAd, error: null });
      return;
    }

    const unitId = optionsRef.current.adUnitId;
    const reqOptions = optionsRef.current.requestOptions;
    const signature = JSON.stringify({ unitId, reqOptions });

    // 이미 동일 요청이 진행 중인 경우 중복 호출 방지 (Coalescing)
    if (inflightRef.current && inflightSignatureRef.current === signature) {
      return;
    }

    const currentGeneration = ++generationRef.current;
    inflightSignatureRef.current = signature;

    // 로딩 상태 전이 (기존 광고가 있으면 백그라운드 로딩으로 유지)
    setState((prev) => ({ ...prev, status: 'loading', error: null }));

    const promise = NativeAd.createForAdRequest(unitId, reqOptions)
      .then((ad) => {
        // 비동기 완료 시점에 언마운트되었거나 세대가 바뀌었으면 즉시 파기 (메모리 누수 원천 차단)
        if (
          !mountedRef.current ||
          currentGeneration !== generationRef.current
        ) {
          ad.destroy();
          return;
        }

        // 캐시 키가 지정된 경우 모듈 캐시에 등록 (60초 TTL을 위한 타임스탬프 기록)
        if (optionsRef.current.cacheKey) {
          nativeAdCache.set(optionsRef.current.cacheKey, {
            ad,
            loadedAt: Date.now(),
          });
        }

        // 새 광고 안착: 이전 광고를 2초 후 지연 제거하여 깜빡임(Flicker) 방지
        const previousAd = currentAdRef.current;
        currentAdRef.current = ad;

        setState({
          status: 'loaded',
          nativeAd: ad,
          error: null,
        });

        if (previousAd && previousAd !== ad) {
          if (oldAdDestroyTimerRef.current) {
            clearTimeout(oldAdDestroyTimerRef.current);
          }
          oldAdRef.current = previousAd;
          oldAdDestroyTimerRef.current = setTimeout(() => {
            if (oldAdRef.current) {
              oldAdRef.current.destroy();
              oldAdRef.current = null;
            }
          }, 2000);
        }
      })
      .catch((caught: unknown) => {
        if (
          !mountedRef.current ||
          currentGeneration !== generationRef.current
        ) {
          return;
        }

        const error = caught as AdError;
        const noFill = isLoadNoFill(error);
        if (noFill) {
          error.reason = 'no-fill';
          error.phase = 'load';
          optionsRef.current.onNoFill?.(error);
        } else {
          optionsRef.current.onError?.(error);
        }

        setState({
          status: noFill ? 'no-fill' : 'error',
          nativeAd: null,
          error,
        });
      })
      .finally(() => {
        if (inflightRef.current === promise) {
          inflightRef.current = null;
          inflightSignatureRef.current = null;
        }
      });

    inflightRef.current = promise;
  }, []);

  const retry = useCallback(() => {
    load();
  }, [load]);

  const destroy = useCallback(() => {
    generationRef.current += 1;
    inflightRef.current = null;
    inflightSignatureRef.current = null;
    destroyCurrentAd();
    setState(initState);
  }, [destroyCurrentAd]);

  // 마운트 시 autoLoad 처리
  useEffect(() => {
    if (autoLoad && !currentAdRef.current && !inflightRef.current) {
      load();
    }
  }, [autoLoad, load]);

  // 언마운트 시 메모리 정리 (keepAlive가 true이면 파괴하지 않고 보존)
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      generationRef.current += 1;
      inflightRef.current = null;
      inflightSignatureRef.current = null;
      if (!optionsRef.current.keepAlive) {
        destroyCurrentAd();
      }
    };
  }, [destroyCurrentAd]);

  return {
    status: state.status,
    nativeAd: state.nativeAd,
    error: state.error,
    autoLoad,
    load,
    retry,
    destroy,
  };
};
