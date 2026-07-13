import React from 'react';
import { View, Modal, TouchableOpacity, Pressable } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import PillIdentificationSearchForm from './PillIdentificationSearchForm';
import { styles } from '@features/pill_identification_search/styles/organisms/PillIdentificationSearchModal';

interface IPillIdentificationSearchModalProps {
  visible: boolean;
  onClose: () => void;
}

const PillIdentificationSearchModal: React.FC<
  IPillIdentificationSearchModalProps
> = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <View style={styles.modalContainer}>
          {/* 헤더 */}
          <View style={styles.modalHeader}>
            <BaseText style={styles.modalTitle} size={18} weight="bold">
              식별 검색
            </BaseText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <BaseText style={styles.closeButtonText} size={24} weight="bold">
                ✕
              </BaseText>
            </TouchableOpacity>
          </View>

          {/* 폼 영역 */}
          <PillIdentificationSearchForm onSearchComplete={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default PillIdentificationSearchModal;
