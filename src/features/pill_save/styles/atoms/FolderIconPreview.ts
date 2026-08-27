import { StyleSheet } from 'react-native';
import { COLOR, COLOR_BG, COLOR_LINE } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  emptyFolderWrapper: {
    width: px(52),
    height: px(52),
    borderRadius: px(12),
    backgroundColor: COLOR['primary'] + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: px(16),
  },
  folderIcon: {
    opacity: 0.6,
  },
  imageFolderWrapper: {
    width: px(52),
    height: px(52),
    borderRadius: px(12),
    backgroundColor: COLOR_BG['base'],
    marginRight: px(16),
    overflow: 'hidden',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderColor: COLOR_LINE['border'],
    borderWidth: px(1),
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  halfWidthImage: {
    width: '50%',
    height: '100%',
  },
  halfHeightImage: {
    width: '100%',
    height: '50%',
  },
  quarterImage: {
    width: '50%',
    height: '50%',
  },
  rowContainer: {
    width: '100%',
    height: '50%',
    flexDirection: 'row',
  },
});
