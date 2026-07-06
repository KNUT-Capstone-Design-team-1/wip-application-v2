import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';
import { COLOR } from '@constants/color';

export const styles = StyleSheet.create({
  headerWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: px(16),
  },
  nameScrollWrapper: { marginRight: px(8) },
  nameViewWrapper: { paddingRight: px(8) },
  name: {
    color: COLOR['black'],
    flex: 1,
  },
  gradiant: {
    position: 'absolute',
    right: 0,
    width: '30%',
    height: '100%',
  },
  saveButton: {},
});
