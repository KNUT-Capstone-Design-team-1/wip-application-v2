import { StyleSheet } from 'react-native';
import { COLOR, COLOR_PRIMARY } from '../../../../constants';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  contentContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: px(30),
    color: COLOR_PRIMARY[300],
  },
  title: {
    fontFamily: 'Paperlogy',
    textAlign: 'center',
    fontSize: fontPx(18),
    fontWeight: 700,
    marginBottom: px(20), // 타이틀과 내용 사이 간격
    color: COLOR_PRIMARY[300],
  },
  contentTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px(4),
    marginBottom: px(4),
  },
  infoIcon: {
    width: px(16),
    height: px(16),
    backgroundColor: COLOR_PRIMARY[300],
    borderRadius: px(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentTitle: {
    fontFamily: 'Paperlogy',
    textAlign: 'center',
    fontSize: fontPx(16),
    fontWeight: 500,
  },
  contentDescription: {
    fontFamily: 'Paperlogy',
    textAlign: 'center',
    fontSize: fontPx(14),
    color: COLOR['normal'],
    fontWeight: 500,
  },
  contentImage: {
    width: '90%',
    height: px(150),
    marginTop: px(10),
  },
});
