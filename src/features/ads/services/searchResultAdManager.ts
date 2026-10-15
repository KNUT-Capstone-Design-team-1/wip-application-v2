import { Platform } from 'react-native';
import {
  NativeAd,
  NativeAdRequestOptions,
} from 'react-native-google-mobile-ads';
import { AD_UNITS } from '../constants/ad_units';
import { ADS_KEYWORDS } from '../constants/keyword';
import logger from '@utils/logger';

const DEFAULT_REQUEST_OPTIONS: NativeAdRequestOptions = {
  keywords: ADS_KEYWORDS,
  requestNonPersonalizedAdsOnly: true,
};

const AD_TTL_MS = 60 * 1000; // 60초 유효 시간

/**
 * 검색 결과 리스트 인피드(In-Feed) 네이티브 광고 매니저
 * - 단일 Preload 큐(Single Preloaded Pool) 구조
 * - 뷰포트 & 스크롤 정지 감지 기반 슬롯 바인딩
 * - 역스크롤 0ms 영구 보관 캐시
 * - 새 검색 시 바인딩 광고 메모리 해제 및 미사용 Preload 큐 재활용(TTL 60초)
 */
export class SearchResultAdManager {
  // 단일 Preload 대기실: 미리 로드되어 대기 중인 광고 1개
  private preloadedAd: NativeAd | null = null;
  private preloadedAdCreatedAt = 0;

  // 슬롯별 영구 보관소: 뷰포트에 도달하여 특정 슬롯에 할당된 광고들 (역스크롤 복원용)
  private slotAdsMap = new Map<number | string, NativeAd>();

  // 비동기 요청 중복 방지 (Coalescing)
  private inflightPromise: Promise<NativeAd | null> | null = null;

  /**
   * 새 후보 광고 1개 백그라운드 프리로드 (단일 Preload 큐)
   * - 이미 유효한(60초 이내) preloadedAd가 있으면 즉시 반환
   * - 진행 중인 요청이 있다면 해당 Promise 공유 (Coalescing)
   */
  public preloadAd = async (): Promise<NativeAd | null> => {
    if (Platform.OS === 'web' || !AD_UNITS.NATIVE) {
      return null;
    }

    // 1. 이미 대기실에 유효한 광고가 있는지 검사
    if (this.preloadedAd) {
      const remainingSec = Math.round(
        (AD_TTL_MS - (Date.now() - this.preloadedAdCreatedAt)) / 1000,
      );
      if (remainingSec > 0) {
        return this.preloadedAd;
      }
      // TTL 만료 시 파기
      try {
        this.preloadedAd.destroy();
      } catch (e) {
        logger.warn(
          `[SearchResultAdManager] Failed to destroy expired preloaded ad: ${String(e)}`,
        );
      }
      this.preloadedAd = null;
      this.preloadedAdCreatedAt = 0;
    }

    // 2. 이미 로딩 중인 요청이 있으면 병합
    if (this.inflightPromise) {
      return this.inflightPromise;
    }

    this.inflightPromise = (async () => {
      try {
        const ad = await NativeAd.createForAdRequest(
          AD_UNITS.NATIVE,
          DEFAULT_REQUEST_OPTIONS,
        );
        this.preloadedAd = ad;
        this.preloadedAdCreatedAt = Date.now();
        return ad;
      } catch (error) {
        logger.warn(
          `[SearchResultAdManager] Failed to preload native ad: ${String(error)}`,
        );
        return null;
      } finally {
        this.inflightPromise = null;
      }
    })();

    return this.inflightPromise;
  };

  /**
   * 특정 슬롯에 이미 바인딩된 광고 인스턴스 반환 (역스크롤 0ms 복원용)
   */
  public getSlotAd = (slotKey: number | string): NativeAd | null => {
    return this.slotAdsMap.get(slotKey) ?? null;
  };

  /**
   * 뷰포트에 도달한 슬롯에 광고 바인딩:
   * 1. 이미 슬롯에 바인딩된 광고가 있다면 0ms 즉시 반환
   * 2. Preload 큐에 대기 광고가 있다면 꺼내어 슬롯에 영구 할당 후, 다음 슬롯 대비 백그라운드 Preload
   * 3. Preload 큐가 비어있다면 온디맨드 로드 후 슬롯에 할당
   */
  public getOrBindAd = async (
    slotKey: number | string,
  ): Promise<NativeAd | null> => {
    // 1. 이미 바인딩된 광고가 있다면 즉시 반환 (역스크롤 복귀 시 0ms)
    const existing = this.slotAdsMap.get(slotKey);
    if (existing) {
      return existing;
    }

    // 2. Preload 큐에서 광고 확보
    let ad: NativeAd | null = null;

    if (this.preloadedAd) {
      ad = this.preloadedAd;
      this.preloadedAd = null;
      this.preloadedAdCreatedAt = 0;
    } else {
      ad = await this.preloadAd();
      if (this.preloadedAd === ad) {
        this.preloadedAd = null;
        this.preloadedAdCreatedAt = 0;
      }
    }

    if (!ad) {
      return null;
    }

    // 슬롯에 영구 보관 (해당 슬롯 전용)
    this.slotAdsMap.set(slotKey, ad);

    // 큐를 비웠으므로 다음 슬롯 대비 백그라운드에서 1개 새로 프리로드
    this.preloadAd().catch(() => {});

    return ad;
  };

  /**
   * 새 검색 실행 또는 검색어 변경 시 호출:
   * - 슬롯에 바인딩되었던 광고들은 즉시 메모리 해제 (.destroy())
   * - 미소비된 preloadedAd는 유효 기간(60초 TTL) 내라면 보존하여 다음 검색 첫 슬롯에 재사용
   */
  public resetForNewSearch = (): void => {
    this.slotAdsMap.forEach((ad) => {
      try {
        ad.destroy();
      } catch (e) {
        logger.warn(
          `[SearchResultAdManager] Failed to destroy slot ad: ${String(e)}`,
        );
      }
    });
    this.slotAdsMap.clear();

    // preloadedAd TTL 검사 및 만료 시 파기
    if (this.preloadedAd) {
      const isExpired = Date.now() - this.preloadedAdCreatedAt >= AD_TTL_MS;
      if (isExpired) {
        try {
          this.preloadedAd.destroy();
        } catch {}
        this.preloadedAd = null;
        this.preloadedAdCreatedAt = 0;
      }
    }
  };

  /**
   * 화면 완전 이탈 또는 앱 종료 시 모든 광고 인스턴스 완전 파기
   */
  public destroyAll = (): void => {
    this.slotAdsMap.forEach((ad) => {
      try {
        ad.destroy();
      } catch {}
    });
    this.slotAdsMap.clear();

    if (this.preloadedAd) {
      try {
        this.preloadedAd.destroy();
      } catch {}
      this.preloadedAd = null;
      this.preloadedAdCreatedAt = 0;
    }
    this.inflightPromise = null;
  };
}

export const searchResultAdManager = new SearchResultAdManager();
