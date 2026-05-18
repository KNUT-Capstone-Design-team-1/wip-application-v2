import { useEffect, useCallback } from 'react';
import { getMarkImages } from '@services/database/queries/mark_images';
import { useSearchResultListStore } from '@features/pill_search_result_list/store/search_result_list_store';
import logger from '@utils/logger';

export const useFetchMarkImages = () => {
  const { searchParam, setMarkImages } = useSearchResultListStore();

  /**
   * 마크 코드 배열을 받아 이미지 정보를 가져오고 스토어에 업데이트
   */
  const updateMarkImages = useCallback(
    async (marks: string[]) => {
      if (marks.length === 0) {
        setMarkImages([]);
        return;
      }

      try {
        const results = await Promise.all(
          marks.map((code) => getMarkImages({ code }, { page: 1, limit: 1 })),
        );

        const images = results
          .flat()
          .map((r) => ({ code: r.code, base64: r.base64 }));

        setMarkImages(images);
      } catch (e) {
        logger.error(`Failed to fetch mark images: ${e.stack || e}`);
      }
    },
    [setMarkImages],
  );

  useEffect(() => {
    const marks = [
      searchParam?.MARK_CODE_FRONT,
      searchParam?.MARK_CODE_BACK,
    ].filter(Boolean) as string[];

    updateMarkImages(marks);
  }, [
    searchParam?.MARK_CODE_FRONT,
    searchParam?.MARK_CODE_BACK,
    updateMarkImages,
  ]);
};
