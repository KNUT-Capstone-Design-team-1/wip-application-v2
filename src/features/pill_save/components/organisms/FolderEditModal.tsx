import React from 'react';
import { View, TextInput, Modal, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '@features/pill_save/styles/organisms/FolderEditModal';

interface IFolderEditModalProps {
  visible: boolean;
  isAdding: boolean;
  folderInputName: string;
  setFolderInputName: (text: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

// 폴더 추가 및 이름 변경 시 사용하는 모달 컴포넌트
export const FolderEditModal = ({
  visible,
  isAdding,
  folderInputName,
  setFolderInputName,
  onCancel,
  onConfirm,
}: IFolderEditModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <BaseText size={16} weight="bold" style={styles.title}>
            {isAdding ? '새 폴더 추가' : '폴더 이름 변경'}
          </BaseText>
          <TextInput
            style={styles.input}
            value={folderInputName}
            onChangeText={setFolderInputName}
            placeholder="폴더 이름 입력"
            autoFocus
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onCancel}>
              <BaseText size={14} weight="medium" style={styles.cancelText}>
                취소
              </BaseText>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm}>
              <BaseText size={14} weight="bold" style={styles.confirmText}>
                확인
              </BaseText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
