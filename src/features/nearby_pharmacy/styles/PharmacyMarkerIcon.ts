import { StyleSheet } from 'react-native';
import { COLOR } from '@constants/color';
import { px } from '@utils/responsive';

const UNSELECTED_SIZE = Math.round(px(26));
const SELECTED_SIZE = Math.round(px(38));
const SELECTED_ICON_SIZE = SELECTED_SIZE - 2;

export const styles = StyleSheet.create({
  unselectedOuter: {
    width: UNSELECTED_SIZE,
    height: UNSELECTED_SIZE,
    borderRadius: UNSELECTED_SIZE / 2,
    backgroundColor: COLOR['white'],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  unselectedMiddle: {
    width: UNSELECTED_SIZE - 4,
    height: UNSELECTED_SIZE - 4,
    borderRadius: (UNSELECTED_SIZE - 4) / 2,
    backgroundColor: COLOR['marker'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  unselectedInner: {
    width: UNSELECTED_SIZE / 3,
    height: UNSELECTED_SIZE / 3,
    borderRadius: UNSELECTED_SIZE / 6,
    backgroundColor: COLOR['white'],
  },
  selectedContainer: {
    width: SELECTED_SIZE,
    height: SELECTED_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedHole: {
    position: 'absolute',
    width: SELECTED_ICON_SIZE * (8 / 24),
    height: SELECTED_ICON_SIZE * (8 / 24),
    backgroundColor: COLOR['white'],
    borderRadius: SELECTED_ICON_SIZE,
    top: SELECTED_ICON_SIZE * (6 / 24),
  },
});

export const getSelectedIconSize = () => SELECTED_ICON_SIZE;
