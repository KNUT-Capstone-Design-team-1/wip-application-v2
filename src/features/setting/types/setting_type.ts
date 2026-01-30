export interface ISettingListType {
  title: string;
  path: string;
  method: (() => void) | null;
  value: string;
}
