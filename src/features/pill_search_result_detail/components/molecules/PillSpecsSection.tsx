import { memo } from 'react';
import { View } from 'react-native';
import { useStore } from 'zustand';
import InfoRow from '@features/shared/components/InfoRow';
import { usePillDetailContext } from '../../hooks/use_pill_detail_context';
import { usePillSpecsExpansion } from '../../hooks/use_pill_detail_expansion';
import { styles } from '../../styles/molecules/PillSpecsSection';
import PillSpecsToggle from '../atoms/PillSpecsToggle';
import KeywordInfoRow from './KeywordInfoRow';
import PillIngredientSpecs from './specs/PillIngredientSpecs';
import PillManagementSpecs from './specs/PillManagementSpecs';
import PillOtherSpecs from './specs/PillOtherSpecs';
import PillPhysicalSpecs from './specs/PillPhysicalSpecs';

// 기본·확장 제원 그룹 구성.
const PillSpecsSection = () => {
  const store = usePillDetailContext();
  const data = useStore(store, (state) => state.pillData);
  const { moreInfo, toggle } = usePillSpecsExpansion(data);

  if (!data) {
    return null;
  }

  return (
    <>
      <View style={styles.infoWrapper}>
        <InfoRow label="제조사" value={data.ENTP_NAME} />
        <KeywordInfoRow
          label="주성분"
          targetId="specs:mainIngredient"
          text={data.MAIN_ITEM_INGR}
        />
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
      <PillSpecsToggle isExpanded={moreInfo} onToggle={toggle} />
    </>
  );
};

export default memo(PillSpecsSection);
