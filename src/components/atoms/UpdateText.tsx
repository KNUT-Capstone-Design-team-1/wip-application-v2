import { font, os } from "@/style/font";
import { getItem } from "@/utils/storage";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const UpdateText = () => {
  const [date, setDate] = useState<string>('');

  const getDetailData = async () => {
    const updateDate = await getItem('lastUpdateDate')
    setDate(updateDate ?? '0000-00-00')
  }

  useEffect(() => {
    getDetailData();
  }, [])

  const styles = StyleSheet.create({
    updateViewWrapper: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 6,
      paddingTop: 12,
      paddingRight: 14,
      paddingBottom: 12,
    },
    updateText: {
      fontFamily: os.font(400, 400),
      fontSize: font(14),
      color: '#777',
      includeFontPadding: false,
    },
  });

  return (

    <View style={styles.updateViewWrapper}>
      {!!date &&
        <Text style={styles.updateText}>정보 업데이트 날짜 : {date}</Text>
      }
    </View>
  )
}

export default UpdateText;