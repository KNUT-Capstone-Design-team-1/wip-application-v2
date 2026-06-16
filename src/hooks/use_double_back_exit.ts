import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';
import { BackHandler, Platform } from 'react-native';
import { useToast } from './use_toast';

export const useDoubleBackExit = () => {
  const backPressTime = useRef<number>(0);
  const { showToast, hideToast } = useToast();

  useFocusEffect(
    useCallback(() => {
      // iOS는 하드웨어 뒤로가기가 없으므로 이벤트 리스너를 달지 않음
      if (Platform.OS !== 'android') return;

      const onBackPress = () => {
        const currentTime = new Date().getTime();

        // 2초(2000ms) 이내에 다시 누른 경우
        if (currentTime - backPressTime.current < 2000) {
          // Toast 메시지가 떠 있다면 숨기고 앱 완전 종료
          hideToast();
          BackHandler.exitApp();
          return true; // 기본 동작(뒤로가기) 방지
        }

        // 첫 번째 누른 경우 또는 2초가 지난 후 누른 경우
        backPressTime.current = currentTime;

        // 이전 대화에서 세팅하신 Custom Toast를 띄워 사용자에게 알림
        showToast({
          type: 'default',
          message: '한 번 더 뒤로가기를 누르면 종료됩니다.',
        });

        return true; // 기본 동작 방지 (앱 종료 막기)
      };

      // 화면에 포커스될 때 리스너 등록
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      // 화면을 벗어날 때(unmount 또는 blur) 리스너 해제 방지(메모리 누수 및 오작동 예방)
      return () => subscription.remove();
    }, []),
  );
};
