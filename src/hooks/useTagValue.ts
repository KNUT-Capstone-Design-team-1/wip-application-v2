import { useMarkStore } from '@store/markStore';

interface TagValueStrategy {
  match: (title: string) => boolean;
  resolve: (value: string) => string;
}

export const useTagValue = (title: string, value: string) => {
  const { selectedMarkTitle } = useMarkStore();

  const strategies: TagValueStrategy[] = [
    {
      match: (title) => title === 'MARK_CODE',
      resolve: () => selectedMarkTitle,
    },
  ];

  for (const strategy of strategies) {
    if (strategy.match(title)) {
      return strategy.resolve(value);
    }
  }
  return value;
};
