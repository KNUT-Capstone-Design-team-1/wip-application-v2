import { COLOR, COLOR_GRAY } from '@constants/color';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: COLOR['white'],
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 5,
    shadowColor: COLOR['black'],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  message: {
    fontFamily: 'Paperlogy',
    marginTop: 15,
    fontSize: 16,
    color: COLOR['black'],
    fontWeight: 600,
  },
});
