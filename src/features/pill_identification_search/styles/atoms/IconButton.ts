import { StyleSheet } from 'react-native';
import { COLOR_GRAY } from '@constants/color';

export const styles = StyleSheet.create({
  iconButtonWrapper: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLOR_GRAY[150],
  },
  iconButtonTop: {
    width: '100%',
    height: '70%',
    borderBottomWidth: 1,
    borderBottomColor: COLOR_GRAY[150],
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: '40%',
    height: '40%',
  },
  iconButtonBottom: {
    width: '100%',
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    overflow: 'hidden',
  },
  iconSectionLabel: {
    color: COLOR_GRAY[200],
    textAlign: 'center',
  },
});
