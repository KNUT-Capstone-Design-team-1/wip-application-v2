import { styles } from '../../styles/organisms/FolderSortModal';
import React, { memo } from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { COLOR } from '@constants/color';
import { fontPx } from '@utils/responsive';
import { Check } from 'lucide-react-native';
import { FolderSortOption } from '@features/pill_save/hooks/use_pill_save_folders';

interface IFolderSortModalProps {
  visible: boolean;
  onClose: () => void;
  currentSort: FolderSortOption;
  onSortChange: (sort: FolderSortOption) => void;
}

const SORT_OPTIONS: { label: string; value: FolderSortOption }[] = [
  { label: '생성일순 (오래된순)', value: 'createdAt_asc' },
  { label: '최신순', value: 'createdAt_desc' },
  { label: '이름순', value: 'name_asc' },
  { label: '알약 많은 순', value: 'pillCount_desc' },
];

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
            {SORT_OPTIONS.map((option) => {
              const isSelected = currentSort === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={styles.sortItem}
                  onPress={() => onSortChange(option.value)}
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
