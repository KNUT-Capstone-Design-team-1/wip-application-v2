import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';
import { COLOR, COLOR_LINE, COLOR_TEXT } from '@constants/color';

export const styles = StyleSheet.create({
  selectMarkContainer: {
    width: '100%',
  },
  markResultContainer: {
    flexDirection: 'row',
    marginBottom: px(10),
    gap: px(16),
    padding: px(8),
    borderWidth: px(1.5),
    borderColor: COLOR_LINE['border'],
    borderRadius: px(15),
    backgroundColor: COLOR['white'],
    // ios
    shadowColor: COLOR['shadow'],
    shadowOffset: {
      width: 0,
      height: px(1),
    },
    shadowOpacity: 0.18,
    shadowRadius: px(1.0),
    // android
    elevation: 1,
  },
  markImageWrapper: {
    width: '23.5%',
    aspectRatio: 1,
  },
  markImage: {
    width: '100%',
    height: '100%',
  },
  markTitle: {
    color: COLOR_TEXT['label'],
    textAlign: 'center',
  },
  selectedMarkDelete: {
    position: 'absolute',
    padding: px(4),
    zIndex: 5,
    right: px(2),
    top: px(2),
  },
});
