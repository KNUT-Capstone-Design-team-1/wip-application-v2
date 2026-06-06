import { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, Linking, Alert } from 'react-native';
import InfoRow from '../atoms/InfoRow';
import { IPillDetail } from '../../types/pill_detail_type';
import { styles } from '../../styles/molecules/PillSafetySection';
import { useExternalUrlStore } from '@store/external_url_store';
import logger from '@utils/logger';

/*
TODO: 잘못된 정보 신고하기 시 메일 앱으로 이동 전 Dialog/Alert를 표시하여 사용자에게 이동여부를 묻는 중간단계가 필요
*/

interface IPillSafetySectionProps {
  data: IPillDetail;
}

const PillSafetySection = ({ data }: IPillSafetySectionProps) => {
  const { reportEmail, nifdsUrl, kadaUrl } = useExternalUrlStore();

  const handleReport = useCallback(async () => {
    const subject = encodeURIComponent(
      `[잘못된 정보 신고] ${data.ITEM_NAME} (${data.ITEM_SEQ})`,
    );
    const body = encodeURIComponent(
      `안녕하세요.\n\n'${data.ITEM_NAME}' (코드: ${data.ITEM_SEQ}) 의 주의 및 특수 분류 정보가 잘못되었음을 신고합니다.\n\n[신고 내용]\n(여기에 잘못된 부분과 올바른 정보를 입력해 주세요.)\n\n감사합니다.`,
    );

    const url = `mailto:${reportEmail}?subject=${subject}&body=${body}`;

    try {
      await Linking.openURL(url);
    } catch (e) {
      logger.error(
        `Failed to open email client for reporting. URL: ${url}. ${e.stack || e}`,
      );

      Alert.alert(
        '신고하기 실패',
        `이메일 앱을 열 수 없습니다. ${reportEmail} 로 직접 메일을 보내주세요.`,
      );
    }
  }, [data.ITEM_NAME, data.ITEM_SEQ, reportEmail]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>[ 주의 및 특수 분류 정보 ]</Text>
      <InfoRow
        label="운전/기계조작"
        value={
          data.isDrivingWarning ? (
            <Text style={styles.warningText}>⚠️ 주의 (O)</Text>
          ) : (
            '안전 (X)'
          )
        }
      />

      <InfoRow
        label="마약류 (마약)"
        value={
          data.isNarcotic ? (
            <>
              <Text style={styles.warningText}>확인됨</Text>
              {`\n해당 성분: `}
              <Text style={styles.warningText}>
                {Array.isArray(data.narcoticIngredients)
                  ? data.narcoticIngredients.join(', ')
                  : '-'}
              </Text>
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
              <Text style={styles.warningText}>확인됨</Text>
              {`\n해당 성분: `}
              <Text style={styles.warningText}>
                {Array.isArray(data.cannabisIngredients)
                  ? data.cannabisIngredients.join(', ')
                  : '-'}
              </Text>
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
              <Text style={styles.warningText}>확인됨</Text>
              {`\n해당 성분: `}
              <Text style={styles.warningText}>
                {Array.isArray(data.psychotropicIngredients)
                  ? data.psychotropicIngredients.join(', ')
                  : '-'}
              </Text>
            </>
          ) : (
            '해당 없음 (X)'
          )
        }
      />

      <TouchableOpacity
        style={styles.externalLinkButton}
        onPress={() => Linking.openURL(nifdsUrl)}
      >
        <Text style={styles.externalLinkButtonText}>
          마약 정보 데이터베이스
        </Text>
      </TouchableOpacity>

      <InfoRow
        label="도핑 금지"
        value={
          data.isProhibited ? (
            <>
              <Text style={styles.warningText}>주의 성분 </Text>
              <Text style={styles.warningText}>
                {Array.isArray(data.prohibitedIngredients)
                  ? data.prohibitedIngredients.join(', ')
                  : '-'}
              </Text>
              {`)\n적용 범위 및 상세 정보는 KADA 홈페이지 참고`}
            </>
          ) : (
            '해당 없음 (X)'
          )
        }
      />

      <TouchableOpacity
        style={styles.externalLinkButton}
        onPress={() => Linking.openURL(kadaUrl)}
      >
        <Text style={styles.externalLinkButtonText}>
          도핑 금지 약물 확인 (KADA)
        </Text>
      </TouchableOpacity>

      <View style={styles.disclaimerContainer}>
        <Text style={styles.disclaimerText}>
          * 데이터 특성상 정보가 부정확하거나 변경되었을 수 있습니다. 최신
          정보는 마약 정보 데이터베이스 및 KADA 홈페이지를 확인해 주세요.
        </Text>
        <TouchableOpacity style={styles.reportButton} onPress={handleReport}>
          <Text style={styles.reportButtonText}>잘못된 정보 신고하기</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sourceText}>
        * 출처: 식약처 마약정보DB, 한국도핑방지위원회(KADA)
      </Text>
    </View>
  );
};

export default memo(PillSafetySection);
