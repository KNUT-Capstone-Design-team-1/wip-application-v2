import { font, os } from "@/style/font";
import { StyleSheet, Text, View } from "react-native";

interface IProps {
  label: string,
  ct: string,
}

const PillInfo = ({ label, ct }: IProps): JSX.Element => {
  let _ct = '-';

  if (ct) {
    _ct = ct.replaceAll('|', '\n');
  }

  const styles = StyleSheet.create({
    info: {
      flexDirection: 'row',
      gap: 12,
    },
    infoHeadText: {
      color: '#000',
      fontSize: font(16),
      fontFamily: os.font(500, 500),
      includeFontPadding: false,
      paddingBottom: 0,
      minWidth: 70,
    },
    infoContentsText: {
      flex: 1,
      color: '#000',
      fontSize: font(16),
      fontFamily: os.font(400, 400),
      includeFontPadding: false,
      paddingBottom: 0,
    },
  })

  return (
    <View style={styles.info}>
      <Text style={styles.infoHeadText}>{label}</Text>
      <Text style={styles.infoContentsText}>{_ct ?? '-'}</Text>
    </View>
  )
};
export default PillInfo;