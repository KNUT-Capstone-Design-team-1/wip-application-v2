import { StyleSheet } from 'react-native';
import { COLOR_GRAY } from '@constants/index';
import { px } from '@utils/responsive';
import { bottomTabSize } from '@constants/size';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: px(20),
    backgroundColor: '#fff',
    paddingHorizontal: px(20),
    paddingBottom: bottomTabSize.height,
  },
  hr: {
    width: '100%',
    height: px(2),
    backgroundColor: COLOR_GRAY[150],
    marginTop: px(12),
  },
});
