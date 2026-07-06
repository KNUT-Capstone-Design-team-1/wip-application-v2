import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  menuButton: {
    borderRadius: px(13),
  },
  buttonImgWrapper: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: '60%',
    paddingTop: px(4),
  },
  buttonContentWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
  },
  content: {
    color: '#fff',
  },
});
