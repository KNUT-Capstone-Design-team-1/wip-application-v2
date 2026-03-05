import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/NoticeItem';
import { useNavigation } from '@react-navigation/native';
import { INoticeItemProps } from '../types/notice_type';
import { formatDate, isModified } from '../../../utils/dateUtils';

const NoticeItem = ({ noticeData }: INoticeItemProps) => {
  const navigation: any = useNavigation();

  const handlePress = () => {
    // 공지사항 상세 화면으로 이동
    navigation.navigate('공지사항 상세', { notice: noticeData });
  };

  const isContentModified = isModified(
    noticeData.createDate,
    noticeData.updateDate,
  );

  return (
    <TouchableOpacity style={styles.noticeDataWrapper} onPress={handlePress}>
      <View>
        <Text style={styles.noticeTitle}>{noticeData.title}</Text>
        <Text style={styles.noticeDate}>
          {formatDate(noticeData.createDate)}
          {isContentModified && ' (수정)'}
        </Text>
      </View>
      {noticeData.mustRead === 1 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>필독</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default NoticeItem;
