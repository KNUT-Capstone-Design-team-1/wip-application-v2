import React, { memo } from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { COLOR, COLOR_BG, COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px, fontPx } from '@utils/responsive';
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
          style={{
            flex: 1,
            backgroundColor: COLOR_BG.overlay,
            justifyContent: 'flex-end',
          }}
          activeOpacity={1}
          onPress={onClose}
        >
          <View
            style={{
              backgroundColor: COLOR_BG.surface,
              borderTopLeftRadius: px(16),
              borderTopRightRadius: px(16),
              paddingHorizontal: px(16),
              paddingBottom: px(32),
            }}
          >
            <View
              style={{
                paddingVertical: px(20),
                borderBottomWidth: 1,
                borderBottomColor: COLOR_LINE.border,
              }}
            >
              <BaseText
                size={18}
                weight="bold"
                style={{ color: COLOR_TEXT.title }}
              >
                정렬 기준
              </BaseText>
            </View>
            {SORT_OPTIONS.map((option) => {
              const isSelected = currentSort === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: px(16),
                    borderBottomWidth: 1,
                    borderBottomColor: COLOR_LINE.border,
                  }}
                  onPress={() => onSortChange(option.value)}
                >
                  <BaseText
                    size={16}
                    weight={isSelected ? 'bold' : 'medium'}
                    style={{
                      color: isSelected ? COLOR.primary : COLOR_TEXT.body,
                    }}
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
