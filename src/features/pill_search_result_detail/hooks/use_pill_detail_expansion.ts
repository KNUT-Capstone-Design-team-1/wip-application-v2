import { useCallback, useEffect, useState } from 'react';
import type { IPillDetail } from '../types/pill_detail_type';
import { hasMoreInfoKeyword } from '../utils/pill_specs_fields';
import { useKeywordNavigationContext } from './use_keyword_navigation_context';

// 제원 접기 상태·키워드 검색 시 자동 펼침 관리.
export const usePillSpecsExpansion = (data: IPillDetail | null) => {
  const [moreInfo, setMoreInfo] = useState(false);
  const {
    controller: { registerOpener },
  } = useKeywordNavigationContext();

  const toggle = useCallback(() => setMoreInfo((previous) => !previous), []);

  const openForKeywords = useCallback(
    (keywords: readonly string[]) => {
      const hasNoMatchingInfo = !data || !hasMoreInfoKeyword(data, keywords);

      if (hasNoMatchingInfo) {
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

// 각 문서의 접기 상태·검색 시 자동 펼침 관리.
export const useDetailSectionExpansion = () => {
  const [isOpen, setOpen] = useState(true);
  const {
    controller: { registerOpener },
  } = useKeywordNavigationContext();

  const toggle = useCallback(() => setOpen((previous) => !previous), []);

  const open = useCallback(() => setOpen(true), []);

  useEffect(() => registerOpener(open), [registerOpener, open]);

  return { isOpen, toggle };
};
