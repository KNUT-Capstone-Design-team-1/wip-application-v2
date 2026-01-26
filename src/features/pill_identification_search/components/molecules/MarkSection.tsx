import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import Button from '../atoms/Button';
import { COLOR_PRIMARY } from '@/src/constants';
import { styles } from '../../styles/molecules/MarkSection';
import { useMarkModal } from '../../hooks/use_mark_modal';
import MarkModal from '../organisms/MarkModal';

const MarkSection = () => {
  const {
    modalState,
    selectedMarkBase64,
    openMarkModal,
    closeMarkModal,
    deleteSelectedMark,
  } = useMarkModal();

  return (
    <View style={styles.selectMarkContainer}>
      {/* 마크 선택 Modal */}
      <Modal visible={modalState} transparent animationType="slide">
        <MarkModal onClose={closeMarkModal} />
      </Modal>

      {/* 선택된 마크 표시 */}
      <View style={styles.markResultContainer}>
        <Text style={styles.markResult}>선택된 마크:</Text>
        {selectedMarkBase64 === '' ? (
          <Text style={styles.markResult}>선택 없음</Text>
        ) : (
          <View style={styles.markImageWrapper}>
            <TouchableOpacity onPress={deleteSelectedMark}>
              <Text style={styles.selectedMarkDelete}>✕</Text>
            </TouchableOpacity>
            <Image
              source={{ uri: selectedMarkBase64 }}
              style={styles.markImage}
              contentFit="contain"
            />
          </View>
        )}
      </View>

      {/* 마크 선택 버튼 */}
      <Button
        label="마크 선택하기"
        pressHandler={openMarkModal}
        background="#fff"
        color={COLOR_PRIMARY[100]}
        width="100%"
      />
    </View>
  );
};

export default MarkSection;
