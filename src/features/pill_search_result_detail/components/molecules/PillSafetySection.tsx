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
      <View style={styles.titleContainer}>
        <BaseText weight="bold" size={16} style={styles.title}>
          [ 주의 및 특수 분류 정보 ]
        </BaseText>
        <BaseText weight="regular" size={10.5} style={styles.keywordHint}>
          키워드를 누르면 본문에서 찾아볼 수 있어요.
        </BaseText>
      </View>

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
        label="도핑 관련 문서"
        variant="reference"
        prefixLabel="언급된 성분: "
        isWarning={data.hasProhibitedReferences}
        items={data.prohibitedIngredients}
        footerNote="※ 문서 언급 여부이며 금지 판정이 아닙니다. 적용 조건은 KADA에서 확인해 주세요."
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
