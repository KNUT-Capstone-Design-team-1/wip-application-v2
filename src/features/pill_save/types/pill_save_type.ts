import { ISavedPillFolder } from '@services/database/types';

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
  onLongPressItem?: (itemSeq: string) => void;
  isEditing?: boolean;
  selectedSeqs?: string[];
  onItemSelect?: (itemSeq: string) => void;
}

// 개별 알약 보관함 아이템 컴포넌트의 프롭스 인터페이스
export interface IPillSaveContentProps {
  saveData: IPillSaveData;
  onPressDetail: () => void;
  onPressDelete: () => void;
  onLongPress?: () => void;
  isEditing?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

// 알약 보관함 폴더 리스트 프롭스 인터페이스
export interface IPillSaveFolderListProps {
  folders: (ISavedPillFolder & {
    pill_count: number;
    preview_images?: string[];
  })[];
  isEditing: boolean;
  selectedFolderIds: number[];
  setIsEditing: (val: boolean) => void;
  toggleFolderSelection: (id: number) => void;
}
// 편집 모드일 때 하단에 나타나는 메뉴 바의 프롭스 인터페이스
export interface IPillSaveEditBottomBarProps {
  onRename?: () => void;
  onDelete?: () => void;
  onMove?: () => void;
  onCopy?: () => void;
  selectedCount?: number;
}
// 폴더 리스트 아이템 프롭스 인터페이스
export interface IPillSaveFolderItemProps {
  item: ISavedPillFolder & { pill_count: number; preview_images?: string[] };
  onPress: () => void;
  onLongPress?: () => void;
  isEditing?: boolean;
  isSelected?: boolean;
}
// 폴더 선택 모달 프롭스 인터페이스
export interface IFolderSelectModalProps {
  isVisible: boolean;
  onClose: () => void;
  itemSeq?: string;
  itemName?: string;
  items?: { seq: string; name: string }[];
  mode?: 'save' | 'move' | 'copy';
  sourceId?: number;
  initialSelectedIds: number[];
  onSaveComplete: (selectedIds: number[]) => void;
}
