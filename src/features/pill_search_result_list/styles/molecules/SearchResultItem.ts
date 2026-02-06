import { StyleSheet } from 'react-native';
import { COLOR, COLOR_GRAY } from '@/src/constants';

export const styles = StyleSheet.create({
  searchItemWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 16,
  },
  searchItemImage: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: COLOR_GRAY[100],
    borderRadius: 10,
    overflow: 'hidden', // 이미지가 borderRadius 밖으로 나가지 않도록
  },
  searchItemContents: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-around',
    marginLeft: 20, // 이미지와 텍스트 사이 간격
  },
  searchItemTitle: {
    fontWeight: 700,
    fontSize: 12,
  },
  searchItemEntpName: {
    color: COLOR_GRAY[400],
  },
  searchItemEtcOtcCode: {
    color: COLOR['item'],
  },
  searchItemPrintFront: {},
});
