import { COLOR } from '@constants/color';
import { StyleSheet } from 'react-native';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: COLOR['white'],
    paddingVertical: px(32),
    paddingHorizontal: px(24),
    borderRadius: px(16),
    alignItems: 'center',
    elevation: 5,
    shadowColor: COLOR['black'],
    shadowOffset: { width: 0, height: px(2) },
    shadowOpacity: 0.25,
    shadowRadius: px(3.84),
  },
  message: {
    fontFamily: 'Paperlogy',
    marginTop: px(15),
    fontSize: fontPx(16),
    color: COLOR['black'],
    fontWeight: 600,
  },
});
