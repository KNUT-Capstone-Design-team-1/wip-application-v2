import * as Application from 'expo-application';
import { ISettingListType } from '@features/setting/types/setting_type';

export const SEARCH_LIST: ISettingListType[] = [
  {
    id: 'NONE',
    title: `앱 버전`,
    value: `v${Application.nativeApplicationVersion}`,
    path: '',
  },
  {
    id: 'NONE',
    title: '이용 약관',
    value: '',
    path: 'terms',
  },
  {
    id: 'NONE',
    title: '공지 사항',
    value: '',
    path: 'notice',
  },
  {
    id: 'CLEAR_RECENT_SEARCH',
    title: '기록 삭제',
    value: '',
    path: '',
  },
  {
    id: 'CLEAR_STORAGE',
    title: `보관함 초기화`,
    // 비동기로 동작하기 때문에 동적으로 가져오기 위해서 컴포넌트 내에서 처리하도록 수정
    value: '',
    path: '',
  },
];
