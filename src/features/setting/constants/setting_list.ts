import { ISettingListType } from '@features/setting/types/setting_type';

export const SEARCH_LIST: ISettingListType[] = [
  {
    id: 'NONE',
    title: `앱 정보`,
    value: '',
    path: 'app-info',
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
    id: 'CLEAR_RECENT_VIEWED',
    title: '기록 삭제',
    value: '',
    path: '',
  },
];
