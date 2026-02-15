import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  pillResultDetailRoot: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewWrapper: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
  },
  viewWrapper: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
    overflow: 'hidden',
    paddingHorizontal: 15,
  },
  pillImgWrapper: {
    aspectRatio: 1299 / 709,
    borderRadius: 18,
    marginTop: 16,
    overflow: 'hidden',
    width: '100%',
    backgroundColor: '#fff',
  },
  pillImg: {
    borderRadius: 18,
    height: '100%',
    overflow: 'hidden',
    width: '100%',
  },
});
