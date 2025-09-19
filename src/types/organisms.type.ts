import { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';
import { TMarkData } from './TApiType';

// markModal/MarkModalView.tsx
export interface IMarkModalViewProps {
  loading: boolean;
  markDataList: TMarkData[];
  page: number;
  totalPages: number;
  currentGroup: number;
  setPage: (page: number) => void;
  setCurrentGroup: (group: number) => void;
  handleSearch: () => void;
  markSelected: (item: TMarkData) => void;
  onClose: () => void;
  searchText: React.RefObject<string>;
}

// CustomAlert.tsx
export type TCustomAlertButtons = {
  text: string;
  onPress?: ((event?: GestureResponderEvent) => void) | undefined;
  style?: StyleProp<ViewStyle>;
};

export type TCustomModalType = 'default' | 'exit' | 'checkbox';

export type CustomAlertProps = {
  visible: boolean;
  onRequestClose: (() => void) | undefined;
  title: string;
  message: string;
  buttons?: TCustomAlertButtons[];
  modalType?: TCustomModalType;
  checkboxLabel?: string;
  onCheckboxChange?: (isChecked: boolean) => void;
};
