import React, { useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import { styles } from '../styles/Toast';

interface IToastProps {
  message: string;
  visible: boolean;
  duration?: number;
  onHide: () => void;
}

const Toast = ({ message, visible, duration = 2000, onHide }: IToastProps) => {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
      // 아래에서 위로 슬라이드업 + 페이드 인
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // 지정된 시간 후 페이드 아웃 + 아래로 슬라이드
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 50,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onHide();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, opacity, translateY, onHide]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={[styles.toastContainer, { opacity, transform: [{ translateY }] }]}
    >
      <View style={styles.toastContent}>
        <Text style={styles.toastText}>{message}</Text>
      </View>
    </Animated.View>
  );
};

export default Toast;
