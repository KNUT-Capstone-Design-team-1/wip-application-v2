import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import { AD_UNITS } from '../constants/ad_units';
import logger from '@utils/logger';

export type AdType = 'IMAGE_SEARCH' | 'UNIFIED_SEARCH' | 'DEFAULT';

class InterstitialService {
  private static instance: InterstitialService;
  private ad: InterstitialAd | null = null;
  private loaded = false;
  private isShowing = false;

  // 광고 노출 횟수 기록용
  private counts: Record<AdType, number> = {
    IMAGE_SEARCH: 0,
    UNIFIED_SEARCH: 0,
    DEFAULT: 0,
  };

  // 닫힘 이벤트 리스너 배열
  private closeListeners: (() => void)[] = [];

  private constructor() {
    this.initializeAd();
  }

  public static getInstance(): InterstitialService {
    if (!InterstitialService.instance) {
      InterstitialService.instance = new InterstitialService();
    }
    return InterstitialService.instance;
  }

  private initializeAd() {
    if (!AD_UNITS.INTERSTITIAL) return;

    this.ad = InterstitialAd.createForAdRequest(AD_UNITS.INTERSTITIAL, {
      requestNonPersonalizedAdsOnly: true,
    });

    this.ad.addAdEventListener(AdEventType.LOADED, () => {
      logger.info('Interstitial Ad Loaded');
      this.loaded = true;
    });

    this.ad.addAdEventListener(AdEventType.ERROR, (error) => {
      logger.error(`Interstitial Ad Error: ${error}`);
      this.loaded = false;
      this.isShowing = false;
      // 일정 시간 후 재시도 로직 추가 가능
      setTimeout(() => this.reload(), 10000);
    });

    this.ad.addAdEventListener(AdEventType.CLOSED, () => {
      logger.info('Interstitial Ad Closed');
      this.loaded = false;
      this.isShowing = false;

      // 등록된 리스너 실행 후 리스너 큐 비우기 (일회성 실행)
      this.closeListeners.forEach((listener) => listener());
      this.closeListeners = [];

      // 닫힌 후 다음 광고를 위해 미리 로드
      this.reload();
    });

    this.load();
  }

  public load() {
    if (this.ad && !this.loaded) {
      this.ad.load();
    }
  }

  public reload() {
    this.loaded = false;
    this.load();
  }

  public isLoaded(): boolean {
    return this.loaded;
  }

  /**
   * 광고 타입별 호출 횟수를 증가시키고, 노출 주기에 해당하는지 검사합니다.
   * - 첫 검색 시 무조건 노출
   * - 이후 IMAGE_SEARCH: 2회마다 1회 노출 (1, 3, 5...)
   * - 이후 UNIFIED_SEARCH: 3회마다 1회 노출 (1, 4, 7...)
   */
  private shouldShowAdForType(type: AdType): boolean {
    this.counts[type] += 1;

    switch (type) {
      case 'IMAGE_SEARCH':
        return this.counts[type] % 2 === 1;

      case 'UNIFIED_SEARCH':
        return this.counts[type] % 3 === 1;

      default:
        return true;
    }
  }

  /**
   * 광고 표시. 표시 불가 시 즉시 onClose 콜백을 실행해 앱 흐름 유지
   * @param type 광고 타입 (횟수 체크용)
   * @param onClose 광고 닫힘(또는 표시 불가) 시 실행할 콜백
   */
  public show(type: AdType = 'DEFAULT', onClose?: () => void) {
    if (!this.shouldShowAdForType(type)) {
      onClose?.();
      return;
    }

    if (onClose) {
      this.closeListeners.push(onClose);
    }

    if (this.loaded && this.ad && !this.isShowing) {
      this.isShowing = true;
      this.ad.show();
    } else {
      logger.warn('Interstitial Ad is not loaded or already showing.');
      // 광고가 준비되지 않았으면 대기하지 않고 바로 콜백 실행
      if (onClose) {
        onClose();
        this.closeListeners = []; // 실행 후 제거
      }
    }
  }
}

export const interstitialService = InterstitialService.getInstance();
