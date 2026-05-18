import { useState, useCallback } from 'react';

interface IToastState {
  visible: boolean;
  message: string;
}

/**
 * Toast 메시지를 관리하는 Hook
 * @returns showToast, hideToast, toastState
 */
export const useToast = () => {
  const [toastState, setToastState] = useState<IToastState>({
    visible: false,
    message: '',
  });

  /**
   * Toast 메시지 표시
   * @param message 표시할 메시지
   */
  const showToast = useCallback((message: string) => {
    setToastState({
      visible: true,
      message,
    });
  }, []);

  /**
   * Toast 메시지 숨김
   */
  const hideToast = useCallback(() => {
    setToastState({
      visible: false,
      message: '',
    });
  }, []);

  return {
    showToast,
    hideToast,
    toastState,
  };
};
