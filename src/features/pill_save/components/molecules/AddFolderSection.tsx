import React from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { COLOR, COLOR_TEXT } from '@constants/color';
import { styles } from '@features/pill_save/styles/molecules/AddFolderSection';

// 폴더 선택 모달에서 새 폴더를 추가하는 영역 컴포넌트
export const AddFolderSection = ({
  isAdding,
  setIsAdding,
  newFolderName,
  setNewFolderName,
  handleCreateFolder,
}: {
  isAdding: boolean;
  setIsAdding: (val: boolean) => void;
  newFolderName: string;
  setNewFolderName: (val: string) => void;
  handleCreateFolder: () => void;
}) => {
  if (isAdding) {
    return (
      <View style={styles.addFolderContainer}>
        <TextInput
          style={styles.addFolderInput}
          value={newFolderName}
          onChangeText={setNewFolderName}
          placeholder="새 폴더 이름"
          placeholderTextColor={COLOR_TEXT['disabled']}
          maxLength={255}
          autoFocus
        />
        <TouchableOpacity
          onPress={handleCreateFolder}
          style={styles.addFolderConfirmBtn}
        >
          <BaseText size={14} weight="bold" style={styles.buttonText}>
            추가
          </BaseText>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
};
