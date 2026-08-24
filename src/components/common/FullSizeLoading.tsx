import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator, BackHandler, Platform } from 'react-native';
import { styles } from './styles/FullSizeLoading';
import { COLOR } from '@constants/color';
import { BaseText } from './BaseText';
import { useFullLoadingStore } from '@store/full_loading_store';
import { useToast } from '@hooks/use_toast';

const FullSizeLoading = () => {
  const { isLoading, message, setHide } = useFullLoadingStore();
  const backPressTime = useRef<number>(0);
  const { showToast, hideToast } = useToast();

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    if (Platform.OS !== 'android') {
      return;
    }

    const onBackPress = () => {
      const currentTime = new Date().getTime();

      if (currentTime - backPressTime.current < 2000) {
        hideToast();
        setHide();
        return true;
      }

      backPressTime.current = currentTime;

      showToast({
        type: 'default',
        message: '작업을 종료 하시겠습니까?',
      });
      return true;
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );
    return () => {
      subscription.remove();
    };
  }, [isLoading]);

  if (!isLoading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color={COLOR['secondary']} />
        {message && (
          <BaseText weight={'semiBold'} size={16} style={styles.message}>
            {message}
          </BaseText>
        )}
      </View>
    </View>
  );
};

export default FullSizeLoading;
