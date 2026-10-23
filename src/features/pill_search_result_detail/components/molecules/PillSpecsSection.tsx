import { memo, useMemo } from 'react';
import { BaseText } from '@components/common/BaseText';
import { View } from 'react-native';
import { useStore } from 'zustand';
import { usePillDetailContext } from '../../hooks/use_pill_detail_context';
import { usePillSpecsExpansion } from '../../hooks/use_pill_detail_expansion';
import { styles } from '../../styles/molecules/PillSpecsSection';
import PillSpecsToggle from '../atoms/PillSpecsToggle';
import KeywordInfoRow from './KeywordInfoRow';
import type {
  PillDetailDataProps,
  PillSpecRowsProps,
} from '../../types/pill_detail_component_type';
import {
  getPillBasicFields,
  getPillIngredientFields,
  getPillManagementFields,
  getPillOtherFields,
  getPillPhysicalFields,
} from '../../utils/pill_specs_fields';

// 제원 하위 뷰는 같은 파일에 모으고 기존 필드·탐색 ID·메모이제이션을 유지한다.
const PillSpecRows = memo(({ fields, targetPrefix }: PillSpecRowsProps) => (
  <>
    {fields.map((field) => (
      <KeywordInfoRow
        key={field.id}
        label={field.label}
        text={field.text}
        targetId={targetPrefix + ':' + field.id}
      />
    ))}
  </>
));

const PillBasicSpecs = memo(({ data }: PillDetailDataProps) => {
  const fields = useMemo(() => getPillBasicFields(data), [data]);

  return <PillSpecRows fields={fields} targetPrefix="specs" />;
});

const PillPhysicalSpecs = memo(({ data }: PillDetailDataProps) => {
  const fields = useMemo(() => getPillPhysicalFields(data), [data]);

  return (
    <>
      <PillSpecRows fields={fields.identity} targetPrefix="physical" />
      <BaseText weight="bold" size={16} style={styles.sectionTitle}>
        [ 상세 제원 ]
      </BaseText>
      <PillSpecRows fields={fields.details} targetPrefix="physical" />
    </>
  );
});

const PillIngredientSpecs = memo(({ data }: PillDetailDataProps) => {
  const fields = useMemo(() => getPillIngredientFields(data), [data]);

  return (
    <>
      <BaseText weight="bold" size={16} style={styles.sectionTitle}>
        [ 성분 및 저장 ]
      </BaseText>
      <PillSpecRows fields={fields} targetPrefix="ingredients" />
    </>
  );
});

const PillManagementSpecs = memo(({ data }: PillDetailDataProps) => {
  const fields = useMemo(() => getPillManagementFields(data), [data]);

  return (
    <>
      <BaseText weight="bold" size={16} style={styles.sectionTitle}>
        [ 관리 정보 ]
      </BaseText>
      <PillSpecRows fields={fields} targetPrefix="management" />
    </>
  );
});

const PillOtherSpecs = memo(({ data }: PillDetailDataProps) => {
  const fields = useMemo(() => getPillOtherFields(data), [data]);

  return (
    <>
      <BaseText weight="bold" size={16} style={styles.sectionTitle}>
        [ 기타 ]
      </BaseText>
      <PillSpecRows fields={fields} targetPrefix="other" />
    </>
  );
});

PillSpecRows.displayName = 'PillSpecRows';
PillBasicSpecs.displayName = 'PillBasicSpecs';
PillPhysicalSpecs.displayName = 'PillPhysicalSpecs';
PillIngredientSpecs.displayName = 'PillIngredientSpecs';
PillManagementSpecs.displayName = 'PillManagementSpecs';
PillOtherSpecs.displayName = 'PillOtherSpecs';

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
        <PillBasicSpecs data={data} />

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
