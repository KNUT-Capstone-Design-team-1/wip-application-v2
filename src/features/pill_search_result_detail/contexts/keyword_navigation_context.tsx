import { createContext, PropsWithChildren } from 'react';
import { KeywordNavigationScope } from '../types/keyword_navigation_scope_type';
import { useCreateKeywordNavigationScope } from '../hooks/use_create_keyword_navigation_scope';

export const KeywordNavigationContext =
  createContext<KeywordNavigationScope | null>(null);

// 화면별 Store·이동 제어기 제공.
export const KeywordNavigationProvider = ({ children }: PropsWithChildren) => {
  const scope = useCreateKeywordNavigationScope();

  return (
    <KeywordNavigationContext.Provider value={scope}>
      {children}
    </KeywordNavigationContext.Provider>
  );
};
