import React from 'react';
import { View, TouchableOpacity, Modal, Linking } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '../../styles/organisms/CameraScreen';

interface CameraPermissionAlertProps {
  visible: boolean;
  onClose: () => void;
  onCancel: () => void;
}

// 카메라 권한 거부 시 설정 화면으로 유도하는 커스텀 알림 모달
export const CameraPermissionAlert = ({
  visible,
  onClose,
  onCancel,
}: CameraPermissionAlertProps) => {
  // 렌더링 조건 방어 로직
  if (!visible) return null;

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.alertOverlay}>
        <View style={styles.alertBox}>
          {/* 타이틀 */}
          <BaseText size={18} weight="bold" style={styles.alertTitle}>
            권한 안내
          </BaseText>
          {/* 안내 메시지 */}
          <BaseText size={15} style={styles.alertMessage}>
            알약 촬영을 위해 카메라 접근 권한이 필요합니다.{'\n'}기기 설정에서
            권한을 직접 허용해 주세요.
          </BaseText>
          {/* 하단 버튼 영역 */}
          <View style={styles.alertButtonRow}>
            {/* 취소 버튼 */}
            <TouchableOpacity
              style={[styles.alertButton, styles.alertCancelButton]}
              onPress={onCancel}
            >
              <BaseText size={16} weight="bold" style={styles.alertCancelText}>
                취소
              </BaseText>
            </TouchableOpacity>
            {/* 설정으로 이동 버튼 */}
            <TouchableOpacity
              style={[styles.alertButton, styles.alertConfirmButton]}
              onPress={() => {
                Linking.openSettings();
                onClose();
              }}
            >
              <BaseText size={16} weight="bold" style={styles.alertConfirmText}>
                설정으로 이동
              </BaseText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
