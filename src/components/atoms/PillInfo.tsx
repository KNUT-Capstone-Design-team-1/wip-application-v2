import { font, os } from "@/style/font";
import { StyleSheet, Text, View } from "react-native";
import CustomChip from "./CustomChip";

interface IProps {
  label: string,
  ct: string,
  searchValue?: string,
  replaceValue?: string
}

interface IPropsChips {
  label: string,
  ct: string[],
  searchValue?: string,
  replaceValue?: string
}

const PillInfo = {
  default: ({ label, ct, searchValue = "|", replaceValue = "\n" }: IProps): JSX.Element => {
    let _ct = '-';

    if (ct) {
      _ct = ct.replaceAll(searchValue, replaceValue).replaceAll(/\[.*?\]/g, '');
    }

    return (
      <View style={styles.info}>
        <Text style={styles.infoHeadText}>{label}</Text>
        <Text style={styles.infoContentsText}>{_ct ?? '-'}</Text>
      </View>
    )
  },
  chip: ({ label, ct, searchValue = "", replaceValue = "" }: IPropsChips): JSX.Element => {
    let _ct: string[] = [];

    if (ct) {
      _ct = ct.map((item) => item.replaceAll(searchValue, replaceValue).replaceAll(/\[.*?\]/g, ''))
    }

    return (
      <View style={styles.info}>
        <Text style={styles.infoHeadText}>{label}</Text>
        <View style={styles.infoChipsWrapper}>
          {ct.map((item, index) => (
            (item != '') && <CustomChip key={index} text={item} textStyle={styles.infoChipsText} />
          ))}
        </View>
      </View>
    )
  },
};

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
  infoChipsWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8
  },
  infoChipsText: {
    fontSize: font(14),
  }
})

export default PillInfo;