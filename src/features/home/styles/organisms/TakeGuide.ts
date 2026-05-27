import { StyleSheet } from 'react-native';
import { COLOR } from '@constants/index';

export const styles = StyleSheet.create({
  guideWrapper: {
    flex: 1,
    width: '100%',
    minHeight: 57,
    backgroundColor: '#FFFDF4',
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
    left: 17,
    top: -13,
  },
});
