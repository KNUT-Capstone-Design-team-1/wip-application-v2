import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import { AD_UNITS } from '../constants/ad_units';
import logger from '@utils/logger';
import { ADS_KEYWORDS } from '../constants/keyword';
import { useAppTrackStore } from '@store/app_track_store';

export type AdType = 'IMAGE_SEARCH' | 'DEFAULT';

let ad: InterstitialAd | null = null;
let loaded = false;
let isShowing = false;
let closeListeners: (() => void)[] = [];
let preShowTimeoutTimer: ReturnType<typeof setTimeout> | null = null;

const flushCloseListeners = () => {
  if (preShowTimeoutTimer) {
    clearTimeout(preShowTimeoutTimer);
    preShowTimeoutTimer = null;
  }
  const listeners = [...closeListeners];
  closeListeners = [];

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
};

const createAndLoadAd = () => {
  if (!AD_UNITS.INTERSTITIAL) return;

  loaded = false;

  ad = InterstitialAd.createForAdRequest(AD_UNITS.INTERSTITIAL, {
    keywords: ADS_KEYWORDS,
    requestNonPersonalizedAdsOnly: true,
  });

  ad.addAdEventListener(AdEventType.LOADED, () => {
    loaded = true;
  });

  ad.addAdEventListener(AdEventType.OPENED, () => {});

  ad.addAdEventListener(AdEventType.ERROR, (error) => {
    logger.error(`Interstitial Ad Error: ${error}`);
    loaded = false;
    isShowing = false;

    // 에러 발생 시 대기 중인 리스너 실행하여 블로킹 해제
    flushCloseListeners();

    // 개발 환경에서는 터미널 연속 에러 방지를 위해 1시간 후 재시도, 운영에서는 10초 후 재시도
    const retryTime = __DEV__ ? 3600000 : 10000;
    setTimeout(() => createAndLoadAd(), retryTime);
  });

  ad.addAdEventListener(AdEventType.CLOSED, () => {
    loaded = false;
    isShowing = false;

    // 닫힘 이벤트 수신 시 리스너 실행 (150ms iOS dismissal delay 내포)
    flushCloseListeners();

    // 닫힌 후 새 인스턴스로 다음 광고 미리 로드
    createAndLoadAd();
  });

  ad.load();
};

const shouldShowAdForType = (type: AdType): boolean => {
  const { image_search: imageSearchCount } =
    useAppTrackStore.getState().coreActionCounts;

  switch (type) {
    case 'IMAGE_SEARCH':
      return imageSearchCount % 2 === 0;

    default:
      return true;
  }
};

export const interstitialService = {
  init(): void {
    createAndLoadAd();
  },

  load(): void {
    if (!loaded && !isShowing) {
      createAndLoadAd();
    }
  },

  reload(): void {
    createAndLoadAd();
  },

  isLoaded(): boolean {
    return loaded;
  },

  /**
   * 광고 표시. 표시 불가 또는 예외 발생 시 즉시 콜백을 실행해 앱 흐름 유지
   * @param type 광고 타입 (횟수 체크용)
   * @param onClose 광고 닫힘(또는 표시 불가) 시 실행할 콜백
   */
  async show(type: AdType = 'DEFAULT', onClose?: () => void): Promise<void> {
    if (!shouldShowAdForType(type)) {
      onClose?.();
      return;
    }

    if (!loaded || !ad || isShowing) {
      logger.warn('Interstitial Ad is not loaded or already showing.');
      onClose?.();
      return;
    }

    if (onClose) {
      closeListeners.push(onClose);
    }

    isShowing = true;

    // 2.5초 표출 시도 타임아웃: 네이티브 뷰가 뜨지 않을 때만 동작 (AdMob 정책 준수)
    preShowTimeoutTimer = setTimeout(() => {
      logger.warn(
        'Interstitial Ad pre-show timeout expired. Skipping ad display.',
      );
      isShowing = false;
      loaded = false;
      flushCloseListeners();
      createAndLoadAd();
    }, 2500);

    try {
      await ad.show();
      // 광고 표출 성공 시 즉시 타임아웃 해제 (AdMob 정책 준수: 유저가 보고 있는 동안 강제 닫기 방지)
      if (preShowTimeoutTimer) {
        clearTimeout(preShowTimeoutTimer);
        preShowTimeoutTimer = null;
      }
    } catch (error) {
      logger.error(`Failed to show Interstitial Ad: ${error}`);
      isShowing = false;
      loaded = false;
      flushCloseListeners();
      createAndLoadAd();
    }
  },
};
