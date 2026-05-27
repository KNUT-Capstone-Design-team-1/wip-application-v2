import { StyleSheet } from 'react-native';
import { COLOR } from '@constants/index';

export const styles = StyleSheet.create({
  guideWrapper: {
    flex: 1,
    width: '100%',
    minHeight: 57,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideContentWrapper: {
    marginHorizontal: 18,
    marginVertical: 10,
    borderRadius: 12,
  },
  guideTitle: {
    color: COLOR.alert,
    fontFamily: 'Paperlogy',
    fontSize: 13,
    fontWeight: 700,
    textAlign: 'center',
    lineHeight: 18,
  },
  guideAlertIcon: {
    width: 32,
    height: 30,
    position: 'absolute',
    left: -14,
    top: -25,
  },
});
