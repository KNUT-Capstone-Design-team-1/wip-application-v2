import { useRouter } from 'expo-router';
import { requestGetPillDetail } from '@/src/services/apis/google_cloud/wip_pill_detail';

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

  return {
    searchItemClickHandler,
  };
};
