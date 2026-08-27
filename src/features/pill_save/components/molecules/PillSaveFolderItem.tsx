import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { COLOR_TEXT } from '@constants/color';
import { ChevronRight } from 'lucide-react-native';
import { fontPx } from '@utils/responsive';
import { ISavedPillFolder } from '@services/database/types';
import { FolderIconPreview } from '@features/pill_save/components/atoms/FolderIconPreview';
import { styles } from '@features/pill_save/styles/molecules/PillSaveFolderItem';

interface IPillSaveFolderItemProps {
  item: ISavedPillFolder & { pill_count: number; preview_images?: string[] };
  onPress: () => void;
}

// 폴더 목록 화면에서 보여지는 개별 폴더 리스트 아이템 컴포넌트
export const PillSaveFolderItem = ({
  item,
  onPress,
}: IPillSaveFolderItemProps) => (
  <TouchableOpacity
    style={styles.folderItemWrapper}
    activeOpacity={0.7}
    onPress={onPress}
  >
    <FolderIconPreview images={item.preview_images} />
    <View style={styles.folderInfoContainer}>
      <BaseText
        size={18}
        weight="bold"
        style={styles.folderName}
        numberOfLines={1}
      >
        {item.name}
      </BaseText>
      <View style={styles.separator} />
      <BaseText size={14} style={styles.folderCount}>
        알약 {item.pill_count}개
      </BaseText>
    </View>
    <ChevronRight size={fontPx(20)} color={COLOR_TEXT['disabled']} />
  </TouchableOpacity>
);
