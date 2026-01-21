import { StyleSheet } from 'react-native';
import { COLOR, COLOR_PRIMARY } from '../../../../constants';

export const styles = StyleSheet.create({
  contentContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 30,
    color: COLOR_PRIMARY[300],
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 20, // 타이틀과 내용 사이 간격
    color: COLOR_PRIMARY[300],
  },
  contentTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  infoIcon: {
    width: 16,
    height: 16,
    backgroundColor: COLOR_PRIMARY[300],
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentTitle: {
    textAlign: 'center',
    fontSize: 16,
  },
  contentDescription: {
    textAlign: 'center',
    fontSize: 14,
    color: COLOR.normal,
  },
  contentImage: {
    width: '90%',
    height: 150,
    marginTop: 10,
    // marginBottom: 20,
  },
});
