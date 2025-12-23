import { font, os } from '@/style/font';
import { getItem } from '@/utils/storage';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const UpdateText = () => {
  const [date, setDate] = useState<string>('');

  const getDetailData = async () => {
    const updateDate = await getItem('lastUpdateDate');
    setDate(updateDate ?? '0000-00-00');
  };

  useEffect(() => {
    getDetailData();
  }, []);

  const styles = StyleSheet.create({
    updateText: {
      color: '#444',
      fontFamily: os.font(400, 400),
      fontSize: font(14),
      includeFontPadding: false,
    },
    updateViewWrapper: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      gap: 6,
      justifyContent: 'flex-end',
      paddingBottom: 12,
      paddingRight: 14,
      paddingTop: 12,
    },
  });

  return (
    <View style={styles.updateViewWrapper}>
      {!!date && (
        <Text style={styles.updateText}>정보 업데이트 날짜 : {date}</Text>
      )}
    </View>
  );
};

export default UpdateText;
