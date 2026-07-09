import { COLOR, COLOR_BG, COLOR_TEXT } from '@constants/color';
import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_BG['overlay'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: COLOR_BG['surface'],
    paddingVertical: px(32),
    paddingHorizontal: px(24),
    borderRadius: px(16),
    alignItems: 'center',
    elevation: 5,
    shadowColor: COLOR['shadow'],
    shadowOffset: { width: 0, height: px(2) },
    shadowOpacity: 0.25,
    shadowRadius: px(3.84),
  },
  message: {
    marginTop: px(15),
    color: COLOR_TEXT['title'],
  },
});
