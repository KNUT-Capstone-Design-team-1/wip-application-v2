import nearbyPharmacy from '@assets/images/btn_img_nearby.png';
import pillIdentificationSearch from '@assets/images/btn_img_id_search.png';
import pillImageSearch from '@assets/images/btn_img_image_search.png';
import pillSave from '@assets/images/btn_img_storage.png';

export const BUTTON_LIST = [
  {
    img: pillIdentificationSearch,
    path: '/pill-identification-search',
    backgroundColor: '#FFB55B',
    title: '식별 검색',
    content: '식별 검색으로 알약을 찾습니다',
  },
  {
    img: pillImageSearch,
    path: '/pill-image-search',
    backgroundColor: '#2FB6FF',
    title: '이미지 검색',
    content: '사진으로 알약을 검색합니다',
  },
  {
    img: nearbyPharmacy,
    path: '/nearby-pharmacy',
    backgroundColor: '#2F71FF',
    title: '가까운 약국',
    content: '주변 약국을 찾습니다',
  },
  {
    img: pillSave,
    path: '/pill-save',
    backgroundColor: '#B521FF',
    title: '알약 보관함',
    content: '저장한 알약 정보를 확인합니다',
  },
];
