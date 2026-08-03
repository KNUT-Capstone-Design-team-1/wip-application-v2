import { useCallback } from 'react';
import { interstitialService, AdType } from '../services/interstitial_service';

export const useInterstitialAd = () => {
  /**
   * 광고 노출 후 콜백(action) 실행
   * 미로드 상태면 지연 없이 바로 action 실행
   */
  const showInterstitial = useCallback(
    async (action: () => void, type: AdType = 'DEFAULT') => {
      await interstitialService.show(type, () => {
        action();
      });
    },
    [],
  );

  return { showInterstitial };
};
