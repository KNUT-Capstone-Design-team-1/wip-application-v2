import { COLOR_PRIMARY } from '@constants/color';
import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  infoWrapper: {
    gap: px(2),
    paddingBottom: px(0),
    paddingVertical: px(12),
  },
  sectionTitle: {
    color: COLOR_PRIMARY[200],
    textAlign: 'left',
    marginBottom: px(4),
    marginTop: px(12),
  },
});
