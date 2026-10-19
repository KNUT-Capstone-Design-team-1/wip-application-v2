import { memo } from 'react';
import { View } from 'react-native';
import { BaseText } from '@components/common/BaseText';
import { styles } from '../../styles/molecules/PillSafetySection';
import type { PillDetailDataProps } from '../../types/pill_detail_component_type';
import ExternalLinkButton from '../atoms/SafetyExternalLinkButton';
import PillSafetyDisclaimer from './PillSafetyDisclaimer';
import WarningRow from './WarningRow';

// 주의·특수 분류 정보 구성.
const PillSafetySection = ({ data }: PillDetailDataProps) => {
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
        urlKey="nifdsUrl"
        materialEngName={data.MATERIAL_ENG_NAME}
      />

      <WarningRow
        label="도핑 금지"
        isWarning={data.isProhibited}
        items={data.prohibitedIngredients}
        footerNote={[
          ...(data.prohibitedNotes || []),
          '※ 적용 범위 및 상세 정보는 KADA 홈페이지 참고',
        ].join('\n')}
      />

      <ExternalLinkButton
        title="도핑 금지 약물 확인 (KADA)"
        urlKey="kadaUrl"
        materialEngName={data.MATERIAL_ENG_NAME}
      />

      <PillSafetyDisclaimer data={data} />
    </View>
  );
};

export default memo(PillSafetySection);
