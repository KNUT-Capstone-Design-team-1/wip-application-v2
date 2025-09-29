import { useMarkStore } from '@store/markStore';

export const useTagValue = (title: string, value: string) => {
  const { selectedMarkTitle } = useMarkStore();

  if (title === 'MARK_CODE') {
    return selectedMarkTitle;
  }

  return value;
};
