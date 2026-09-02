import React, { memo } from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { COLOR } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { Check } from 'lucide-react-native';
import {
  FolderSortOption,
  FOLDER_SORT_OPTIONS,
} from '@features/pill_save/constants/pill_save_constant';
import { styles } from '@features/pill_save/styles/organisms/FolderSortModal';

interface IFolderSortModalProps {
  visible: boolean;
  onClose: () => void;
  currentSort: FolderSortOption;
  onSortChange: (sort: FolderSortOption) => void;
}

// 폴더 정렬 모달 컴포넌트
export const FolderSortModal = memo(
  ({ visible, onClose, currentSort, onSortChange }: IFolderSortModalProps) => {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <BaseText size={18} weight="bold" style={styles.headerTitle}>
                정렬 기준
              </BaseText>
            </View>
            {FOLDER_SORT_OPTIONS.map((option) => {
              const isSelected = currentSort === option.value;

              return (
                <TouchableOpacity
                  key={option.value}
                  style={styles.sortItem}
                  onPress={() => onSortChange(option.value)}
                  activeOpacity={0.7}
                >
                  <BaseText
                    size={16}
                    weight={isSelected ? 'bold' : 'medium'}
                    style={[
                      styles.sortItemText,
                      isSelected && styles.activeText,
                    ]}
                  >
                    {option.label}
                  </BaseText>
                  {isSelected && (
                    <Check size={fontPx(20)} color={COLOR.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  },
);

FolderSortModal.displayName = 'FolderSortModal';
