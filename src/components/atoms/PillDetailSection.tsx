import { font, os } from "@/style/font"
import { View, Text, StyleSheet } from "react-native"

export const PillDetailSection = ({ parsedData }: { parsedData: string[] | null | undefined }): JSX.Element => {
  return (
    <View style={styles.detailInfoContents}>
      {!parsedData || parsedData.length === 0 ? (
        <Text style={styles.emptyText}>정보가 없습니다.</Text>
      ) : (
        parsedData.map((item, index) => (
          <Text key={index} style={styles.detailInfoContentsText}>
            {item}
          </Text>
        ))
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  detailInfoContents: {
    gap: 10,
    marginBottom: 16,
  },
  detailInfoContentsText: {
    color: '#000000',
    fontSize: font(18),
    fontFamily: os.font(400, 400),
    includeFontPadding: false,
    paddingBottom: 2,
  },
  emptyText: {
    color: '#aaa',
  },
})