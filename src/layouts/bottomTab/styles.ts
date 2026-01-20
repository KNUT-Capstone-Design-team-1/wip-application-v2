import { StyleSheet } from 'react-native';
import { COLOR_GRAY, COLOR_PRIMARY } from '../../constants/color';

export const styles = StyleSheet.create({
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
