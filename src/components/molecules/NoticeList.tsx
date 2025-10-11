import React from 'react';
import { View, StyleSheet } from 'react-native';
import { INoticeData } from '@/types/TNoticeType';
import { INoticeListProps } from '@/types/atoms.type';
import NoticeItem from '@components/atoms/NoticeItem';

const NoticeList = ({ noticeData }: INoticeListProps) => {
  return (
    <View style={styles.noticeListWrapper}>
      {noticeData.map((notice: INoticeData, index: number) => {
        return (
          <View key={index}>
            <NoticeItem noticeData={notice} />
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
