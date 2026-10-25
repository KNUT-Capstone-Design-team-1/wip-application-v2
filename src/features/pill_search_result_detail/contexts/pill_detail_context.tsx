import { createContext, PropsWithChildren, useMemo } from 'react';
import { createPillDetailStore } from '../store/pill_detail_store';
import type {
  PillDetailRoute,
  PillDetailStore,
} from '../types/pill_detail_type';

export const PillDetailContext = createContext<PillDetailStore | null>(null);

// 경로별 상세 화면 Store 제공.
export const PillDetailProvider = ({
  itemSeq,
  image,
  children,
}: PropsWithChildren<PillDetailRoute>) => {
  const store = useMemo(
    () => createPillDetailStore({ itemSeq, image }),
    [itemSeq, image],
  );

  return (
    <PillDetailContext.Provider value={store}>
      {children}
    </PillDetailContext.Provider>
  );
};
