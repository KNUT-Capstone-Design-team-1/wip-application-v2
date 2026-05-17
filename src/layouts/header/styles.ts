import { StyleSheet } from 'react-native';
import { COLOR, COLOR_PRIMARY } from '../../constants';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 48,
  },
  logo: {
    height: 32,
    width: 100,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    width: 24,
    height: 24,
    tintColor: COLOR_PRIMARY[200],
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 24,
    color: COLOR_PRIMARY[200],
    fontWeight: '600',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: COLOR_PRIMARY[200],
    textAlign: 'center',
  },
});
