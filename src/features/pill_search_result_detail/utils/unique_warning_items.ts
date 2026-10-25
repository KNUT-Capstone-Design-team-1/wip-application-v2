// 공백 차이를 무시해 중복을 제거하고 최초 원문과 표시 순서를 보존한다.
export const uniqueWarningItems = (items: readonly string[]): string[] => {
  const unique = new Map<string, string>();

  for (const item of items) {
    const key = item.replace(/\s+/g, '');

    const isNewItem = key.length > 0 && !unique.has(key);

    if (isNewItem) {
      unique.set(key, item);
    }
  }

  return [...unique.values()];
};
