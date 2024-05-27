import { font, os } from "@/style/font";
import axios from "axios";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Config from "react-native-config";
import { SvgXml } from "react-native-svg";

const UpdateText = () => {
  const [date, setDate] = useState<string>('');

  const getDetailData = async () => {
    const URL = Config.API_URL + '/app-initial/db-update-date';
    await axios.get(URL).then((res) => {
      if (res.data.success) {
        setDate(res.data?.data?.updateDate ?? '...');
      } else {
        setDate('0000-00-00');
      }
    }).catch((err) => {
      setDate('0000-00-00');
    });
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
      paddingTop: 20,
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