import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';
import { COLOR_BG } from '@constants/color';

export const styles = StyleSheet.create({
  settingList: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: COLOR_BG['surface'],
  },
  settingItem: {
    width: '100%',
    height: px(70),
  },
  settingItemTextBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  text: {},
});
