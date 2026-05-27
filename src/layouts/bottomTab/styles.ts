import { COLOR_GRAY } from '@constants/color';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  bottomTabContainer: {
    position: 'relative',
    width: '100%',
    minHeight: 80,
  },
  bottomTabList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#182729',
    borderRadius: 30,
    marginHorizontal: 20,
    paddingHorizontal: 16,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 8,
  },
  label: {
    color: COLOR_GRAY['400'],
    fontSize: 10,
    fontFamily: 'Jalnan2',
  },
});
