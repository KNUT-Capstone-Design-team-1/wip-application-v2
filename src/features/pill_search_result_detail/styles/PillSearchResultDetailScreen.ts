import { COLOR, COLOR_GRAY, COLOR_PRIMARY } from '@constants/color';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  scrollViewWrapper: {
    backgroundColor: COLOR['white'],
    flex: 1,
  },
  viewWrapper: {
    backgroundColor: COLOR['white'],
    flex: 1,
    overflow: 'hidden',
    paddingHorizontal: 16,
  },
  pillImgWrapper: {
    aspectRatio: 1299 / 709,
    borderRadius: 18,
    marginTop: 16,
    overflow: 'hidden',
    width: '100%',
    backgroundColor: COLOR['white'],
  },
  pillImg: {
    height: '100%',
    width: '100%',
  },
  pillDetailNoImageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR_GRAY[150],
  },
  pillDetailNoImageText: {
    fontFamily: 'Paperlogy',
    fontSize: 16,
    fontWeight: 600,
    color: COLOR_PRIMARY[400],
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  pillResultDetailRoot: {
    flex: 1,
    backgroundColor: COLOR['white'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillResultDetailNotFoundText: {
    fontFamily: 'Paperlogy',
    fontSize: 18,
    fontWeight: 600,
    color: COLOR['black'],
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});
