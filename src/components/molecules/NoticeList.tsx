import React from 'react';
import { View, StyleSheet } from 'react-native';
import { INoticeData } from '@/types/TNoticeType';
import NoticeData from '@components/atoms/NoticeData';

const NoticeList = ({ noticeData }: { noticeData: INoticeData[] }) => {
  return (
    <View style={styles.noticeListWrapper}>
      {noticeData.map((notice: INoticeData, index: number) => {
        return (
          <View key={index}>
            <NoticeData noticeData={notice} />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  noticeListWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
});

export default NoticeList;
