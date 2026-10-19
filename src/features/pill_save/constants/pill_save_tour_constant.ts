import type { GuideTour } from '@features/guide';

// 보관함 가이드 투어 (폴더 추가 + 복용 알림)
export const PILL_SAVE_TOUR: GuideTour = {
  id: 'pill_save',
  version: 1,
  visibility: 'once',
  tooltipMode: 'button',
  animation: 'scale',
  steps: [
    {
      id: 'save.add',
      title: '폴더 추가',
      description:
        '이 버튼으로 폴더를 만들어 자주 찾는 약을 분류해 보관할 수 있어요.',
      shape: 'circle',
      padding: 10,
    },
    {
      id: 'save.reminder',
      title: '복용 알림',
      description: '복용 시간을 등록해두면 잊지 않도록 알림을 받을 수 있어요.',
      shape: 'circle',
      padding: 10,
    },
  ],
};
