import { ReactNode, memo } from 'react';
import { View, Text, StyleSheet, GestureResponderEvent } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

import Button from '@/components/atoms/Button';
import { font, os } from '@/style/font';

const SearchIdItem = memo(
  ({
    children,
    text,
    handlePressItem,
    backgroundColor,
    defaultColor = '#00000020',
    selectColor,
    isSelected,
  }: {
    children: ReactNode;
    text: string;
    handlePressItem: (e: GestureResponderEvent) => void;
    backgroundColor?: string;
    defaultColor?: string;
    selectColor: string;
    isSelected: boolean;
  }): React.JSX.Element => {
    return (
      <Button.scaleFast
        style={styles.itemButtonWrapper}
        onPress={handlePressItem}
      >
        <Shadow
          startColor={isSelected ? selectColor : defaultColor}
          distance={6}
          style={styles.itemButton}
        >
          <View
            style={{
              ...styles.itemIconWrapper,
              backgroundColor: backgroundColor ? backgroundColor : '#fff',
            }}
          >
            {children}
          </View>
          <View style={styles.itemTextWrapper}>
            <Text style={styles.itemText}>{text}</Text>
          </View>
        </Shadow>
      </Button.scaleFast>
    );
  },
);

const styles = StyleSheet.create({
  itemButton: { borderRadius: 8, height: 70, width: '100%' },
  itemButtonWrapper: { width: '100%' },
  itemIconWrapper: {
    alignItems: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    flex: 3,
    justifyContent: 'center',
    width: '100%',
  },
  itemText: {
    color: '#000',
    fontFamily: os.font(600, 700),
    fontSize: font(14),
    includeFontPadding: false,
    textAlign: 'center',
  },
  itemTextWrapper: {
    alignItems: 'center',
    borderTopColor: '#00000020',
    borderTopWidth: 1.5,
    flex: 2,
    justifyContent: 'center',
    width: '100%',
  },
});

export default SearchIdItem;
