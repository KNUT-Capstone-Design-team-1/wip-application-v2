import React, { ReactNode } from 'react'
import { View, Text, StyleSheet, GestureResponderEvent } from 'react-native'
import { Shadow } from 'react-native-shadow-2'

import Button from '@/components/atoms/Button'
import { font, os } from '@/style/font'

const SearchIdItem = React.memo(({
  children,
  text,
  handlePressItem,
  backgroundColor,
  defaultColor = '#00000020',
  selectColor,
  isSelected,
}: {
  children: ReactNode,
  text: string,
  handlePressItem: (e: GestureResponderEvent) => void,
  backgroundColor?: string,
  defaultColor?: string,
  selectColor: string,
  isSelected: boolean
}): JSX.Element => {
  return (
    <Button.scaleFast style={styles.itemButtonWrapper} onPress={handlePressItem}>
      <Shadow startColor={isSelected ? selectColor : defaultColor} distance={6} style={styles.itemButton}>
        <View style={{ ...styles.itemIconWrapper, backgroundColor: backgroundColor ? backgroundColor : '#fff' }}>
          {children}
        </View>
        <View style={styles.itemTextWrapper}>
          <Text style={styles.itemText}>{text}</Text>
        </View>
      </Shadow>
    </Button.scaleFast>
  )
})

const styles = StyleSheet.create({
  itemButtonWrapper: {
    width: '100%',
  },
  itemButton: {
    width: '100%',
    height: 70,
    borderRadius: 8,
  },
  itemIconWrapper: {
    flex: 3,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  itemTextWrapper: {
    flex: 2,
    width: '100%',
    borderTopColor: '#00000020',
    borderTopWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: font(14),
    fontFamily: os.font(600, 700),
    includeFontPadding: false,
    textAlign: 'center',
    color: '#000'
  },
})

export default SearchIdItem