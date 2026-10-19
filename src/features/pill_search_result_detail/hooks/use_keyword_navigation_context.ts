import { useContext } from 'react';
import { KeywordNavigationContext } from '../contexts/keyword_navigation_context';

// 상세 화면의 Store·제어기 접근.
export const useKeywordNavigationContext = () => {
  const context = useContext(KeywordNavigationContext);

  if (!context) {
    throw new Error('KeywordNavigationProvider is required.');
  }

  return context;
};
