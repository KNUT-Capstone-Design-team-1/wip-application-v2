import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';
import { interstitialService } from '@features/ads/services/interstitial_service';
import logger from '@utils/logger';

/**
 * Mobile Ads SDK 설정 및 초기화
 */
export const initAdMob = async () => {
  try {
    // 아웃바운드 설정
    await mobileAds().setRequestConfiguration({
      // 표시광고 등급설정
      maxAdContentRating: MaxAdContentRating.T,
      // 아동 대상 설정
      tagForChildDirectedTreatment: false,
      // 연령 미달 설정
      tagForUnderAgeOfConsent: false,
      // 테스트 광고 대상 기기 설정
      testDeviceIdentifiers: ['EMULATOR'],
    });

    console.log('AdMob Config Success');

    // google admob 초기화 (사전 실행 필수)
    await mobileAds().initialize();

    // interstital 광고 객체 초기화 (광고 요청 대기)
    interstitialService.init();
  } catch (e) {
    logger.error(`admob config fail : ${e}`);
  }
};
