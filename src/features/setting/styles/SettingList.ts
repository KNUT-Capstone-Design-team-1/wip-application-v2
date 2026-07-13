import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';
import { COLOR_BG } from '@constants/color';

export const styles = StyleSheet.create({
  settingList: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    backgroundColor: COLOR_BG['surface'],
  },
  settingItem: {
    display: 'flex',
    width: '100%',
    height: px(70),
  },
  settingItemTextBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  text: {},
});
