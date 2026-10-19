import { memo } from 'react';
import { PillSpecField } from '../../../types/pill_specs_type';
import KeywordInfoRow from '../KeywordInfoRow';

interface Props {
  fields: readonly PillSpecField[];
  targetPrefix: string;
}

// 제원 표시 문구를 강조·탐색 항목으로 등록.
const PillSpecRows = ({ fields, targetPrefix }: Props) => (
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
