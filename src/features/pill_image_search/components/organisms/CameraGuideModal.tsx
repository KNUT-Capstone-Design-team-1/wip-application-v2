import React, { useEffect } from 'react';
import { BackHandler, Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { styles } from '../../styles/organisms/CameraGuideModal';
import ImageSearchGuide from './ImageSearchGuide';
import { X } from 'lucide-react-native';
import { fontPx } from '@utils/responsive';
import { COLOR_TEXT } from '@constants/color';
import { useCameraGuideModalStore } from '../../store/camera_guide_store';
import { useImageGuideActions } from '@features/pill_image_search/hooks/useImageGuideActions';

const CameraGuideModal = () => {
  const isGuideModalVisible = useCameraGuideModalStore(
    (state) => state.isGuideModalVisible,
  );
  const { handleGuideVisible } = useImageGuideActions();

  useEffect(() => {
    if (!isGuideModalVisible) return;

    const onBackPress = () => {
      handleGuideVisible(false);
      return true;
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );

    return () => subscription.remove();
  }, [isGuideModalVisible, handleGuideVisible]);

  if (!isGuideModalVisible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(100)}
      style={styles.container}
    >
      <Pressable
        style={styles.backdrop}
        onPress={() => handleGuideVisible(false)}
      >
        <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
          <ImageSearchGuide />
          <Pressable
            style={({ pressed }) => [
              styles.closeButton,
              pressed && { opacity: 0.4 },
            ]}
            onPress={() => handleGuideVisible(false)}
          >
            <X size={fontPx(24)} strokeWidth={3} color={COLOR_TEXT['sub']} />
          </Pressable>
        </Pressable>
      </Pressable>
    </Animated.View>
  );
};

export default CameraGuideModal;
