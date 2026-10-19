import { useContext } from 'react';
import { PillDetailContext } from '../contexts/pill_detail_context';

// 화면별 Store 의존성 접근.
export const usePillDetailContext = () => {
  const store = useContext(PillDetailContext);

  if (!store) {
    throw new Error('PillDetailProvider is required.');
  }

  return store;
};
