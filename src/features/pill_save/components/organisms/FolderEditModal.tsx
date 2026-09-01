import React from 'react';
import {
  View,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { styles as commonStyles } from '@components/common/styles/CommonModal';
import { styles } from '@features/pill_save/styles/organisms/FolderEditModal';
import { FolderEditModalContent } from '@features/pill_save/components/molecules/FolderEditModalContent';

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
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={onCancel}>
          <View style={[commonStyles.container, styles.containerOverride]}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation?.()}>
              <FolderEditModalContent
                isAdding={isAdding}
                folderInputName={folderInputName}
                setFolderInputName={setFolderInputName}
                onCancel={onCancel}
                onConfirm={onConfirm}
              />
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};
