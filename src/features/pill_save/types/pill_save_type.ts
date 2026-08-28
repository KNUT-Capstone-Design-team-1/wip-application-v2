// 저장된 알약 데이터의 상세 정보 인터페이스
export interface IPillSaveData {
  CHART: string;
  ENTP_NAME: string;
  ITEM_NAME: string;
  ITEM_SEQ: string;
  ITEM_IMAGE: string;
  CLASS_NAME: string;
  PRINT_FRONT: string;
  PRINT_BACK: string;
}

// 알약 보관함 리스트 컴포넌트의 프롭스 인터페이스
export interface IPillSaveListProps {
  pillSaveData: IPillSaveData[];
  onDataChange?: (itemSeq: string) => void;
  isEditing?: boolean;
  selectedSeqs?: string[];
  onItemSelect?: (itemSeq: string) => void;
}

// 개별 알약 보관함 아이템 컴포넌트의 프롭스 인터페이스
export interface IPillSaveContentProps {
  saveData: IPillSaveData;
  onPressDetail: () => void;
  onPressDelete: () => void;
  isEditing?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}
