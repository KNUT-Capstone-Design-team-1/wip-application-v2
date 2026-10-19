import { memo } from 'react';
import type { PillDetailDataProps } from '../../types/pill_detail_component_type';
import DetailSection from './DetailSection';

// 효능·용법·주의 문서 그룹 배치.
const PillDescriptionSection = ({ data }: PillDetailDataProps) => (
  <>
    <DetailSection title="효능/효과" content={data.EE_DOC_DATA} />
    <DetailSection title="용법/용량" content={data.UD_DOC_DATA} />
    <DetailSection title="사용상 주의사항" content={data.NB_DOC_DATA} />
  </>
);

export default memo(PillDescriptionSection);
