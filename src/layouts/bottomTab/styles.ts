import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  bottomTabContainer: {
    position: 'relative',
    width: '100%',
    height: 80,
    backgroundColor: '#E9E9E9',
  },
  bottomTabList: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  bottomTabItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 6,
  },
  bottomTabItemActive: {
    backgroundColor: '#FFFFFF',
    // 그림자 효과 (iOS)
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    // 그림자 효과 (Android)
    elevation: 3,
  },
  bottomTabIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomTabLabel: {
    color: '#C1D1D5',
    fontSize: 13,
    fontWeight: '600',
  },
  bottomTabLabelActive: {
    color: '#000000',
    fontWeight: '700',
  },
});
