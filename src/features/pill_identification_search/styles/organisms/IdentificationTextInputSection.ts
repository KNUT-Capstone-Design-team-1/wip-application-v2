import { COLOR_PRIMARY } from '@constants/color';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  textInputColumnWrapper: {
    flexDirection: 'column',
    gap: 10,
    width: '100%',
  },
  textInputRowWrapper: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  textInputLabelCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  textInputLabelCheckboxWrapper: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: COLOR_PRIMARY[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  textInputLabelCheckboxText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 700,
  },
  textInputLabelText: {
    fontFamily: 'Paperlogy',
    fontWeight: 400,
    fontSize: 14,
    color: '#666',
    paddingVertical: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
    lineHeight: 18,
    transform: [{ translateY: -1.5 }],
  },
});
