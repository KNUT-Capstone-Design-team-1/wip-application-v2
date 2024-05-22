import Skeleton from "@/components/atoms/Skeleton";
import { font, os } from "@/style/font";
import { StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

const SkeletonResultItem = () => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      width: '100%',
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    imgWrapper: {
      position: 'relative',
      width: '30%',
      aspectRatio: '1/1',
      marginRight: 16,
      overflow: 'hidden',
    },
    infoWrapper: {
      flex: 1,
      justifyContent: 'center',
      gap: 2,
      marginRight: 22,
    },
    name: {
      color: '#000',
      fontSize: font(18),
      fontFamily: os.font(700, 700),
      includeFontPadding: false,
      marginBottom: 8,
    },
    efficacy: {
      color: '#6E6E6E',
      fontSize: font(14),
      fontFamily: os.font(600, 600),
      includeFontPadding: false,
      paddingBottom: 0,
    },
    etc: {
      color: '#4644B5',
      fontSize: font(12),
      fontFamily: os.font(500, 500),
      includeFontPadding: false,
      paddingBottom: 0,
    },
    btnWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    addStorage: {
      padding: 10,
    },
    rightArrow: {
      padding: 10,
    },
    pillImg: {
      width: '100%',
      height: '100%',
      borderRadius: 8,
    }
  })

  return (
    <View style={styles.container}>
      <View style={styles.imgWrapper}>
        <Skeleton
          width={'100%'}
          height={'100%'}
          borderRaidus={8}
        />
      </View>
      <View style={styles.infoWrapper}>
        <Skeleton
          width={'100%'}
          height={font(18)}
          marginBottom={14}
        />
        <Skeleton
          width={'50%'}
          height={font(14)}
          marginBottom={8}
        />
        <Skeleton
          width={'70%'}
          height={font(12)}
        />
      </View>
      <View style={styles.btnWrapper}>
      </View>
    </View>
  )
}

export default SkeletonResultItem;