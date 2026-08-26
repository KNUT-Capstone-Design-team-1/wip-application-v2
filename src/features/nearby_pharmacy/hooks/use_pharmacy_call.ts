import { useCallback } from 'react';
import { Linking } from 'react-native';
import { useToast } from '@hooks/use_toast';
import logger from '@utils/logger';

/**
 * 약국 전화번호로 다이얼러 실행.
 * PharmacyInfoCard, PharmacyClusterList 등에서 공통으로 사용.
 */
export const usePharmacyCall = () => {
  const { showToast } = useToast();

  const callPharmacy = useCallback(
    async (telephone: string) => {
      const digits = telephone.replace(/[^0-9+*#]/g, '');
      if (!digits) {
        return;
      }

      try {
        await Linking.openURL(`tel:${digits}`);
      } catch (e) {
        logger.error(`Failed to open dialer. ${e?.stack || e}`);
        showToast({ type: 'error', message: '전화 앱을 열 수 없습니다.' });
      }
    },
    [showToast],
  );

  return { callPharmacy };
};
