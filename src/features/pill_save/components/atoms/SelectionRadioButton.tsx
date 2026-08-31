import React, { memo } from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { Check } from 'lucide-react-native';
import { styles } from '@features/pill_save/styles/atoms/SelectionRadioButton';

interface ISelectionRadioButtonProps {
  isSelected?: boolean;
  style?: StyleProp<ViewStyle>;
  size?: number;
}

export const SelectionRadioButton = memo(
  ({ isSelected, style, size = 18 }: ISelectionRadioButtonProps) => {
    return (
      <View
        style={[
          styles.container,
          { width: size, height: size, borderRadius: size / 2 },
          isSelected ? styles.selected : styles.unselected,
          style,
        ]}
      >
        {isSelected && (
          <Check color="#FFFFFF" size={size * (2 / 3)} strokeWidth={3} />
        )}
      </View>
    );
  },
);

SelectionRadioButton.displayName = 'SelectionRadioButton';
