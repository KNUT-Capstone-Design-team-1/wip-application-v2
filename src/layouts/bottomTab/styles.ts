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
  tabItem: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 6,
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: '#C1D1D5',
    fontSize: 13,
    fontWeight: '600',
  },
  centerTabItem: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 6,
    marginTop: -20,
  },
  centerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    // 그림자 효과 (iOS)
    shadowColor: '#137DFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // 그림자 효과 (Android)
    elevation: 8,
  },
});
