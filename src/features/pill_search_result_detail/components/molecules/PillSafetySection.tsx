// 주의 및 특수 분류 정보를 표시하고 관련 외부 링크 및 오류 신고 기능을 제공하는 섹션 컴포넌트
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

interface IWarningRowProps {
  label: string;
  isWarning?: boolean;
  prefixLabel?: string;
  items?: string[] | null;
  footerNote?: string;
}

// 주의 및 특수 분류 정보를 통일된 포맷으로 렌더링하는 경고 행 컴포넌트
const WarningRow = memo(
  ({
    label,
    isWarning = false,
    prefixLabel = '해당 성분: ',
    items,
    footerNote,
  }: IWarningRowProps) => {
    const value = isWarning ? (
      <>
        <BaseText weight="bold" size={14} style={styles.warningText}>
          ⚠️ 주의
        </BaseText>
        {`\n`}
        <BaseText weight="medium" size={14} style={styles.normalText}>
          {prefixLabel}
        </BaseText>
        <BaseText weight="bold" size={14} style={styles.warningText}>
          {Array.isArray(items) && items.length > 0 ? items.join(', ') : '-'}
        </BaseText>
        {footerNote ? (
          <BaseText weight="semiBold" size={11} style={styles.smallInfoText}>
            {`\n${footerNote}`}
          </BaseText>
        ) : null}
      </>
    ) : (
      '해당 없음 (X)'
    );

    return <InfoRow label={label} value={value} />;
  },
);

WarningRow.displayName = 'WarningRow';

interface IExternalLinkButtonProps {
  title: string;
  url: string;
  materialEngName?: string;
}

// 영문 성분명을 복사하고 외부 링크 URL로 이동하는 버튼 컴포넌트
const ExternalLinkButton = memo(
  ({ title, url, materialEngName }: IExternalLinkButtonProps) => {
    const { showToast } = useToast();

    const handlePress = useCallback(async () => {
      if (materialEngName) {
        await Clipboard.setStringAsync(materialEngName);

        showToast({
          message: `검색 지원을 위해 영문 성분명 (${materialEngName})이 복사되었습니다.`,
        });
      }

      // 토스트 애니메이션이 충분히 보일 수 있도록 대기 후 브라우저 이동
      setTimeout(() => {
        Linking.openURL(url);
      }, 800);
    }, [materialEngName, showToast, url]);

    return (
      <TouchableOpacity style={styles.externalLinkButton} onPress={handlePress}>
        <BaseText weight="bold" size={14} style={styles.externalLinkButtonText}>
          {title}
        </BaseText>
      </TouchableOpacity>
    );
  },
);

ExternalLinkButton.displayName = 'ExternalLinkButton';

interface IPillSafetySectionProps {
  data: IPillDetail;
}

const PillSafetySection = ({ data }: IPillSafetySectionProps) => {
  const { reportEmail, nifdsUrl, kadaUrl } = useExternalUrlStore();

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

      <WarningRow
        label="운전/기계조작"
        isWarning={data.isDrivingWarning}
        prefixLabel="해당 문구: "
        items={data.drivingWarningKeywords}
      />

      <WarningRow
        label="마약류 (마약)"
        isWarning={data.isNarcotic}
        items={data.narcoticIngredients}
      />

      <WarningRow
        label="마약류 (대마)"
        isWarning={data.isCannabis}
        items={data.cannabisIngredients}
      />

      <WarningRow
        label="마약류 (향정)"
        isWarning={data.isPsychotropic}
        items={data.psychotropicIngredients}
      />

      <ExternalLinkButton
        title="마약 정보 데이터베이스"
        url={nifdsUrl}
        materialEngName={data.MATERIAL_ENG_NAME}
      />

      <WarningRow
        label="도핑 금지"
        isWarning={data.isProhibited}
        items={data.prohibitedIngredients}
        footerNote="※ 적용 범위 및 상세 정보는 KADA 홈페이지 참고"
      />

      <ExternalLinkButton
        title="도핑 금지 약물 확인 (KADA)"
        url={kadaUrl}
        materialEngName={data.MATERIAL_ENG_NAME}
      />

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
