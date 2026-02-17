import { useRouter } from 'expo-router';
import { requestGetPillDetail } from '@/src/services/apis/google_cloud/wip_pill_detail';
import { useCallback } from 'react';

export const usePillSearchResultList = () => {
  const router = useRouter();
  const searchItemClickHandler = async (seq: string, itemImage: string) => {
    const itemDetail = await requestGetPillDetail(seq);

    router.push({
      pathname: '/pill-search-result-detail',
      params: {
        itemDetail: JSON.stringify(itemDetail),
        itemImage: itemImage,
      },
    });
  };

  const keyExtractor = useCallback((item: any, index: number) => {
    // ITEM_SEQ를 우선 사용하여 안정적인 key 보장
    if (item.ITEM_SEQ) {
      return String(item.ITEM_SEQ);
    }
    // ITEM_SEQ가 없는 경우 여러 필드 조합으로 고유 key 생성
    return `pill-${item.ITEM_NAME || 'unknown'}-${item.ENTP_NAME || ''}-${index}`;
  }, []);

  return {
    keyExtractor,
    searchItemClickHandler,
  };
};
