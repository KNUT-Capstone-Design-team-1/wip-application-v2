import { useCallback } from 'react';
import { useToast } from '@hooks/use_toast';
import { pharmacyActionService } from '@features/nearby_pharmacy/services/pharmacy_action_service';

// 약국 전화 걸기 기능을 제공하는 커스텀 훅 (Presentation Layer)
export const usePharmacyCall = () => {
  const { showToast } = useToast();

  // 지정된 전화번호로 전화 걸기 핸들러
  const callPharmacy = useCallback(
    async (telephone: string) => {
      const digits = pharmacyActionService.formatPhoneNumber(telephone);
      const hasNoDigits = !digits;

      if (hasNoDigits) {
        return;
      }

      const isSuccess = await pharmacyActionService.callPharmacy(telephone);
      if (!isSuccess) {
        showToast({ type: 'error', message: '전화 앱을 열 수 없습니다.' });
      }
    },
    [showToast],
  );

  return { callPharmacy };
};
