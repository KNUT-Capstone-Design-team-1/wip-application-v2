import { StyleSheet } from 'react-native';
import {
  TOOLTIP_MARGIN,
  TOOLTIP_PADDING_H,
} from '@features/guide/constants/guide_tooltip_constant';

export const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
  },
  card: {
    position: 'absolute',
    left: TOOLTIP_MARGIN,
    right: TOOLTIP_MARGIN,
    paddingHorizontal: TOOLTIP_PADDING_H,
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 10,
  },
});
