import { useMarkStore } from '@store/markStore';

export const useTagValue = (title: string, value: string) => {
  console.log(title, value);
  const { selectedMarkTitle } = useMarkStore();

  if (title === 'MARK_CODE') {
    return selectedMarkTitle;
  }

  // 값이 없거나 공백만 있는 경우 '없음' 반환
  if (!value || value.trim() === '') {
    return '없음';
  }

  // 쉼표로 구분된 값들 중 빈 값을 '없음'으로 변경
  return value
    .split(',')
    .map((v: string) => (v.trim() === '' ? '없음' : v.trim()))
    .join(', ');
};
