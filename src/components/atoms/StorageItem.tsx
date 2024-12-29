import Button from "@/components/atoms/Button";
import { windowWidth } from "@/components/organisms/Layout";
import { font, os } from "@/style/font";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import ArrowRightSvg from '@assets/svgs/arrow_right.svg';
import DeleteSvg from '@assets/svgs/exit.svg';
import { useNavigation } from "@react-navigation/native";
import { getItem, setItem } from "@/utils/storage";
import { useAlert } from "@/hooks/useAlert";
import { usePillBox } from "@/hooks/usePillBox";

interface IProps {
  data: any,
  refresh: any,
}

const StorageItem = ({ data, refresh }: IProps): JSX.Element => {
  const nav: any = useNavigation();
  const { showAlert } = useAlert();
  const { delPill } = usePillBox();

  const handlePressDetail = () => {
    nav.navigate('StorageStack', { screen: '알약 정보', params: { data: data } });
  }

  const handleDeleteItem = async () => {
    delPill(data.ITEM_SEQ);
    await refresh();
  }

  const handlePressDelete = () => {
    showAlert(
      '알약 삭제',
      `'${data.ITEM_NAME}'을 보관함에서 삭제하시겠습니까?`,
      [
        {
          text: '취소',
        },
        {
          text: '삭제',
          onPress: () => handleDeleteItem(),
        },
      ]
    )
  }

  const styles = StyleSheet.create({
    pillImgWrapper: {
      position: 'relative',
      width: '100%',
      aspectRatio: '1299/709',
    },
    pillImg: {
      width: '100%',
      height: '100%',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    },
    wrapper: {
      position: 'relative',
      width: (windowWidth - 38) / 2,
      height: ((windowWidth - 38) / 2) * 1.2,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E7E7E7',
      backgroundColor: '#fff',
    },
    nameWrapper: {
      padding: 8,
    },
    name: {
      color: '#000',
      fontSize: font(14),
      fontFamily: os.font(600, 700),
      paddingBottom: 0,
      includeFontPadding: false,
    },
    efficacy: {
      color: '#4644B5',
      fontSize: font(12),
      fontFamily: os.font(500, 600),
      paddingBottom: 0,
      includeFontPadding: false,
    },
    detailWrapper: {
      position: 'absolute',
      right: 11,
      bottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    detailText: {
      color: '#9394A4',
      fontSize: font(11),
      fontFamily: os.font(500, 500),
      includeFontPadding: false,
      paddingBottom: 1,
    },
    deleteBtn: {
      position: 'absolute',
      top: 4,
      right: 4,
    },
    deleteBtnWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 8,
      backgroundColor: '#00000031',
      borderRadius: 100,
    }
  });

  return (
    <Button.scale onPress={handlePressDetail}>
      <View style={styles.wrapper}>
        <View style={styles.pillImgWrapper}>
          {!!data.ITEM_IMAGE && <Image style={styles.pillImg} source={{ uri: data.ITEM_IMAGE, cache: 'only-if-cached' }} resizeMode="contain" />}
        </View>
        <View style={styles.nameWrapper}>
          <Text style={styles.name} numberOfLines={2}>{data.ITEM_NAME}</Text>
          <Text style={styles.efficacy}>{data.ENTP_NAME ?? ''}</Text>
        </View>
        <View style={styles.detailWrapper}>
          <Text style={styles.detailText}>자세히 보기</Text>
          <ArrowRightSvg width={10} height={10} />
        </View>
        <Button.scale style={styles.deleteBtn} activeScale={1.2} onPress={handlePressDelete}>
          <View style={styles.deleteBtnWrapper}>
            <DeleteSvg width={12} height={12} />
          </View>
        </Button.scale>
      </View>
    </Button.scale>
  )
};
export default StorageItem;


