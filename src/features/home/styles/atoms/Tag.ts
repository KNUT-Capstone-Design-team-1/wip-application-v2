import { StyleSheet } from 'react-native';
import { COLOR_GRAY } from '@constants/index';
import { FONT_PAPERLOGY_WEIGHT } from '@constants/font';

export const styles = StyleSheet.create({
  tagContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
    borderColor: COLOR_GRAY[300],
    borderWidth: 1,
    borderRadius: 32,
    paddingVertical: 2,
    paddingLeft: 8,
  },
  tagWrapper: {},
  tagTitle: {
    fontSize: 14,
    color: COLOR_GRAY[400],
    ...FONT_PAPERLOGY_WEIGHT['regular'],
  },
  deleteButton: {
    paddingVertical: 5,
    paddingRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const IconStyles = {
  deleteIcon: {
    size: 14,
    color: COLOR_GRAY['300'],
    strokeWidth: 2,
  },
};
