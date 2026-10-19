import PillPhysicalSpecs from './specs/PillPhysicalSpecs';
import PillIngredientSpecs from './specs/PillIngredientSpecs';
import PillManagementSpecs from './specs/PillManagementSpecs';
import PillOtherSpecs from './specs/PillOtherSpecs';
import { memo } from 'react';
import { View } from 'react-native';
import InfoRow from '@features/shared/components/InfoRow';
import { IPillDetail } from '../../types/pill_detail_type';
import { styles } from '../../styles/molecules/PillSpecsSection';

interface IPillSpecsSectionProps {
  data: IPillDetail;
  moreInfo: boolean;
}

// 기본·확장 제원 그룹 구성.
const PillSpecsSection = ({ data, moreInfo }: IPillSpecsSectionProps) => {
  return (
    <View style={styles.infoWrapper}>
      <InfoRow label="제조사" value={data.ENTP_NAME} />
      <InfoRow label="주성분" value={data.MAIN_ITEM_INGR} />
      <InfoRow label="분류명" value={data.CLASS_NAME} />
      <InfoRow label="모양" value={data.DRUG_SHAPE} />
      <InfoRow label="제형" value={data.FORM_CODE} />
      <InfoRow label="성상" value={data.CHART} />
      <InfoRow
        label="식별 문자"
        value={`앞: ${data.PRINT_FRONT || '-'} / 뒤: ${data.PRINT_BACK || '-'}`}
      />
      <InfoRow label="포장 단위" value={data.PACK_UNIT} />
      <InfoRow label="유효 기간" value={data.VALID_TERM} />

      {/* 더보기 정보 */}
      {moreInfo && (
        <>
          <PillPhysicalSpecs data={data} />
          <PillIngredientSpecs data={data} />
          <PillManagementSpecs data={data} />
          <PillOtherSpecs data={data} />
        </>
      )}
    </View>
  );
};

export default memo(PillSpecsSection);
