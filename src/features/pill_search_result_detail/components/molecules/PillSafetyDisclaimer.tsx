import { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { usePillSafetyReportActions } from '../../hooks/use_pill_safety_report_actions';
import { styles } from '../../styles/molecules/PillSafetySection';
import type { PillDetailDataProps } from '../../types/pill_detail_component_type';

// 출처·신고 안내 표시.
const PillSafetyDisclaimer = ({ data }: PillDetailDataProps) => {
  const { handleReport } = usePillSafetyReportActions(data);

  return (
    <>
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
    </>
  );
};

export default memo(PillSafetyDisclaimer);
