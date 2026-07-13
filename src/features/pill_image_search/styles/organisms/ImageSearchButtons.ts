import { StyleSheet } from 'react-native';
import { COLOR_LINE, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  imageSearchButtonsWrapper: {
    display: 'flex',
    gap: px(14),
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: px(8),
    width: '100%',
    height: px(48),
    borderRadius: px(10),
  },
  text: {
    color: COLOR_TEXT['white'],
  },
  searchButton: {
    marginTop: px(20),
    width: '100%',
    height: px(54),
    borderRadius: px(27),
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: COLOR_TEXT['white'],
  },
  hr: {
    width: '100%',
    height: px(1),
    backgroundColor: COLOR_LINE['separator'],
    marginVertical: px(30),
  },
});
