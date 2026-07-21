import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';
import logger from '@utils/logger';

/**
 * Mobile Ads SDK 설정 및 초기화
 */
export const initAdMob = () => {
  // 아웃바운드 설정
  mobileAds()
    .setRequestConfiguration({
      // 표시광고 등급설정
      maxAdContentRating: MaxAdContentRating.T,
      // 아동 대상 설정
      tagForChildDirectedTreatment: false,
      // 연령 미달 설정
      tagForUnderAgeOfConsent: false,
      // 테스트 광고 대상 기기 설정
      testDeviceIdentifiers: ['EMULATOR'],
    })
    .catch((error) => {
      logger.error(`AdMob Config Error: ${error}`);
    })
    .then(() => {
      logger.info('AdMob Config Success');
    });

  // google admob 초기화 (사전 실행 필수)
  mobileAds()
    .initialize()
    .then((status) => {
      console.log(`AdMob SDK Initialization complete: ${status}`);
    })
    .catch((error) => {
      logger.error(`AdMob SDK Initialization Error: ${error}`);
    });
};
