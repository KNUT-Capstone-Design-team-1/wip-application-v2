import { memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { COLOR, COLOR_BG, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

interface ICategoryChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const CategoryChip = ({ label, selected, onPress }: ICategoryChipProps) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        pressed && { opacity: 0.7 },
      ]}
      onPress={onPress}
    >
      <BaseText
        weight={selected ? 'semiBold' : 'medium'}
        size={13}
        numberOfLines={1}
        style={selected ? styles.textSelected : styles.text}
      >
        {label}
      </BaseText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: px(13),
    paddingVertical: px(7),
    borderRadius: px(16),
    backgroundColor: COLOR_BG.base,
  },
  chipSelected: {
    backgroundColor: COLOR.primary,
  },
  text: {
    color: COLOR_TEXT.sub,
  },
  textSelected: {
    color: COLOR_TEXT.white,
  },
});

export default memo(CategoryChip);
