import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles as commonStyles } from '@components/common/styles/CommonModal';
import { styles } from '@features/pill_save/styles/organisms/FolderEditModal';
import { COLOR_TEXT } from '@constants/color';

interface IFolderEditModalContentProps {
  isAdding: boolean;
  folderInputName: string;
  setFolderInputName: (text: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

// 폴더 추가 및 이름 변경 모달의 내부 UI (타이틀, 입력창, 버튼)를 담당하는 컴포넌트
export const FolderEditModalContent = ({
  isAdding,
  folderInputName,
  setFolderInputName,
  onCancel,
  onConfirm,
}: IFolderEditModalContentProps) => {
  return (
    <View style={commonStyles.content}>
      <BaseText weight="bold" size={18} style={commonStyles.title}>
        {isAdding ? '새 폴더 추가' : '폴더 이름 변경'}
      </BaseText>

      <TextInput
        style={styles.input}
        value={folderInputName}
        onChangeText={setFolderInputName}
        placeholder="폴더 이름 입력"
        placeholderTextColor={COLOR_TEXT.disabled}
        maxLength={255}
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
  );
};
