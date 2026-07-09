import { StyleSheet } from 'react-native';
import { COLOR, COLOR_TEXT } from '@constants/color';
import { px } from '@utils/responsive';

export const styles = StyleSheet.create({
  contentContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: px(30),
  },
  title: {
    textAlign: 'center',
    marginBottom: px(20), // 타이틀과 내용 사이 간격
    color: COLOR_TEXT['title'],
  },
  contentTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px(4),
    marginBottom: px(4),
  },
  contentTitle: {
    textAlign: 'center',
  },
  contentDescription: {
    textAlign: 'center',
    color: COLOR['normal'],
  },
  contentImage: {
    width: '90%',
    height: px(150),
    marginTop: px(10),
  },
});
