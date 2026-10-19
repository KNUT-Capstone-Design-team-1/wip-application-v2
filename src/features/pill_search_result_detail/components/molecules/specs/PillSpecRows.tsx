import { memo } from 'react';
import InfoRow from '@features/shared/components/InfoRow';
import { PillSpecField } from '../../../types/pill_specs_type';
import KeywordText from '../../atoms/KeywordText';

interface Props {
  fields: readonly PillSpecField[];
  targetPrefix: string;
}

// 제원 표시 문구를 강조·탐색 항목으로 등록.
const PillSpecRows = ({ fields, targetPrefix }: Props) => (
  <>
    {fields.map((field) => {
      if (!field.text || field.text === 'null') {
        return null;
      }

      return (
        <InfoRow
          key={field.id}
          label={field.label}
          value={
            <KeywordText
              size={14}
              targetId={targetPrefix + ':' + field.id}
              text={field.text}
            />
          }
        />
      );
    })}
  </>
);

export default memo(PillSpecRows);
