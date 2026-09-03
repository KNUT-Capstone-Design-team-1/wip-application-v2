import { INearbyPharmacies } from '@services/database/types';

// 약국 정보 상세 카드 Props 인터페이스
export interface IPharmacyInfoCardProps {
  // 표시할 약국 데이터
  pharmacy: INearbyPharmacies;

  // 텍스트(주소 등) 복사 핸들러
  onCopyPress: (text: string) => void;

  // 카드 닫기 핸들러
  onClosePress: () => void;

  // 재고 문의 전화 걸기 핸들러
  onStockInquiryPress?: (telephone: string) => void;
}
