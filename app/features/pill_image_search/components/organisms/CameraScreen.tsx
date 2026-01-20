import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { styles } from '../../styles/organisms/CameraScreen';
import { useCameraCapture } from '../../hooks/useCameraCapture';

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
  const { hasPermission, requestPermission } = useCameraPermission();

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
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={visible}
          photo={true}
        />

        {/* 상단 이미지 슬롯 오버레이 */}
        <View style={styles.topOverlay}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
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
                  <Text style={styles.emptyText}>+</Text>
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
                  <Text style={styles.emptyText}>+</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* 하단 촬영 버튼 */}
        <View style={styles.bottomOverlay}>
          <TouchableOpacity style={styles.captureButton} onPress={capturePhoto}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CameraScreen;
