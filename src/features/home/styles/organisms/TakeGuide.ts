import { StyleSheet } from 'react-native';
import { COLOR } from '@constants/index';
import { px, fontPx } from '@utils/responsive';

export const styles = StyleSheet.create({
  guideWrapper: {
    flex: 1,
    width: '100%',
    minHeight: px(57),
    marginTop: px(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideContentWrapper: {
    marginHorizontal: px(18),
    marginVertical: px(10),
    borderRadius: px(12),
  },
  guideTitle: {
    color: COLOR.alert,
    fontFamily: 'Paperlogy',
    fontSize: fontPx(13),
    fontWeight: 700,
    textAlign: 'center',
    lineHeight: fontPx(18),
  },
  guideAlertIcon: {
    width: px(32),
    height: px(30),
    position: 'absolute',
    left: px(-14),
    top: px(-25),
  },
});
