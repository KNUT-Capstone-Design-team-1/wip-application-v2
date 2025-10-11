import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { INoticeData } from '@/types/TNoticeType';

const NoticeDetailContent = ({
  noticeDetailContent,
}: {
  noticeDetailContent: INoticeData;
}) => {
  return (
    <View style={styles.noticeDetailWrapper}>
      <Text style={styles.noticeTitle}>{noticeDetailContent.title}</Text>
      <Text style={styles.noticeDate}>{noticeDetailContent.createDate}</Text>
      <View style={styles.hr} />
      <Text style={styles.noticeContent}>
        {noticeDetailContent.contents ?? '내용이 없습니다.'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  noticeDetailWrapper: {
    display: 'flex',
    padding: 10,
  },
  noticeTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    color: '#333',
  },
  noticeDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  hr: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginTop: 15,
  },
  noticeContent: {
    marginTop: 20,
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
  },
});

export default NoticeDetailContent;
