import { useState, useRef, useCallback } from 'react';
import { Animated } from 'react-native';

// 모달 내부에서 자연스럽게 페이드 인/아웃되는 토스트 훅
export const useModalToast = () => {
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const showModalToast = useCallback(
    (message: string, duration = 2000) => {
      const hasTimer = timerRef.current !== null;

      if (hasTimer && timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setToastMessage(message);
      setIsToastVisible(true);

      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      timerRef.current = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setIsToastVisible(false);
          setToastMessage('');
        });
      }, duration);
    },
    [opacity],
  );

  return {
    toastMessage,
    isToastVisible,
    toastOpacity: opacity,
    showModalToast,
  };
};
