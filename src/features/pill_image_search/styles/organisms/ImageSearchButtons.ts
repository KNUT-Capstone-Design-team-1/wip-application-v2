import { StyleSheet } from 'react-native';
import { COLOR, COLOR_GRAY } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  imageSearchButtonsWrapper: {
    display: 'flex',
    gap: px(12),
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: px(8),
    width: '100%',
    height: px(45),
    borderRadius: px(10),
  },
  text: {
    color: COLOR['white'],
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
    color: COLOR['white'],
  },
  hr: {
    width: '100%',
    height: px(1),
    backgroundColor: COLOR_GRAY[100],
    marginVertical: px(24),
  },
});
