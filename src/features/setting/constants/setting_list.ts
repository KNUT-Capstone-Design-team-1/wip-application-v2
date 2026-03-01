import { ISettingListType } from '../types/setting_type';
import VersionCheck from 'react-native-version-check-expo';

export const SEARCH_LIST: ISettingListType[] = [
  {
    title: `앱 버전`,
    value: `v${VersionCheck.getCurrentVersion()}`,
    path: '',
  },
  {
    title: '이용 약관',
    value: '',
    path: 'terms',
  },
  {
    title: '공지 사항',
    value: '',
    path: 'notice',
  },
  {
    title: '기록 삭제',
    value: '',
    path: '',
  },
  {
    title: `보관함 초기화`,
    // 비동기로 동작하기 때문에 동적으로 가져오기 위해서 컴포넌트 내에서 처리하도록 수정
    value: '',
    path: '',
  },
];
