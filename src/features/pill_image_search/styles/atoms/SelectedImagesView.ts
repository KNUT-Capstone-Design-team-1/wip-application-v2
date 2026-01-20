import { StyleSheet } from 'react-native';
import { COLOR_PRIMARY } from '../../../../constants/color';

export const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLOR_PRIMARY[300],
    marginBottom: 20,
  },
  imagesWrapper: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    justifyContent: 'center',
  },
  imageContainer: {
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLOR_PRIMARY[300],
    marginBottom: 8,
  },
  imageBox: {
    position: 'relative',
    width: 140,
    height: 140,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: COLOR_PRIMARY[400],
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
