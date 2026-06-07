import { StyleSheet } from 'react-native';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  nameWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: px(16),
  },
  name: {
    color: '#000',
    flex: 1,
    fontSize: fontPx(22),
    fontWeight: '700',
    paddingRight: px(20),
  },
  saveButton: {},
});
