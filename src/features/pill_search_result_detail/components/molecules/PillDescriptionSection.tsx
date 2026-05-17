import { useState } from 'react';
import DetailSection from './DetailSection';
import { IPillDetail } from '../../types/pill_detail_type';

interface IPillDescriptionSectionProps {
  data: IPillDetail;
}

const PillDescriptionSection = ({ data }: IPillDescriptionSectionProps) => {
  const [showEffect, setShowEffect] = useState(true);
  const [showUsage, setShowUsage] = useState(true);
  const [showWarning, setShowWarning] = useState(true);

  return (
    <>
      <DetailSection
        title="효능/효과"
        isOpen={showEffect}
        onToggle={() => setShowEffect(!showEffect)}
        content={data.EE_DOC_DATA}
      />

      <DetailSection
        title="용법/용량"
        isOpen={showUsage}
        onToggle={() => setShowUsage(!showUsage)}
        content={data.UD_DOC_DATA}
      />

      <DetailSection
        title="사용상 주의사항"
        isOpen={showWarning}
        onToggle={() => setShowWarning(!showWarning)}
        content={data.NB_DOC_DATA}
      />
    </>
  );
};

export default PillDescriptionSection;
