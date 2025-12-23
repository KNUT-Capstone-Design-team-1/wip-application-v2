import Skeleton from '@/components/atoms/Skeleton';
import { font, os } from '@/style/font';
import { StyleSheet, View } from 'react-native';

const SkeletonResultItem = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imgWrapper}>
        <Skeleton width={'100%'} height={'100%'} borderRaidus={8} />
      </View>
      <View style={styles.infoWrapper}>
        <Skeleton width={'100%'} height={font(18)} marginBottom={14} />
        <Skeleton width={'50%'} height={font(14)} marginBottom={8} />
        <Skeleton width={'70%'} height={font(12)} />
      </View>
      <View style={styles.btnWrapper}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  addStorage: { padding: 10 },
  btnWrapper: { alignItems: 'center', flexDirection: 'row', gap: 12 },
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    width: '100%',
  },
  efficacy: {
    color: '#6E6E6E',
    fontFamily: os.font(600, 600),
    fontSize: font(14),
    includeFontPadding: false,
    paddingBottom: 0,
  },
  etc: {
    color: '#4644B5',
    fontFamily: os.font(500, 500),
    fontSize: font(12),
    includeFontPadding: false,
    paddingBottom: 0,
  },
  imgWrapper: {
    aspectRatio: '1/1',
    marginRight: 16,
    overflow: 'hidden',
    position: 'relative',
    width: '30%',
  },
  infoWrapper: { flex: 1, gap: 2, justifyContent: 'center', marginRight: 22 },
  name: {
    color: '#000',
    fontFamily: os.font(700, 700),
    fontSize: font(18),
    includeFontPadding: false,
    marginBottom: 8,
  },
  pillImg: { borderRadius: 8, height: '100%', width: '100%' },
  rightArrow: { padding: 10 },
});

export default SkeletonResultItem;
