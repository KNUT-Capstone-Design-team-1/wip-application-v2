import { COLOR_BG } from '@constants/color';
import { px } from '@utils/responsive';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  backdrop: {
    flex: 1,
    backgroundColor: COLOR_BG['overlay'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: COLOR_BG['surface'],
    paddingTop: px(24),
    paddingBottom: px(28),
    paddingHorizontal: px(16),
    borderRadius: px(16),
  },
  closeButton: {
    position: 'absolute',
    top: px(4),
    right: px(4),
    padding: px(8),
    zIndex: 999,
  },
});
