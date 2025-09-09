import { ColorValue } from 'react-native';
import { TMarkData } from './TApiType';

// SelectingMark.tsx
export interface IMarkListProps {
  data: TMarkData[];
  onSelect: (item: TMarkData) => void;
}

// MarkModalView.tsx
export interface IModalPageNationProps {
  totalPages: number;
  page: number;
  setPage: any;
  currentGroup: number;
  setCurrentGroup: any;
}

export interface ISearchInputAndButtonProps {
  textInputsObject: {
    placeholder?: string;
    placeholderTextColor?: ColorValue;
    onChangeText: (val: string) => void;
    value?: string;
  };
  buttonClickHandler: () => void;
}
