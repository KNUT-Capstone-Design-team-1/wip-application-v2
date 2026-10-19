import { memo } from 'react';
import type { PillSpecRowsProps } from '../../../types/pill_detail_component_type';
import KeywordInfoRow from '../KeywordInfoRow';

// 제원 표시 문구를 강조·탐색 항목으로 등록.
const PillSpecRows = ({ fields, targetPrefix }: PillSpecRowsProps) => (
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
);

export default memo(PillSpecRows);
