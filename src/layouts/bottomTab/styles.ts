import { COLOR_GRAY } from '@constants/color';
import { StyleSheet } from 'react-native';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  bottomTabContainer: {
    position: 'relative',
    width: '100%',
    minHeight: px(80),
  },
  bottomTabList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#182729',
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
    color: COLOR_GRAY['400'],
    fontSize: fontPx(10),
    fontFamily: 'Jalnan2',
  },
});
