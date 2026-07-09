import { COLOR_BG, COLOR_TEXT } from '@constants/color';
import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';
import { bottomTabSize } from '@constants/size';

export const styles = StyleSheet.create({
  bottomTabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    minHeight: bottomTabSize.height,
  },
  bottomTabList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLOR_BG['tabbar'],
    borderRadius: px(30),
    marginHorizontal: px(20),
    paddingHorizontal: px(16),
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: px(10),
    gap: px(8),
  },
  label: {
    color: COLOR_TEXT['disabled'],
  },
});
