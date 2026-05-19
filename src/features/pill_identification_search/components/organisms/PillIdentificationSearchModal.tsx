import React from 'react';
import { View, Text, Modal, TouchableOpacity, Pressable } from 'react-native';
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
            <Text style={styles.modalTitle}>식별 검색</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
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
