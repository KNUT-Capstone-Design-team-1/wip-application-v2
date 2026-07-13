import React from 'react';
import { View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '../styles/NoticeDetailContent';
import { INoticeData } from '../types/notice_type';
import RenderNoticeContent from './RenderNoticeContent';
import { formatDate, isModified } from '../../../utils/dateUtils';

const NoticeDetailContent = ({
  noticeDetailContent,
}: {
  noticeDetailContent: INoticeData;
}) => {
  // 생성일, 수정일 다른지 비교
  const isContentModified = isModified(
    noticeDetailContent.createDate,
    noticeDetailContent.updateDate,
  );

  return (
    <View style={styles.noticeDetailWrapper}>
      <BaseText size={20} weight="bold" style={styles.noticeTitle}>
        {noticeDetailContent.title}
      </BaseText>
      <View style={styles.noticeDateWrapper}>
        <BaseText
          size={12}
          weight="regular"
          style={styles.noticeDate}
        >{`등록일 : ${formatDate(noticeDetailContent.createDate)}`}</BaseText>
        {isContentModified && (
          <BaseText
            size={12}
            weight="regular"
            style={styles.noticeDate}
          >{`수정일 : ${formatDate(noticeDetailContent.updateDate)}`}</BaseText>
        )}
      </View>
      <View style={styles.hr} />
      <BaseText size={14} weight="medium" style={styles.noticeContent}>
        {noticeDetailContent.contents ? (
          <RenderNoticeContent contents={noticeDetailContent.contents} />
        ) : (
          <View>
            <BaseText size={14} weight="medium">
              &apos;내용이 없습니다.&apos;
            </BaseText>
          </View>
        )}
        {/*{noticeDetailContent.contents ?? '내용이 없습니다.'}*/}
      </BaseText>
    </View>
  );
};

export default NoticeDetailContent;
