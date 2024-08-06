import Skeleton from "@/components/atoms/Skeleton";
import SkeletonResultItem from "@/components/atoms/SkeletonResultItem";
import { font } from "@/style/font";
import { StyleSheet, View } from "react-native";

const SkeletoneSearchResult = (): JSX.Element => {

  const styles = StyleSheet.create({
    noteWrapper: {
      position: 'absolute',
      flexDirection: 'row',
      justifyContent: 'center',
      width: '100%',
      alignItems: 'center',
      paddingTop: 20,
      paddingBottom: 12,
      backgroundColor: '#fff',
      zIndex: 10,
    },
    skeletonList: {
      paddingTop: 50,
    },
  })

  return (
    <View style={{ width: '100%', height: '100%', backgroundColor: 'white' }}>
      <View style={styles.noteWrapper}>
        <Skeleton width={'60%'} height={font(15)} />
      </View>
      <View style={styles.skeletonList}>
        <SkeletonResultItem />
        <SkeletonResultItem />
        <SkeletonResultItem />
        <SkeletonResultItem />
        <SkeletonResultItem />
        <SkeletonResultItem />
      </View>
    </View>
  )
};

export default SkeletoneSearchResult;