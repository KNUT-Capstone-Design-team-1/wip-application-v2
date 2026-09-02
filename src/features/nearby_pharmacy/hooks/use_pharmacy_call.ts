import { useCallback } from 'react';
import { Linking } from 'react-native';
import { useToast } from '@hooks/use_toast';
import logger from '@utils/logger';

// 약국 전화 걸기 기능을 제공하는 커스텀 훅
export const usePharmacyCall = () => {
  const { showToast } = useToast();

  const callPharmacy = useCallback(
    async (telephone: string) => {
      const digits = telephone.replace(/[^0-9+*#]/g, '');
      const hasNoDigits = !digits;

      if (hasNoDigits) {
        return;
      }

      try {
        await Linking.openURL(`tel:${digits}`);
      } catch (e) {
        logger.error(`Failed to open dialer. ${e}`);
        showToast({ type: 'error', message: '전화 앱을 열 수 없습니다.' });
      }
    },
    [showToast],
  );

  return { callPharmacy };
};
