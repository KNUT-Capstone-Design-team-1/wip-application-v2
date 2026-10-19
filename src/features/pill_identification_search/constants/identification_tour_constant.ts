import type { GuideTour } from '@features/guide';

// 식별 검색 가이드 투어 (8개 조건 섹션을 위에서 아래로 안내 — 스크롤 자동 이동)
export const IDENTIFICATION_TOUR: GuideTour = {
  id: 'pill_identification_search',
  version: 1,
  visibility: 'once',
  tooltipMode: 'button',
  animation: 'scale',
  steps: [
    {
      id: 'id.sideLabelText',
      title: '식별 문자',
      description:
        '알약 앞·뒷면에 새겨진 문자나 숫자를 입력해요. 가장 정확하게 좁힐 수 있는 조건이에요.',
    },
    {
      id: 'id.productNameText',
      title: '제품명',
      description: '제품명을 알고 있다면 입력해 바로 찾아볼 수 있어요.',
    },
    {
      id: 'id.companyName',
      title: '제조사명',
      description: '제조사명으로도 검색 범위를 줄일 수 있어요.',
    },
    {
      id: 'id.manufacturerName',
      title: '제형',
      description: '정제·경질캡슐·연질캡슐 등 알약의 형태를 선택해요.',
    },
    {
      id: 'id.dividerLineData',
      title: '분할선',
      description: '알약 표면의 분할선 모양(없음·+·- 등)을 골라요.',
    },
    {
      id: 'id.shape',
      title: '모양',
      description: '원형·타원형·삼각형 등 알약의 전체적인 모양을 선택해요.',
    },
    {
      id: 'id.colors',
      title: '색상',
      description: '알약의 색상을 선택해요. 여러 색을 함께 고를 수도 있어요.',
    },
    {
      id: 'id.mark',
      title: '마크',
      description:
        '제조사 로고 같은 표면의 마크를 선택하면 더 정확하게 찾을 수 있어요.',
    },
  ],
};
