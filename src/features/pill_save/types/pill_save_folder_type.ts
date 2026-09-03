import { ISavedPillFolder } from '@services/database/types';

// 메타데이터(알약 개수 및 대표 이미지 목록)가 포함된 폴더 도메인 모델
export interface ISavedFolderWithMeta extends ISavedPillFolder {
  // 해당 폴더에 보관된 알약 개수
  pill_count: number;

  // 대표 미리보기 이미지 목록 (최대 4개)
  preview_images?: string[];
}

// 알약 보관함 폴더 리스트 컴포넌트 Props 인터페이스
export interface IPillSaveFolderListProps {
  // 폴더 목록
  folders: ISavedFolderWithMeta[];

  // 편집 모드 활성화 여부
  isEditing: boolean;

  // 선택된 폴더 ID 배열
  selectedFolderIds: number[];

  // 편집 모드 변경 함수
  setIsEditing: (val: boolean) => void;

  // 폴더 선택 토글 함수
  toggleFolderSelection: (id: number) => void;
}

// 개별 폴더 리스트 아이템 컴포넌트 Props 인터페이스
export interface IPillSaveFolderItemProps {
  // 폴더 데이터
  item: ISavedFolderWithMeta;

  // 폴더 클릭 핸들러
  onPress: () => void;

  // 롱프레스 핸들러
  onLongPress?: () => void;

  // 편집 모드 여부
  isEditing?: boolean;

  // 선택 여부
  isSelected?: boolean;
}

// 폴더 선택 모달 Props 인터페이스
export interface IFolderSelectModalProps {
  // 모달 노출 여부
  isVisible: boolean;

  // 닫기 핸들러
  onClose: () => void;

  // 단일 저장 시 알약 식별 번호
  itemSeq?: string;

  // 단일 저장 시 알약 이름
  itemName?: string;

  // 다중 이동/복사 시 대상 알약 목록
  items?: {
    seq: string;
    name: string;
  }[];

  // 모달 동작 모드 (저장 / 이동 / 복사)
  mode?: 'save' | 'move' | 'copy';

  // 이동 모드 시 현재 출발지 폴더 ID
  sourceId?: number;

  // 초기 선택된 폴더 ID 배열
  initialSelectedIds: number[];

  // 저장/이동/복사 완료 콜백
  onSaveComplete: (selectedIds: number[]) => void;
}
