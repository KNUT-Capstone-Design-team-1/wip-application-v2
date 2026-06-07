import { StyleSheet } from 'react-native';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  settingList: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  settingItem: {
    display: 'flex',
    justifyContent: 'center',
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
  text: {
    fontFamily: 'Paperlogy',
    fontWeight: 500,
    fontSize: fontPx(16),
  },
});
