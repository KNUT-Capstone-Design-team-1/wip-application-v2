import { useCallback } from 'react';
import { Alert, Linking } from 'react-native';
import { useExternalUrlStore } from '@store/external_url_store';
import logger from '@utils/logger';
import type { IPillDetail } from '../types/pill_detail_type';

// 분류 정보 신고 메일 열기.
export const usePillSafetyReportActions = (
  data: Pick<IPillDetail, 'ITEM_NAME' | 'ITEM_SEQ'>,
) => {
  const handleReport = useCallback(() => {
    const { reportEmail } = useExternalUrlStore.getState();
    const subject = encodeURIComponent(
      `[잘못된 정보 신고] ${data.ITEM_NAME} (${data.ITEM_SEQ})`,
    );
    const body = encodeURIComponent(
      `안녕하세요.\n\n'${data.ITEM_NAME}' (코드: ${data.ITEM_SEQ}) 의 주의 및 특수 분류 정보가 잘못되었음을 신고합니다.\n\n[신고 내용]\n(여기에 잘못된 부분과 올바른 정보를 입력해 주세요.)\n\n감사합니다.`,
    );

    const url = `mailto:${reportEmail}?subject=${subject}&body=${body}`;

    Alert.alert(
      '이메일 앱 열기',
      '잘못된 정보 신고를 위해 이메일 앱으로 이동합니다. 이동하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '이동',
          onPress: async () => {
            try {
              await Linking.openURL(url);
            } catch (e) {
              logger.error(
                `Failed to open email client for reporting. URL: ${url}. ${(e as Error).stack || e}`,
              );

              Alert.alert(
                '오류',
                `이메일 앱을 열 수 없습니다.\n${reportEmail} 로 직접 메일을 보내주세요.`,
              );
            }
          },
        },
      ],
      { cancelable: true },
    );
  }, [data.ITEM_NAME, data.ITEM_SEQ]);

  return { handleReport };
};
