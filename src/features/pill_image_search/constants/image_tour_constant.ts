import type { GuideTour } from '@features/guide';

// 이미지 검색 가이드 투어 (사진 로드 → 검색하기)
export const IMAGE_TOUR: GuideTour = {
  id: 'pill_image_search',
  version: 1,
  visibility: 'once',
  tooltipMode: 'button',
  animation: 'scale',
  steps: [
    {
      id: 'img.load',
      title: '사진으로 찾기',
      description:
        '알약을 촬영하거나 앨범에서 선택하면 비슷한 알약을 찾아줘요. 밝은 곳에서 선명하게 찍어주세요.',
      shape: 'rectangle',
    },
    {
      id: 'img.search',
      title: '검색하기',
      description:
        '앞·뒷면 사진을 모두 올리면 이 버튼이 활성화돼요. 눌러서 비슷한 알약을 찾아보세요.',
      shape: 'rectangle',
    },
  ],
};
