import { ISettingListType } from '../types/setting_type';
import VersionCheck from 'react-native-version-check-expo';

export const SEARCH_LIST: ISettingListType[] = [
  {
    title: `앱 버전`,
    value: `v${VersionCheck.getCurrentVersion()}`,
    path: '',
    method: null,
  },
  {
    title: '이용 약관',
    value: '',
    path: 'terms',
    method: null,
  },
  {
    title: '공지 사항',
    value: '',
    path: 'notice',
    method: null,
  },
  {
    title: '기록 삭제',
    value: '',
    path: '',
    method: () => {
      console.log();
    },
  },
  {
    title: `보관함 초기화`,
    value: `${1}개`,
    path: '',
    method: () => {
      console.log();
    },
  },
];
