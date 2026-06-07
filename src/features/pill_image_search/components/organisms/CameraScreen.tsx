import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
} from 'react-native-vision-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../../styles/organisms/CameraScreen';
import { useCameraCapture } from '../../hooks/useCameraCapture';
import { Plus, X } from 'lucide-react-native';
import { COLOR } from '@constants/color';
import { fontPx } from '@utils/responsive';

interface CameraScreenProps {
  visible: boolean;
  onClose: () => void;
  onCapture: (imageUri: string) => void;
  frontImage: string | null;
  backImage: string | null;
  mode: 'camera' | 'album';
}

const CameraScreen = ({
  visible,
  onClose,
  onCapture,
  frontImage,
  backImage,
}: CameraScreenProps) => {
  const device = useCameraDevice('back');
  const format = useCameraFormat(device, [
    { photoAspectRatio: 1 / 1 },
    { photoResolution: { width: 768, height: 768 } },
  ]);
  const { hasPermission, requestPermission } = useCameraPermission();
  const insets = useSafeAreaInsets();

  const { cameraRef, capturePhoto } = useCameraCapture({
    onCapture,
  });

  useEffect(() => {
    if (visible && !hasPermission) {
      requestPermission();
    }
  }, [visible, hasPermission]);

  if (!visible) return null;
  if (!hasPermission) return null;
  if (!device) return null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* 상단 이미지 슬롯 오버레이 */}
        <View
          style={[styles.topOverlay, { paddingTop: Math.max(insets.top, 20) }]}
        >
          <TouchableOpacity
            style={[styles.closeButton, { top: Math.max(insets.top, 20) + 10 }]}
            onPress={onClose}
          >
            <X size={fontPx(24)} color={COLOR['white']} strokeWidth={3} />
          </TouchableOpacity>

          <Text style={styles.title}>알약 검색</Text>

          <View style={styles.slotsWrapper}>
            {/* 앞면 */}
            <View style={styles.slot}>
              <Text style={styles.label}>앞면</Text>
              {frontImage ? (
                <Image source={{ uri: frontImage }} style={styles.slotImage} />
              ) : (
                <View style={styles.emptySlot}>
                  <Plus
                    size={fontPx(24)}
                    color={COLOR['white']}
                    strokeWidth={2}
                  />
                </View>
              )}
            </View>

            {/* 뒷면 */}
            <View style={styles.slot}>
              <Text style={styles.label}>뒷면</Text>
              {backImage ? (
                <Image source={{ uri: backImage }} style={styles.slotImage} />
              ) : (
                <View style={styles.emptySlot}>
                  <Plus
                    size={fontPx(24)}
                    color={COLOR['white']}
                    strokeWidth={2}
                  />
                </View>
              )}
            </View>
          </View>
        </View>

        <Camera
          ref={cameraRef}
          style={{ flex: 1 }}
          device={device}
          isActive={visible}
          photo={true}
          format={format}
          photoQualityBalance="balanced"
        />

        {/* 하단 촬영 버튼 */}
        <View
          style={[
            styles.bottomOverlay,
            { paddingBottom: Math.max(insets.bottom, 40) },
          ]}
        >
          <TouchableOpacity style={styles.captureButton} onPress={capturePhoto}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CameraScreen;
