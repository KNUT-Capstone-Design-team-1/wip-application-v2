import { COLOR } from '@constants/color';
import { StyleSheet } from 'react-native';
import { px } from '@utils/responsive';
import { screenPadding } from '@constants/size';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR['white'],
    paddingHorizontal: screenPadding.horizontal,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: px(16),
    backgroundColor: COLOR['white'],
    borderRadius: px(18),
  },
  infoContainer: {
    paddingVertical: px(20),
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: px(20),
  },
  infoRows: {
    gap: px(12),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moreButtonContainer: {
    alignItems: 'center',
    marginTop: px(20),
    marginBottom: px(20),
  },
  sections: {
    gap: px(16),
  },
  section: {
    gap: px(10),
  },
  sectionContent: {
    paddingTop: px(8),
  },
});
