import { DimensionValue, TextStyle, ViewStyle } from 'react-native';
import { TMarkData } from '@/types/TApiType';

// CustomChip.tsx
export type TCustomChip = {
  text: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export interface ILoadingCircleProps {
  size?: number | 'large' | 'small' | undefined;
  color?: string;
}

// CheckBoxProps
export interface ICheckboxProps {
  size?: number;
  fillColor?: string;
  unFillColor?: string;
  style?: ViewStyle;
  boxStyle?: ViewStyle;
  text?: string;
  textStyle?: TextStyle;
  onPress?: (isChecked: boolean) => void;
}

// ModalIconButton.tsx
export interface IModalIconButton {
  markSelected: any;
  item: TMarkData;
}

export interface INavIconSize {
  width: DimensionValue | undefined;
  height: DimensionValue | undefined;
  top?: number;
}

// NavButton.tsx
export interface INavIcon {
  ACTIVE: INavIconInfo;
  INACTIVE: INavIconInfo;
}

export interface INavWrapperProps {
  iconXML: INavIcon;
  name: string;
  navName: string;
  tabName?: string;
}

export interface INavIconInfo {
  XML: string;
  SIZE: INavIconSize;
  TOP?: number;
}

// PillInfo.tsx
export interface IPillInfoProps {
  label: string;
  ct: string;
  searchValue?: string;
  replaceValue?: string;
}

export interface IPropsChips {
  label: string;
  ct: string[];
  searchValue?: string;
  replaceValue?: string;
}

// StorageItem.tsx
export interface IStorageItemProps {
  data: any;
  refresh: any;
}

// Tag.tsx
export interface ITagProps {
  title: string;
  value: string;
}
