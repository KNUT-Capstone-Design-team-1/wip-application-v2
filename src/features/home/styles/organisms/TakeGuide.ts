import { StyleSheet } from 'react-native';
import { COLOR } from '@constants/index';

export const styles = StyleSheet.create({
  guideWrapper: {
    position: 'relative',
    width: '100%',
    minHeight: 57,
    backgroundColor: '#FFFDF4',
    marginTop: 82.5,
    paddingHorizontal: 54,
    paddingVertical: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideTitle: {
    color: COLOR.alert,
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
