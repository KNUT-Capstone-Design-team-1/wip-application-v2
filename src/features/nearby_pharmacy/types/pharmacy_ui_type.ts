import { ReactNode } from 'react';
import { StyleProp, TextStyle, GestureResponderEvent } from 'react-native';
import { INearbyPharmacies } from '@services/database/types';
import { IStockInquiryPillContext } from './pharmacy_domain_type';

// 주변 약국 토스트 매개변수 타입 정의
export type TPharmacyToastProps = {
  // 토스트 종류 ('success' | 'error' | 'default')
  type?: 'success' | 'error' | 'default';

  // 노출할 메시지 본문
  message: string;

  // 노출 지속 시간 (ms, 기본값: 2000)
  duration?: number;
};

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

// 개별 약국 정보 텍스트 행 Props
export interface IPharmacyInfoRowProps {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  weight: 'bold' | 'semiBold' | 'medium' | 'regular';
  size: number;
  textStyle?: StyleProp<TextStyle>;
  rightElement?: ReactNode;
}

// 내 위치 이동 버튼 Props
export interface IPharmacyLocateButtonProps {
  onPress: () => void;
}

// 현재 위치에서 재검색 버튼 Props
export interface IResearchHereButtonProps {
  loading: boolean;
  onPress: () => void;
}

// 재고 문의 전화 풀 버튼 Props
export interface IStockInquiryCallButtonProps {
  onPress: () => void;
}

// 재고 문의 아이콘 버튼 Props
export interface IStockInquiryIconButtonProps {
  onPress: (e?: GestureResponderEvent) => void;
  size?: number;
  color?: string;
}

// 클러스터 약국 리스트 상단 헤더 Props
export interface IPharmacyClusterListHeaderProps {
  count: number;
  onClosePress: () => void;
}

// 클러스터 약국 리스트 개별 아이템 Props
export interface IPharmacyClusterListItemProps {
  pharmacy: INearbyPharmacies;
  isLast: boolean;
  distanceText: string;
  onPress: (pharmacy: INearbyPharmacies) => void;
}

// 약국 마커 아이콘 Props
export interface IPharmacyMarkerIconProps {
  selected: boolean;
}

// 지도 하단 오버레이 컴포넌트 Props
export interface IPharmacyMapBottomOverlayProps {
  bottomInset: number;
  isOpenOnly: boolean;
  onToggleOpenOnly: () => void;
  onLocate: () => void;
  clusterPharmacies: INearbyPharmacies[] | null;
  selectedPharmacy: INearbyPharmacies | null;
  onClusterPharmacySelect: (pharmacy: INearbyPharmacies) => void;
  onCloseClusterList: () => void;
  onCopyPharmacyInfo: (text: string) => void;
  onClosePharmacyCard: () => void;
  isStockInquiryMode: boolean;
  onOpenInquiryModal: () => void;
}

// 재고 문의 요약 모달 Props
export interface IStockInquirySummaryModalProps {
  isVisible: boolean;
  pharmacy: INearbyPharmacies | null;
  pillContext: IStockInquiryPillContext;
  onClose: () => void;
  onCall: (telephone: string) => void;
}
