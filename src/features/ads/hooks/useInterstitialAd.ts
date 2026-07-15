import { useCallback, useEffect } from 'react';
import { interstitialService } from '../services/interstitial_service';

export const useInterstitialAd = () => {
  // 앱 실행 시점 등에서 미리 로드하기 위해 컴포넌트 마운트 시 확인
  useEffect(() => {
    interstitialService.load();
  }, []);

  /**
   * 광고 노출 후 콜백(action) 실행
   * 미로드 상태면 지연 없이 바로 action 실행
   */
  const showInterstitial = useCallback((action: () => void) => {
    interstitialService.show(() => {
      action();
    });
  }, []);

  return { showInterstitial, isLoaded: interstitialService.isLoaded() };
};
