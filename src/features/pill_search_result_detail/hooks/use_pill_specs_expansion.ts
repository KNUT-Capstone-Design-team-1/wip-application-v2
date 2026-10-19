import { useCallback, useEffect, useState } from 'react';
import { IPillDetail } from '../types/pill_detail_type';
import { hasMoreInfoKeyword } from '../utils/pill_specs_fields';
import { useKeywordNavigationActions } from './use_keyword_navigation_actions';

// 제원 접기 상태·키워드 검색 시 자동 펼침 관리.
export const usePillSpecsExpansion = (data: IPillDetail) => {
  const [moreInfo, setMoreInfo] = useState(false);
  const { registerOpener } = useKeywordNavigationActions();
  const toggle = useCallback(() => setMoreInfo((previous) => !previous), []);
  const openForKeywords = useCallback(
    (keywords: readonly string[]) => {
      if (!hasMoreInfoKeyword(data, keywords)) {
        return;
      }

      setMoreInfo(true);
    },
    [data],
  );

  useEffect(
    () => registerOpener(openForKeywords),
    [registerOpener, openForKeywords],
  );

  return { moreInfo, toggle };
};
