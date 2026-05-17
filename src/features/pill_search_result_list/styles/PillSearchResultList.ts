import { StyleSheet } from 'react-native';
import { COLOR_GRAY } from '@constants/color';

export const styles = StyleSheet.create({
  pillSearchResultListRoot: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchCountLabel: {
    marginTop: 10,
    fontWeight: '500',
    color: COLOR_GRAY[400],
    fontSize: 12,
    paddingHorizontal: 20,
  },
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
    fontSize: 12,
    color: COLOR_GRAY[400],
    marginRight: 4,
    fontWeight: '600',
  },
  tagValue: {
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
