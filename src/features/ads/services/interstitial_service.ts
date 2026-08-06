import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import { AD_UNITS } from '../constants/ad_units';
import logger from '@utils/logger';
import { ADS_KEYWORDS } from '../constants/keyword';
import { useAppTrackStore } from '@store/app_track_store';

export type AdType = 'IMAGE_SEARCH' | 'DEFAULT';

class InterstitialService {
  private static instance: InterstitialService;
  private ad: InterstitialAd | null = null;
  private loaded = false;
  private isShowing = false;

  // 닫힘 이벤트 리스너 배열
  private closeListeners: (() => void)[] = [];

  // 광고 표시 시도 타임아웃 타이머 (표출 전 지연 방어용)
  private preShowTimeoutTimer: ReturnType<typeof setTimeout> | null = null;

  private constructor() {}

  public init() {
    this.createAndLoadAd();
  }

  public static getInstance(): InterstitialService {
    if (!InterstitialService.instance) {
      InterstitialService.instance = new InterstitialService();
    }
    return InterstitialService.instance;
  }

  /**
   * 대기 중인 닫힘 리스너들을 iOS 네이티브 모달 닫기 애니메이션 완료(150ms) 후 일괄 실행합니다.
   */
  private flushCloseListeners() {
    if (this.preShowTimeoutTimer) {
      clearTimeout(this.preShowTimeoutTimer);
      this.preShowTimeoutTimer = null;
    }
    const listeners = [...this.closeListeners];
    this.closeListeners = [];

    // 150ms 지연을 주어 iOS UIKit 모달 닫힘 애니메이션 완료 후 실행 (Navigation Race Condition 방지)
    setTimeout(() => {
      listeners.forEach((listener) => {
        try {
          listener();
        } catch (err) {
          logger.error(`Error in ad close listener: ${err}`);
        }
      });
    }, 150);
  }

  /**
   * InterstitialAd 인스턴스는 1회용이므로, 로드/재로드 시마다 새로운 인스턴스를 생성합니다.
   */
  private createAndLoadAd() {
    if (!AD_UNITS.INTERSTITIAL) return;

    this.loaded = false;

    this.ad = InterstitialAd.createForAdRequest(AD_UNITS.INTERSTITIAL, {
      keywords: ADS_KEYWORDS,
      requestNonPersonalizedAdsOnly: true,
    });

    this.ad.addAdEventListener(AdEventType.LOADED, () => {
      logger.info('Interstitial Ad Loaded');
      this.loaded = true;
    });

    this.ad.addAdEventListener(AdEventType.OPENED, () => {
      logger.info('Interstitial Ad Opened');
    });

    this.ad.addAdEventListener(AdEventType.ERROR, (error) => {
      logger.error(`Interstitial Ad Error: ${error}`);
      this.loaded = false;
      this.isShowing = false;

      // 에러 발생 시 대기 중인 리스너 실행하여 블로킹 해제
      this.flushCloseListeners();

      // 개발 환경에서는 터미널 연속 에러 방지를 위해 1시간 후 재시도, 운영에서는 10초 후 재시도
      const retryTime = __DEV__ ? 3600000 : 10000;
      setTimeout(() => this.createAndLoadAd(), retryTime);
    });

    this.ad.addAdEventListener(AdEventType.CLOSED, () => {
      logger.info('Interstitial Ad Closed');
      this.loaded = false;
      this.isShowing = false;

      // 닫힘 이벤트 수신 시 리스너 실행 (150ms iOS dismissal delay 내포)
      this.flushCloseListeners();

      // 닫힌 후 새 인스턴스로 다음 광고 미리 로드
      this.createAndLoadAd();
    });

    this.ad.load();
  }

  public load() {
    if (!this.loaded && !this.isShowing) {
      this.createAndLoadAd();
    }
  }

  public reload() {
    this.createAndLoadAd();
  }

  public isLoaded(): boolean {
    return this.loaded;
  }

  /**
   * 광고 타입별 호출 횟수를 증가시키고, 노출 주기에 해당하는지 검사합니다.
   * - 첫 검색 시 무조건 노출
   * - 이후 IMAGE_SEARCH: 2회마다 1회 노출 (0, 2, 4...)
   */
  private shouldShowAdForType(type: AdType): boolean {
    const { image_search: imageSearchCount } =
      useAppTrackStore.getState().coreActionCounts;

    switch (type) {
      case 'IMAGE_SEARCH':
        return imageSearchCount % 2 === 0;

      default:
        return true;
    }
  }

  /**
   * 광고 표시. 표시 불가 또는 예외 발생 시 즉시 콜백을 실행해 앱 흐름 유지
   * @param type 광고 타입 (횟수 체크용)
   * @param onClose 광고 닫힘(또는 표시 불가) 시 실행할 콜백
   * @param onOpened 광고가 화면에 나타났을 때(또는 표시 불가) 실행할 콜백
   */
  public async show(type: AdType = 'DEFAULT', onClose?: () => void) {
    if (!this.shouldShowAdForType(type)) {
      onClose?.();
      return;
    }

    if (!this.loaded || !this.ad || this.isShowing) {
      logger.warn('Interstitial Ad is not loaded or already showing.');
      onClose?.();
      return;
    }

    if (onClose) {
      this.closeListeners.push(onClose);
    }

    this.isShowing = true;

    // 2.5초 표출 시도 타임아웃: 네이티브 뷰가 뜨지 않을 때만 동작 (AdMob 정책 준수)
    this.preShowTimeoutTimer = setTimeout(() => {
      logger.warn(
        'Interstitial Ad pre-show timeout expired. Skipping ad display.',
      );
      this.isShowing = false;
      this.loaded = false;
      this.flushCloseListeners();
      this.createAndLoadAd();
    }, 2500);

    try {
      await this.ad.show();
      // 광고 표출 성공 시 즉시 타임아웃 해제 (AdMob 정책 준수: 유저가 보고 있는 동안 강제 닫기 방지)
      if (this.preShowTimeoutTimer) {
        clearTimeout(this.preShowTimeoutTimer);
        this.preShowTimeoutTimer = null;
      }
    } catch (error) {
      logger.error(`Failed to show Interstitial Ad: ${error}`);
      this.isShowing = false;
      this.loaded = false;
      this.flushCloseListeners();
      this.createAndLoadAd();
    }
  }
}

export const interstitialService = InterstitialService.getInstance();
