import { useCallback } from 'react';
import Toast from 'react-native-toast-message';

type TToastShowProps = {
  type?: 'success' | 'error' | 'default';
  message: string;
  duration?: number;
};

/**
 * Toast 메시지를 관리하는 Hook
 */
export const useToast = () => {
  /**
   * Toast 메시지 표시
   * @param type toast 타입 ('success', 'error', 'default'). 기본값 'default'
   * @param message 표시할 메시지
   * @param duration 노출 시간 (ms). 기본값: 2000 (2초)
   */
  const showToast = useCallback(
    ({ type, message, duration = 2000 }: TToastShowProps) => {
      Toast.show({
        type: type ?? 'default',
        text1: message,
        visibilityTime: duration,
      });
    },
    [],
  );

  /**
   * Toast 메시지 숨김
   */
  const hideToast = useCallback(() => {
    Toast.hide();
  }, []);

  return {
    showToast,
    hideToast,
  };
};
