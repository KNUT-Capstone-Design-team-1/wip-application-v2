import { font, os } from "@/style/font";
import { Image, StyleSheet, Text, View } from "react-native";
import ArrowRightSvg from '@assets/svgs/arrow_right.svg';
import { useNavigation } from "@react-navigation/native";
import Button from "@/components/atoms/Button";
import { getItem, setItem } from "@/utils/storage";

const ResultItem = ({ data, last }: any) => {
  const nav: any = useNavigation();

  const handlePressItem = async () => {
    const LIST = await getItem('latestSearchPill');
    let list: any[] = [{ info1: data }];
    if (LIST) {
      list = [{ info1: {} }];
      JSON.parse(LIST).map((i: any) => {
        if (i.info1.ITEM_SEQ !== data.ITEM_SEQ) list.push({ info1: i.info1 });
      });
      list[0] = { info1: data };
    }
    setItem('latestSearchPill', JSON.stringify(list));
    nav.navigate('알약 정보', { data: { info1: data } });
  }

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      width: '100%',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderBottomColor: '#E7E7E7',
      borderBottomWidth: 1,
      marginBottom: last ? 200 : 0,
      backgroundColor: '#fff',
    },
    imgWrapper: {
      position: 'relative',
      width: '30%',
      aspectRatio: '1/1',
      marginRight: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#c3c3c3',
      backgroundColor: '#ffffff',
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
    <Button.scale activeScale={0.95} onPress={handlePressItem}>
      <View style={styles.container}>
        <View style={styles.imgWrapper}>
          {!!data.ITEM_IMAGE && <Image style={styles.pillImg} source={{ uri: data.ITEM_IMAGE }} resizeMode="contain" />}
        </View>
        <View style={styles.infoWrapper}>
          <Text style={styles.name} numberOfLines={2}>{data.ITEM_NAME}</Text>
          <Text style={styles.efficacy}>{data.ENTP_NAME}</Text>
          <Text style={styles.etc} numberOfLines={1}>{data.MAIN_ITEM_INGR}</Text>
        </View>
        <View style={styles.btnWrapper}>
          <ArrowRightSvg style={styles.rightArrow} width={8} height={14} />
        </View>
      </View>
    </Button.scale>
  )
}

export default ResultItem;