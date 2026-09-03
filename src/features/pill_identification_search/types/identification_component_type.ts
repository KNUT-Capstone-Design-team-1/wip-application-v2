import { ReactNode } from 'react';
import { DimensionValue, ImageSourcePropType } from 'react-native';
import {
  IIdentificationSection,
  ISearchIdStore,
} from './identification_form_type';
import { MarkData } from './identification_mark_type';

// 버튼 컴포넌트 Props
export interface IButtonProps {
  background?: string;
  color?: string;
  width?: DimensionValue;
  label: string;
  pressHandler: () => void;
}

// 아이콘 버튼 컴포넌트 Props
export interface IIconButtonProps {
  isSelected: boolean;
  iconUrl?: ImageSourcePropType;
  iconColor?: string;
  label: string;
}

// 텍스트 인풋 컴포넌트 Props
export interface IInputProps {
  placeholder?: string;
  value?: string;
  inputChangeHandler: (text: string) => void;
  width?: DimensionValue;
  height?: DimensionValue;
}

// 식별 검색 섹션 래퍼 컴포넌트 Props
export interface IIdentificationSectionProps {
  children: ReactNode;
  title: string;
  direction?: 'row' | 'column';
  selectedIndex?: number[];
}

// 식별 검색 텍스트 입력 단일 아이템 Props
export interface IIdentificationTextInputItemProps {
  placeholder: string;
  storeKey: keyof ISearchIdStore;
  inputKey: string;
  searchIdInputChangeHandler: (text: string, key: string) => void;
}

// 식별 문자 완전 일치 체크박스 컴포넌트 Props
export interface IExactMatchCheckboxProps {
  isExactMatch: boolean;
  onToggle: () => void;
}

// 선택된 마크 미리보기 컴포넌트 Props
export interface ISelectedMarkPreviewProps {
  base64: string;
  title: string;
  onDelete: () => void;
}

// 마크 모달 헤더 컴포넌트 Props
export interface IMarkModalHeaderProps {
  onClose: () => void;
}

// 마크 모달 검색 콘텐츠 컴포넌트 Props
export interface IMarkModalContentProps {
  loading: boolean;
  error: string | null;
  markDataList: MarkData[];
  onSelect: (mark: MarkData) => void;
}

// 식별 검색 하단 액션 버튼 그룹 Props
export interface IIdentificationSearchActionsProps {
  onReset: () => void;
  onSearch: () => Promise<void>;
}

// 식별 검색 텍스트 입력 섹션 그룹 Props
export interface IIdentificationTextInputSectionProps {
  sectionKey: string;
  section: IIdentificationSection;
  searchIdInputChangeHandler: (text: string, key: string) => void;
}

// 식별 검색 아이콘 버튼 섹션 그룹 Props
export interface IIdentificationIconButtonSectionProps {
  sectionKey: string;
  section: IIdentificationSection;
  radioButtonPressHandler: (value: string, key: string) => void;
}

// 식별 검색 폼 컴포넌트 Props
export interface IPillIdentificationSearchFormProps {
  onSearchComplete?: () => void;
}
