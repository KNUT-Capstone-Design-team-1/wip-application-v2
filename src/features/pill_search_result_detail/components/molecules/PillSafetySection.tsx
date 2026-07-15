import { memo, useCallback } from 'react';
import { View, TouchableOpacity, Linking, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { BaseText } from '@components/common/BaseText';
import InfoRow from '../atoms/InfoRow';
import { IPillDetail } from '../../types/pill_detail_type';
import { styles } from '../../styles/molecules/PillSafetySection';
import { useExternalUrlStore } from '@store/external_url_store';
import { useToast } from '@hooks/use_toast';
import logger from '@utils/logger';

interface IPillSafetySectionProps {
  data: IPillDetail;
}

const PillSafetySection = ({ data }: IPillSafetySectionProps) => {
  const { reportEmail, nifdsUrl, kadaUrl } = useExternalUrlStore();
  const { showToast } = useToast();

  const handleReport = useCallback(() => {
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
  }, [data.ITEM_NAME, data.ITEM_SEQ, reportEmail]);

  return (
    <View style={styles.container}>
      <BaseText weight="bold" size={16} style={styles.title}>
        [ 주의 및 특수 분류 정보 ]
      </BaseText>
      <InfoRow
        label="운전/기계조작"
        value={
          data.isDrivingWarning ? (
            <>
              <BaseText weight="bold" size={14} style={styles.warningText}>
                ⚠️ 주의
              </BaseText>
              {`\n`}
              <BaseText weight="medium" size={14} style={styles.normalText}>
                해당 문구:{' '}
              </BaseText>
              <BaseText weight="bold" size={14} style={styles.warningText}>
                {Array.isArray(data.drivingWarningKeywords) &&
                data.drivingWarningKeywords.length > 0
                  ? data.drivingWarningKeywords.join(', ')
                  : '-'}
              </BaseText>
            </>
          ) : (
            '해당 없음 (X)'
          )
        }
      />

      <InfoRow
        label="마약류 (마약)"
        value={
          data.isNarcotic ? (
            <>
              <BaseText weight="bold" size={14} style={styles.warningText}>
                ⚠️ 주의
              </BaseText>
              {`\n`}
              <BaseText weight="medium" size={14} style={styles.normalText}>
                해당 성분:{' '}
              </BaseText>
              <BaseText weight="bold" size={14} style={styles.warningText}>
                {Array.isArray(data.narcoticIngredients)
                  ? data.narcoticIngredients.join(', ')
                  : '-'}
              </BaseText>
            </>
          ) : (
            '해당 없음 (X)'
          )
        }
      />
      <InfoRow
        label="마약류 (대마)"
        value={
          data.isCannabis ? (
            <>
              <BaseText weight="bold" size={14} style={styles.warningText}>
                ⚠️ 주의
              </BaseText>
              {`\n`}
              <BaseText weight="medium" size={14} style={styles.normalText}>
                해당 성분:{' '}
              </BaseText>
              <BaseText weight="bold" size={14} style={styles.warningText}>
                {Array.isArray(data.cannabisIngredients)
                  ? data.cannabisIngredients.join(', ')
                  : '-'}
              </BaseText>
            </>
          ) : (
            '해당 없음 (X)'
          )
        }
      />
      <InfoRow
        label="마약류 (향정)"
        value={
          data.isPsychotropic ? (
            <>
              <BaseText weight="bold" size={14} style={styles.warningText}>
                ⚠️ 주의
              </BaseText>
              {`\n`}
              <BaseText weight="medium" size={14} style={styles.normalText}>
                해당 성분:{' '}
              </BaseText>
              <BaseText weight="bold" size={14} style={styles.warningText}>
                {Array.isArray(data.psychotropicIngredients)
                  ? data.psychotropicIngredients.join(', ')
                  : '-'}
              </BaseText>
            </>
          ) : (
            '해당 없음 (X)'
          )
        }
      />

      <TouchableOpacity
        style={styles.externalLinkButton}
        onPress={async () => {
          if (data.MATERIAL_ENG_NAME) {
            await Clipboard.setStringAsync(data.MATERIAL_ENG_NAME);

            showToast({
              message: `검색 지원을 위해 ${data.MATERIAL_ENG_NAME}이(가) 복사되었습니다.`,
            });
          }

          Linking.openURL(nifdsUrl);
        }}
      >
        <BaseText weight="bold" size={14} style={styles.externalLinkButtonText}>
          마약 정보 데이터베이스
        </BaseText>
      </TouchableOpacity>

      <InfoRow
        label="도핑 금지"
        value={
          data.isProhibited ? (
            <>
              <BaseText weight="bold" size={14} style={styles.warningText}>
                ⚠️ 주의
              </BaseText>
              {`\n`}
              <BaseText weight="medium" size={14} style={styles.normalText}>
                해당 성분:{' '}
              </BaseText>
              <BaseText weight="bold" size={14} style={styles.warningText}>
                {Array.isArray(data.prohibitedIngredients)
                  ? data.prohibitedIngredients.join(', ')
                  : '-'}
              </BaseText>
              <BaseText
                weight="semiBold"
                size={11}
                style={styles.smallInfoText}
              >
                {`\n※ 적용 범위 및 상세 정보는 KADA 홈페이지 참고`}
              </BaseText>
            </>
          ) : (
            '해당 없음 (X)'
          )
        }
      />

      <TouchableOpacity
        style={styles.externalLinkButton}
        onPress={async () => {
          if (data.ITEM_NAME) {
            await Clipboard.setStringAsync(data.ITEM_NAME);

            showToast({
              message: `검색 지원을 위해 ${data.ITEM_NAME}이(가) 복사되었습니다.`,
            });
          }

          Linking.openURL(kadaUrl);
        }}
      >
        <BaseText weight="bold" size={14} style={styles.externalLinkButtonText}>
          도핑 금지 약물 확인 (KADA)
        </BaseText>
      </TouchableOpacity>

      <View style={styles.disclaimerContainer}>
        <BaseText weight="semiBold" size={12} style={styles.disclaimerText}>
          * 데이터 특성상 정보가 부정확하거나 변경되었을 수 있습니다. 최신
          정보는 마약 정보 데이터베이스 및 KADA 홈페이지를 확인해 주세요.
        </BaseText>
        <TouchableOpacity style={styles.reportButton} onPress={handleReport}>
          <BaseText weight="semiBold" size={12} style={styles.reportButtonText}>
            잘못된 정보 신고하기
          </BaseText>
        </TouchableOpacity>
      </View>

      <BaseText weight="semiBold" size={12} style={styles.sourceText}>
        * 출처: 식약처 마약정보DB, 한국도핑방지위원회(KADA)
      </BaseText>
    </View>
  );
};

export default memo(PillSafetySection);
