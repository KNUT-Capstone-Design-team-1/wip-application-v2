import { StyleSheet } from 'react-native';
import { COLOR, COLOR_GRAY, COLOR_PRIMARY } from '@constants/color';

export const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Paperlogy',
    fontSize: 18,
    fontWeight: 700,
    color: COLOR_PRIMARY[400],
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
    fontFamily: 'Paperlogy',
    fontSize: 14,
    fontWeight: 600,
    color: COLOR_PRIMARY[300],
    marginBottom: 8,
  },
  imageBox: {
    position: 'relative',
    width: 140,
    height: 140,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLOR_GRAY[100],
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  checkmark: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 14,
    backgroundColor: COLOR['normal'],
    justifyContent: 'center',
    alignItems: 'center',
  },
});
