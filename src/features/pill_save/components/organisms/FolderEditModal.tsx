import React from 'react';
import {
  View,
  TextInput,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles as commonStyles } from '@components/common/styles/CommonModal';
import { styles } from '@features/pill_save/styles/organisms/FolderEditModal';
import { COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

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
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={commonStyles.container}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation?.()}>
            <View style={commonStyles.content}>
              <BaseText weight="bold" size={18} style={commonStyles.title}>
                {isAdding ? '새 폴더 추가' : '폴더 이름 변경'}
              </BaseText>

              <TextInput
                style={[
                  styles.input,
                  {
                    width: '100%',
                    paddingHorizontal: 0,
                    paddingVertical: px(12),
                    color: COLOR_TEXT.title,
                    fontSize: px(15),
                    includeFontPadding: false,
                    textAlignVertical: 'center',
                  },
                ]}
                value={folderInputName}
                onChangeText={setFolderInputName}
                placeholder="폴더 이름 입력"
                placeholderTextColor={COLOR_TEXT.disabled}
                autoFocus
              />

              <View style={commonStyles.buttonContainer}>
                <TouchableOpacity
                  style={[commonStyles.button, commonStyles.cancelButton]}
                  onPress={onCancel}
                  activeOpacity={0.7}
                >
                  <BaseText
                    weight="semiBold"
                    size={15}
                    style={commonStyles.cancelButtonText}
                  >
                    취소
                  </BaseText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[commonStyles.button, commonStyles.confirmButton]}
                  onPress={onConfirm}
                  activeOpacity={0.7}
                >
                  <BaseText
                    weight="semiBold"
                    size={15}
                    style={commonStyles.confirmButtonText}
                  >
                    확인
                  </BaseText>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
