import React, { memo } from 'react';
import { Animated, View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '@features/pill_reminder/styles/atoms/ModalToast';

interface IModalToastProps {
  message: string;
  visible: boolean;
  opacity: Animated.Value;
}

// 모달 내부에서 최상단에 뜨는 공통 토스트 컴포넌트
export const ModalToast = memo(
  ({ message, visible, opacity }: IModalToastProps) => {
    const isHidden = !visible || !message;

    if (isHidden) {
      return null;
    }

    return (
      <View style={styles.container} pointerEvents="none">
        <Animated.View style={[styles.content, { opacity }]}>
          <BaseText weight="medium" size={14} style={styles.text}>
            {message}
          </BaseText>
        </Animated.View>
      </View>
    );
  },
);

ModalToast.displayName = 'ModalToast';
