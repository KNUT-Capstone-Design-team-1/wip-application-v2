import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/NoticeDetailContent';
import { INoticeData } from '../types/notice_type';
import RenderNoticeContent from './RenderNoticeContent';
import { formatDate, isModified } from '../../../utils/dateUtils';

const NoticeDetailContent = ({ noticeDetailContent, }: {
  noticeDetailContent: INoticeData;
}) => {
  // 생성일, 수정일 다른지 비교
  const isContentModified = isModified(
    noticeDetailContent.createDate,
    noticeDetailContent.updateDate,
  );

  return (
    <View style={styles.noticeDetailWrapper}>
      <Text style={styles.noticeTitle}>{noticeDetailContent.title}</Text>
      <View style={styles.noticeDateWrapper}>
        <Text
          style={styles.noticeDate}
        >{`등록일 : ${formatDate(noticeDetailContent.createDate)}`}</Text>
        {isContentModified && (
          <Text
            style={styles.noticeDate}
          >{`수정일 : ${formatDate(noticeDetailContent.updateDate)}`}</Text>
        )}
      </View>
      <View style={styles.hr} />
      <Text style={styles.noticeContent}>
        {
          noticeDetailContent.contents
            ? <RenderNoticeContent contents={noticeDetailContent.contents} />
            : <View><Text>'내용이 없습니다.'</Text></View>
        }
        {/*{noticeDetailContent.contents ?? '내용이 없습니다.'}*/}
      </Text>
    </View>
  );
};

export default NoticeDetailContent;
