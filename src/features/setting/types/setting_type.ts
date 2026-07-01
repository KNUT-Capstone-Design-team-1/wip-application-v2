export type SettingAction = 'NONE' | 'CLEAR_STORAGE' | 'CLEAR_RECENT_VIEWED';

export interface ISettingListType {
  id: SettingAction;
  title: string;
  path: string;
  value: string;
}
