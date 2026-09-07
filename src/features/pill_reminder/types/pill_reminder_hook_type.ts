import { IPillReminderItem } from './pill_reminder_domain_type';
import { ISelectedPillItem } from './pill_reminder_form_type';

// 폼 초기화 훅 파라미터 타입
export interface IUsePillReminderFormInitParams {
  reminderId?: string;
  initialItemSeqs?: string;
  setTitle: (title: string) => void;
  setMemo: (memo: string) => void;
  setTimes: (times: string[]) => void;
  setDays: (days: number[]) => void;
  setSelectedPills: (pills: ISelectedPillItem[]) => void;
  setSelectedFolderId: (id: number | undefined) => void;
  setSelectedFolderName: (name: string) => void;
}

// 폼 초기화 훅 반환 타입
export interface IUsePillReminderFormInitReturn {
  loading: boolean;
  hasPermission: boolean;
  isEditMode: boolean;
}

// 폼 저장 훅 파라미터 타입
export interface IUsePillReminderFormSaveParams {
  reminderId?: string;
  isEditMode: boolean;
  title: string;
  memo: string;
  times: string[];
  days: number[];
  selectedPills: ISelectedPillItem[];
  selectedFolderId?: number;
  setHasPermission: (has: boolean) => void;
}

// 폼 저장 훅 반환 타입
export interface IUsePillReminderFormSaveReturn {
  saving: boolean;
  handleSave: () => Promise<void>;
}

// 복용 알림 설정 폼 훅 파라미터 타입
export interface IUsePillReminderSettingFormProps {
  reminderId?: string;
  initialItemSeqs?: string;
}

// 복용 알림 설정 폼 훅 반환 타입
export interface IUsePillReminderSettingFormReturn {
  title: string;
  memo: string;
  times: string[];
  days: number[];
  selectedPills: ISelectedPillItem[];
  selectedFolderName: string;
  loading: boolean;
  saving: boolean;
  hasPermission: boolean;
  isEditMode: boolean;
  isFormValid: boolean;
  isPillSelectModalVisible: boolean;
  isTimePickerVisible: boolean;
  editingTime: string | null;
  setTitle: (title: string) => void;
  setMemo: (memo: string) => void;
  setIsPillSelectModalVisible: (visible: boolean) => void;
  setIsTimePickerVisible: (visible: boolean) => void;
  setDays: (days: number[]) => void;
  handleConfirmPillSelection: (
    selectedSeqs: string[],
    folderId?: number,
    folderName?: string,
  ) => Promise<void>;
  handleRemovePill: (seq: string) => void;
  handleDosageChange: (seq: string, dosage: number) => void;
  handleOpenTimePicker: (timeToEdit?: string) => void;
  handleConfirmTimePicker: (selectedTime: string) => void;
  handleRemoveTime: (timeToRemove: string) => void;
  handleSave: () => Promise<void>;
}
