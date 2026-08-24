import React, { useEffect } from 'react';
import {
  View,
  BackHandler,
  Platform,
  StyleProp,
  ViewStyle,
  TouchableWithoutFeedback,
} from 'react-native';
import { styles } from './styles/CommonModal';

interface IBaseModalProps {
  visible: boolean;
  children: React.ReactNode;
  onBackPress?: () => void;
  onBackdropPress?: () => void;
  overlayStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

// 모든 모달의 공통적인 UI(투명한 배경, 가운데 둥근 박스)를 감싸는 컨테이너 컴포넌트
const BaseModal = ({
  visible,
  children,
  onBackPress,
  onBackdropPress,
  overlayStyle,
  contentStyle,
}: IBaseModalProps) => {
  useEffect(() => {
    if (!visible) {
      return; // 모달이 닫혀있으면 이벤트 등록 안 함
    }

    if (Platform.OS !== 'android') {
      return; // 안드로이드 기기에서만 하드웨어 뒤로가기 버튼 존재
    }

    // 뒤로가기 버튼 눌렀을 때의 동작
    const handleBackPress = () => {
      if (!onBackPress) {
        return false; // 콜백이 없으면 기본 동작 수행
      }

      onBackPress(); // 전달받은 닫기/취소 함수 실행
      return true; // 기본 뒤로가기 동작(앱 종료 등) 방지
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );

    return () => {
      subscription.remove(); // 언마운트 시 이벤트 해제
    };
  }, [visible, onBackPress]);

  // 보이지 않을 때는 아예 렌더링하지 않음
  if (!visible) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={onBackdropPress}>
      <View style={[styles.container, overlayStyle]}>
        <TouchableWithoutFeedback onPress={(e) => e.stopPropagation?.()}>
          <View style={[styles.content, contentStyle]}>{children}</View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default BaseModal;
