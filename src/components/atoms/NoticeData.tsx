import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { INoticeData } from '@/types/TNoticeType';
import { useNavigation } from '@react-navigation/native';

interface NoticeDataProps {
  noticeData: INoticeData;
}

const NoticeData = ({ noticeData }: NoticeDataProps) => {
  const navigation: any = useNavigation();

  const handlePress = () => {
    // 공지사항 상세 화면으로 이동
    navigation.navigate('NoticeDetail', { notice: noticeData });
  };

  return (
    <TouchableOpacity style={styles.noticeDataWrapper} onPress={handlePress}>
      <View>
        <Text style={styles.noticeTitle}>{noticeData.title}</Text>
        <Text style={styles.noticeDate}>{noticeData.createDate}</Text>
      </View>
      {noticeData.mustRead === 1 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>필독</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  noticeDataWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  noticeDate: {
    fontSize: 12,
    color: '#999',
  },
  badge: {
    backgroundColor: '#5451d1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default NoticeData;
