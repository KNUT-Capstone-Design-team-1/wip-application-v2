import { StyleSheet } from 'react-native';
import { COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  searchBarWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: px(40),
    paddingHorizontal: px(20),
    borderWidth: px(1),
    borderRadius: px(20),
    borderColor: COLOR_LINE['border'],
  },
  searchTextInput: {
    flex: 1,
  },
  clearButton: {
    position: 'absolute',
    width: px(20),
    right: '15%',
    justifyContent: 'center',
  },
  clearButtonText: {
    color: COLOR_TEXT['sub'],
  },
  searchButton: {
    width: px(24),
    height: px(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
