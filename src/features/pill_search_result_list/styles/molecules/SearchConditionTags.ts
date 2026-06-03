import { COLOR_GRAY } from '@constants/color';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  searchConditionContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagLabel: {
    fontFamily: 'Paperlogy',
    fontWeight: 600,
    fontSize: 12,
    color: COLOR_GRAY[400],
    marginRight: 4,
  },
  tagValue: {
    fontFamily: 'Paperlogy',
    fontWeight: 500,
    fontSize: 12,
    color: COLOR_GRAY[300],
  },
  tagImage: {
    width: 24,
    height: 24,
    marginLeft: 6,
    backgroundColor: 'transparent',
  },
});
