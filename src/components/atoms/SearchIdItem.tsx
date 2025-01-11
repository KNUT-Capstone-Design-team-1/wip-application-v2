import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Shadow } from 'react-native-shadow-2'

import Button from '@/components/atoms/Button'
import { font, os } from '@/style/font'
import { TItemData } from '@/constants/data'

const SearchIdItem = React.memo(({
  item,
  handlePressItem,
  shapeSelected,
  colorSelected
}: {
  item: TItemData,
  handlePressItem: (item: TItemData) => void,
  shapeSelected: string[],
  colorSelected: string[]
}): JSX.Element => {
  return (
    <Button.scaleFast style={styles.itemButtonWrapper} onPress={() => handlePressItem(item)}>
      <Shadow startColor={shapeSelected.includes(item.category + item.key) || colorSelected.includes(item.category + item.key) ? '#7472EB' : '#00000020'} distance={6} style={styles.itemButton}>
        {item.icon ?
          <View style={styles.itemIconWrapper}>
            {item.icon}
          </View> :
          null}
        <View style={styles.itemTextWrapper}>
          <Text style={styles.itemText}>{item.name}</Text>
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
    paddingVertical: 10,
  },
  itemIconWrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingBottom: 8,
  },
  itemTextWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
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