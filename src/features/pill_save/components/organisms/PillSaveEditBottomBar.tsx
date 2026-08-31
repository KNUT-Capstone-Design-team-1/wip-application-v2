import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { px } from '@utils/responsive';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '@features/pill_save/styles/organisms/PillSaveEditBottomBar';
import { IPillSaveEditBottomBarProps } from '@features/pill_save/types/pill_save_type';

// 액션 버튼 컴포넌트
const ActionButton = memo(({ onPress, disabled, label, isDelete }: any) => {
  if (!onPress) {
    return null;
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled
          ? styles.disabledButton
          : isDelete
            ? styles.deleteButton
            : styles.primaryButton,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <BaseText
        weight="bold"
        size={16}
        style={
          disabled
            ? styles.disabledText
            : isDelete
              ? styles.deleteText
              : styles.primaryText
        }
      >
        {label}
      </BaseText>
    </TouchableOpacity>
  );
});

ActionButton.displayName = 'ActionButton';

// 편집 모드일 때 하단에 나타나는 메뉴 바
export const PillSaveEditBottomBar = memo(
  ({
    onRename,
    onDelete,
    onMove,
    onCopy,
    selectedCount,
  }: IPillSaveEditBottomBarProps) => {
    const insets = useSafeAreaInsets();
    const isDisabled = selectedCount === 0 || selectedCount === undefined;

    return (
      <View
        style={[styles.container, { paddingBottom: insets.bottom + px(12) }]}
      >
        {selectedCount !== undefined && (
          <BaseText weight="bold" size={14} style={styles.countText}>
            {selectedCount}개 선택됨
          </BaseText>
        )}
        <View style={styles.buttonRow}>
          {selectedCount === 1 && (
            <ActionButton
              onPress={onRename}
              disabled={isDisabled}
              label="이름 변경"
            />
          )}
          <ActionButton onPress={onMove} disabled={isDisabled} label="이동" />
          <ActionButton onPress={onCopy} disabled={isDisabled} label="복사" />
          <ActionButton
            onPress={onDelete}
            disabled={isDisabled}
            label="삭제"
            isDelete
          />
        </View>
      </View>
    );
  },
);

PillSaveEditBottomBar.displayName = 'PillSaveEditBottomBar';
