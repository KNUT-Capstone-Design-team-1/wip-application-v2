import { memo, useState, useCallback, useEffect } from 'react';
import { useKeywordNavigationActions } from '../../hooks/use_keyword_navigation_actions';
import DetailSection from './DetailSection';
import { IPillDetail } from '../../types/pill_detail_type';

interface IPillDescriptionSectionProps {
  data: IPillDetail;
}

// 효능·용법·주의 문서 그룹 구성.
const PillDescriptionSection = ({ data }: IPillDescriptionSectionProps) => {
  const [showEffect, setShowEffect] = useState(true);
  const [showUsage, setShowUsage] = useState(true);
  const [showWarning, setShowWarning] = useState(true);

  const { registerOpener } = useKeywordNavigationActions();
  useEffect(
    () =>
      registerOpener(() => {
        setShowEffect(true);
        setShowUsage(true);
        setShowWarning(true);
      }),
    [registerOpener],
  );

  const toggleEffect = useCallback(() => setShowEffect((prev) => !prev), []);
  const toggleUsage = useCallback(() => setShowUsage((prev) => !prev), []);
  const toggleWarning = useCallback(() => setShowWarning((prev) => !prev), []);

  return (
    <>
      <DetailSection
        title="효능/효과"
        isOpen={showEffect}
        onToggle={toggleEffect}
        content={data.EE_DOC_DATA}
      />

      <DetailSection
        title="용법/용량"
        isOpen={showUsage}
        onToggle={toggleUsage}
        content={data.UD_DOC_DATA}
      />

      <DetailSection
        title="사용상 주의사항"
        isOpen={showWarning}
        onToggle={toggleWarning}
        content={data.NB_DOC_DATA}
      />
    </>
  );
};

export default memo(PillDescriptionSection);
