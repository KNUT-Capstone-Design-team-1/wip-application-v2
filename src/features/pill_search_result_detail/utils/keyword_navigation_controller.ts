import { nextKeywordTarget } from './keyword_matches';

import { KeywordMeasure } from '../types/keyword_navigation_type';
export type {
  KeywordMeasure,
  KeywordTarget,
} from '../types/keyword_navigation_type';

interface Options {
  setActiveKeyword: (keyword: string) => void;
  setStatus: (status: string) => void;
  getViewportY: () => Promise<number>;
  scrollTo: (y: number) => void;
  nextFrame: () => Promise<void>;
}
export const createKeywordNavigationController = (options: Options) => {
  const registry = new Map<string, KeywordMeasure>();
  const openers = new Set<() => void>();
  let scrollY = 0;
  let cursor: { keyword: string; id: string } | null = null;
  let sequence = 0;
  let manualScroll = false;
  const cancel = () => {
    sequence++;
  };

  const clear = () => {
    cancel();
    cursor = null;
    options.setActiveKeyword('');
    options.setStatus('');
  };

  return {
    clear,
    cancel,
    reset: () => {
      clear();
      scrollY = 0;
      manualScroll = false;
    },
    register: (id: string, measure: KeywordMeasure) => {
      registry.set(id, measure);

      return () => {
        if (registry.get(id) === measure) {
          registry.delete(id);
        }
      };
    },
    registerOpener: (open: () => void) => {
      openers.add(open);

      return () => {
        openers.delete(open);
      };
    },
    onScrollBeginDrag: () => {
      manualScroll = true;
      cancel();
    },
    onScroll: (y: number) => {
      if (manualScroll && y < scrollY - 2) {
        cursor = null;
        options.setStatus('');
      }

      scrollY = y;
    },
    jump: async (keyword: string) => {
      const request = ++sequence;
      manualScroll = false;
      options.setActiveKeyword(keyword);
      openers.forEach((open) => open());
      // 접힌 본문, 표 높이, 네이티브 텍스트 레이아웃 반영 후 측정한다.
      await options.nextFrame();

      if (request !== sequence) {
        return;
      }

      await Promise.all(
        [...registry.values()].map((measure) => measure(keyword, true)),
      );
      await options.nextFrame();

      if (request !== sequence) {
        return;
      }

      const groups = await Promise.all(
        [...registry.values()].map((measure) => measure(keyword)),
      );
      const viewportY = await options.getViewportY();

      if (request !== sequence) {
        return;
      }

      const targets = groups
        .flat()
        .filter((target) => target.keyword === keyword)
        .map((target) => ({
          ...target,
          y: target.y - viewportY + scrollY - 24,
        }))
        .sort((a, b) => a.y - b.y);
      const previous = cursor?.keyword === keyword ? cursor.id : undefined;
      const next = nextKeywordTarget(targets, scrollY, previous);

      if (!next) {
        options.setStatus(
          targets.length
            ? '마지막 일치 항목입니다'
            : '본문에 일치 항목이 없습니다',
        );

        return;
      }

      next.reveal?.();
      cursor = { keyword, id: next.id };
      options.setStatus(`${targets.indexOf(next) + 1}/${targets.length}`);
      scrollY = Math.max(0, next.y);
      options.scrollTo(scrollY);
    },
  };
};
