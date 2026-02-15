import { StyleSheet } from 'react-native';
import { COLOR_GRAY, COLOR_PRIMARY } from '../../constants';

export const styles = StyleSheet.create({
  bottomTabContainer: {
    position: 'relative',
    width: '100%',
    height: 70,
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

export const styles2 = StyleSheet.create({
  container: {
    width: '90%',
    justifyContent: 'center',
    margin: 'auto',
    flexDirection: 'row',
    backgroundColor: COLOR_PRIMARY[400],
    borderRadius: 30,
    borderTopWidth: 1,
    borderTopColor: '#E1E1E1',
    paddingTop: 8,
    paddingHorizontal: 8,
    marginTop: -30,
    // 그림자 효과 (iOS)
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    // 그림자 효과 (Android)
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  centerTabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginTop: -30,
  },
  iconContainer: {
    marginBottom: 4,
  },
  centerIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    color: COLOR_GRAY[400],
  },
  activeLabel: {
    fontWeight: '600',
  },
});
