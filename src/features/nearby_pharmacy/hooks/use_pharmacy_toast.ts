import { useCallback } from 'react';
import Toast from 'react-native-toast-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { bottomTabSize } from '@constants/size';
import { px } from '@utils/responsive';
import { TPharmacyToastProps } from '@features/nearby_pharmacy/types/pharmacy_ui_type';

// 주변 약국 화면 전용 토스트 위치를 관리하는 커스텀 훅
export const usePharmacyToast = () => {
  // 기기 하단 안전 영역 여백
  const insets = useSafeAreaInsets();

  // '영업중인 약국만 표시' 필터 컴포넌트 위치 기준 bottomOffset을 주입하여 토스트 노출
  const showToast = useCallback(
    ({ type = 'default', message, duration = 2000 }: TPharmacyToastProps) => {
      // 탭바 높이 + 하단 인셋 + 여백(8px) 기준으로 토스트 위치 계산
      const calculatedOffset = bottomTabSize.height + insets.bottom + px(8);

      Toast.show({
        type,
        text1: message,
        visibilityTime: duration,
        bottomOffset: calculatedOffset,
      });
    },
    [insets.bottom],
  );

  // 현재 노출 중인 토스트 메시지 숨김 함수
  const hideToast = useCallback(() => {
    Toast.hide();
  }, []);

  return {
    showToast,
    hideToast,
  };
};
