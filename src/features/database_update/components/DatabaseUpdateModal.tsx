import React from 'react';
import { View, Modal } from 'react-native';
import { useAppInitStore } from '../store/app_init_store';
import { styles } from '../styles/DatabaseUpdateModal.styles';
import { ModalHeader } from './DatabaseUpdateModal/ModalHeader';
import { ActionButtons } from './DatabaseUpdateModal/ActionButtons';

// 데이터베이스 업데이트 확인 커스텀 모달 컴포넌트
const DatabaseUpdateModal = () => {
  const { updateModalData, updateModalResolve, setUpdateModal } =
    useAppInitStore();

  if (!updateModalData || !updateModalResolve) {
    return null;
  }

  const handleConfirm = () => {
    updateModalResolve(true);
    setUpdateModal(null, null);
  };

  const handleCancel = () => {
    updateModalResolve(false);
    setUpdateModal(null, null);
  };

  return (
    <Modal transparent animationType="fade" visible={true}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ModalHeader />
          <ActionButtons onCancel={handleCancel} onConfirm={handleConfirm} />
        </View>
      </View>
    </Modal>
  );
};

export default DatabaseUpdateModal;
