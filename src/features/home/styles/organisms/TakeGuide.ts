import { StyleSheet } from 'react-native';
import { COLOR } from '../../../../constants';

export const styles = StyleSheet.create({
  guideWrapper: {
    position: 'relative',
    width: '100%',
    height: 57,
    backgroundColor: '#FFFDF4',
    marginTop: 82.5,
    display: 'flex',
    alignItems: 'center',
  },
  guideTitle: {
    color: COLOR.alert,
    fontSize: 13,
    fontWeight: 700,
  },
  guideMethod: {
    fontSize: 12,
    color: '#000000',
    marginTop: 8,
  },
  guideAlertIcon: {
    width: 32,
    height: 30,
    position: 'absolute',
    left: 17,
    top: -13,
  },
});
