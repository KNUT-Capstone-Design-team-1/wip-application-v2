import { StyleSheet } from 'react-native';
import { COLOR, COLOR_GRAY, COLOR_PRIMARY } from '@constants/color';

export const styles = StyleSheet.create({
  pillSaveContentWrapper: {
    flex: 1,
    borderRadius: 10,
    borderColor: COLOR_GRAY[250],
    borderWidth: 1,
    backgroundColor: COLOR['white'],
    minHeight: 190,
    paddingBottom: 12,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLOR_GRAY[400],
    padding: 4,
    borderRadius: 50,
  },
  pillImage: {
    width: '100%',
    height: 85,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderWidth: 1,
    borderColor: COLOR_GRAY[100],
    marginBottom: 8,
  },
  pillInfoWrapper: {
    flex: 1,
    paddingHorizontal: 10,
  },
  pillName: {
    fontFamily: 'Paperlogy',
    fontSize: 14,
    fontWeight: 700,
    color: COLOR['black'],
    marginBottom: 2,
    lineHeight: 18,
  },
  pillClassName: {
    fontFamily: 'Paperlogy',
    fontWeight: 600,
    fontSize: 12,
    color: COLOR['item'],
  },
  pillEntpName: {
    fontFamily: 'Paperlogy',
    fontWeight: 600,
    fontSize: 12,
    color: COLOR_GRAY[400],
  },
  pillPrintText: {
    fontFamily: 'Paperlogy',
    fontWeight: 600,
    fontSize: 11,
    color: COLOR_PRIMARY[400],
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  pillInfoPrintWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  pillInfoSeparator: {
    width: 2,
    height: '60%',
    backgroundColor: COLOR_GRAY[200],
    marginHorizontal: 8,
  },
  pillInfoEntpWrapper: {
    flexGrow: 1,
    gap: 1,
    alignItems: 'flex-end',
  },
});
