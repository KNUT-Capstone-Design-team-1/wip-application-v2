import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { COLOR_TEXT } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { Plus } from 'lucide-react-native';
import { styles } from '@features/pill_save/styles/molecules/FolderSelectModalHeader';

// 모달 상단 타이틀 및 추가 버튼 컴포넌트
export const FolderSelectModalHeader = ({
  title = '폴더 선택',
  onAddFolder,
  hideAddButton,
}: {
  title?: string;
  onAddFolder: () => void;
  hideAddButton?: boolean;
}) => (
  <View style={styles.header}>
    <BaseText size={18} weight="bold" style={styles.title}>
      {title}
    </BaseText>
    {!hideAddButton && (
      <TouchableOpacity onPress={onAddFolder} style={styles.closeBtn}>
        <Plus size={fontPx(22)} color={COLOR_TEXT['title']} />
      </TouchableOpacity>
    )}
  </View>
);
