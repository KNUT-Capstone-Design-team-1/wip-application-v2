// 저장된 알약 데이터의 상세 정보 인터페이스
export interface IPillSaveData {
  // 제형 차트
  CHART: string;

  // 업체명
  ENTP_NAME: string;

  // 품목명
  ITEM_NAME: string;

  // 품목일련번호
  ITEM_SEQ: string;

  // 품목 이미지 URL
  ITEM_IMAGE: string;

  // 분류명
  CLASS_NAME: string;

  // 전면 식별표기
  PRINT_FRONT: string;

  // 후면 식별표기
  PRINT_BACK: string;
}

// 알약 보관함 리스트 컴포넌트 Props 인터페이스
export interface IPillSaveListProps {
  // 보관된 알약 목록
  pillSaveData: IPillSaveData[];

  // 데이터 변경 콜백
  onDataChange?: (itemSeq: string) => void;

  // 롱프레스 핸들러
  onLongPressItem?: (itemSeq: string) => void;

  // 편집 모드 여부
  isEditing?: boolean;

  // 선택된 알약 SEQ 목록
  selectedSeqs?: string[];

  // 알약 선택 토글 콜백
  onItemSelect?: (itemSeq: string) => void;

  // 복용 알림이 등록된 알약 SEQ 목록
  remindedItemSeqs?: string[];

  // 복용 알림 아이콘 클릭 핸들러
  onPressReminder?: (itemSeq: string, itemName: string) => void;
}

// 개별 알약 보관함 아이템 컴포넌트 Props 인터페이스
export interface IPillSaveContentProps {
  // 표시할 알약 정보
  saveData: IPillSaveData;

  // 상세 보기 클릭 핸들러
  onPressDetail: () => void;

  // 단일 삭제 클릭 핸들러
  onPressDelete: () => void;

  // 롱프레스 핸들러
  onLongPress?: () => void;

  // 편집 모드 여부
  isEditing?: boolean;

  // 선택 여부
  isSelected?: boolean;

  // 선택 토글 핸들러
  onSelect?: () => void;

  // 복용 알림 등록 여부
  hasReminder?: boolean;

  // 복용 알림 클릭 핸들러
  onPressReminder?: () => void;
}

// 편집 모드 하단 액션 바 컴포넌트 Props 인터페이스
export interface IPillSaveEditBottomBarProps {
  // 이름 수정 핸들러 (폴더 전용)
  onRename?: () => void;

  // 삭제 핸들러
  onDelete?: () => void;

  // 이동 핸들러
  onMove?: () => void;

  // 복사 핸들러
  onCopy?: () => void;

  // 선택된 항목 개수
  selectedCount?: number;
}

// 알약 이동/복사 작업 결과 모델
export interface IPillMoveCopyResult {
  // 대상 폴더에 이미 존재하여 건너뛴 알약 목록
  alreadyExistsItems: {
    seq: string;
    name: string;
  }[];
}
