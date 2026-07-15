import * as StoreReview from 'expo-store-review';
import logger from '@utils/logger';

/**
 * OS 자체 앱 마켓(App Store/Play Store) 리뷰 작성 모달을 호출
 * - 모달 노출 여부는 각 OS의 자체적인 빈도 제한 정책(Quota)을 따름
 * - 호출 즉시 노출되지 않을 수 있으며, 화면 전환 등의 애니메이션을 방해하지 않도록 적절한 지연 호출을 권장
 */
export const requestReview = async () => {
  try {
    const isAvailable = await StoreReview.isAvailableAsync();

    if (!isAvailable) {
      logger.info('Store review is not available on this device/environment.');
      return;
    }

    const hasAction = await StoreReview.hasAction();

    if (!hasAction) {
      logger.info('Store review action is not supported.');
      return;
    }

    await StoreReview.requestReview();
  } catch (error) {
    logger.error(`Failed to request store review: ${error}`);
  }
};
