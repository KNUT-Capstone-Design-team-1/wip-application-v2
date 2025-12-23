import RNFS from 'react-native-fs';

/**
 * 재귀적으로 디렉토리의 모든 파일을 읽는 헬퍼 함수
 * @param dirPath 디렉토리 경로
 * @param depth 현재 깊이 (로깅용)
 * @returns 모든 파일 배열
 */
const readDirRecursive = async (
  dirPath: string,
  depth: number = 0,
): Promise<any[]> => {
  const allFiles: any[] = [];
  const indent = '  '.repeat(depth);

  try {
    const items = await RNFS.readDir(dirPath);

    for (const item of items) {
      if (item.isDirectory()) {
        // 하위 디렉토리 재귀 탐색
        const subFiles = await readDirRecursive(item.path, depth + 1);
        allFiles.push(...subFiles);
      } else {
        // 파일 추가
        allFiles.push(item);
      }
    }
  } catch (error) {
    console.warn(`폴더 읽기 실패 ${dirPath}:`, error);
  }

  return allFiles;
};

/**
 * 경로를 정규화하는 헬퍼 함수
 * @param path 정규화할 경로
 * @param basePath 기본 경로 (상대 경로인 경우)
 * @returns 정규화된 경로
 */
const normalizePath = (path: string, basePath?: string): string => {
  if (!path || path.trim() === '') {
    return '';
  }

  // file:// 프로토콜 제거
  let normalized = path.replace(/^file:\/\//, '');

  // 빈 문자열 체크
  if (!normalized || normalized.trim() === '') {
    return '';
  }

  // 상대 경로인 경우 절대 경로로 변환
  if (basePath && !normalized.startsWith('/')) {
    normalized = `${basePath}/${normalized}`;
  }

  return normalized;
};

/**
 * 두 경로가 같은 파일을 가리키는지 확인
 * @param path1 첫 번째 경로
 * @param path2 두 번째 경로
 * @returns 같은 파일인지 여부
 */
const isSameFile = (path1: string, path2: string): boolean => {
  if (!path1 || !path2) return false;

  const normalized1 = normalizePath(path1);
  const normalized2 = normalizePath(path2);

  if (!normalized1 || !normalized2) return false;

  // 정확한 경로 매칭
  if (normalized1 === normalized2) return true;

  // 파일명만 비교 (경로가 다를 수 있음)
  const fileName1 = normalized1.split('/').pop();
  const fileName2 = normalized2.split('/').pop();

  return fileName1 === fileName2 && fileName1 !== undefined;
};

/**
 * 이미지 캐시를 삭제하는 함수
 * @param excludeFiles 제외할 파일 URI 리스트 (선택사항)
 * @returns 삭제 성공 시 { success: true }, 실패 시 { success: false, error: Error }
 */
export const clearImageCache = async (
  excludeFiles?: string[],
): Promise<{ success: boolean; error?: any }> => {
  try {
    const cachePath = RNFS.CachesDirectoryPath;

    // 캐시 디렉토리 존재 확인
    const cacheExists = await RNFS.exists(cachePath);
    if (!cacheExists) {
      return { success: true };
    }

    // 재귀적으로 모든 파일 읽기
    const allFiles = await readDirRecursive(cachePath, 0);

    // 제외할 파일 경로 정규화 (빈 문자열 제거)
    const normalizedExcludePaths: string[] = [];
    if (excludeFiles && excludeFiles.length > 0) {
      excludeFiles.forEach((fileUri, index) => {
        const normalized = normalizePath(fileUri, cachePath);
        if (normalized && normalized.trim() !== '') {
          normalizedExcludePaths.push(normalized);
          const fileName = normalized.split('/').pop();
        }
      });
    }

    // 이미지 파일 필터링 (jpg, jpeg, png, webp)
    const imageFiles = allFiles.filter((file) => {
      // 이미지 확장자 확인
      const isImageFile = /\.(jpg|jpeg|png|webp)$/i.test(file.name);
      if (!isImageFile) {
        return false;
      }

      // 제외할 파일 목록에 있는지 확인
      if (normalizedExcludePaths.length > 0) {
        const isExcluded = normalizedExcludePaths.some((excludePath) => {
          return isSameFile(file.path, excludePath);
        });

        if (isExcluded) {
          return false;
        }
      }

      return true;
    });

    if (imageFiles.length === 0) {
      return { success: true };
    }

    // 각 이미지 파일 삭제
    let deletedCount = 0;
    let failedCount = 0;
    const errors: any[] = [];

    for (const file of imageFiles) {
      try {
        await RNFS.unlink(file.path);
        deletedCount++;
      } catch (error: any) {
        failedCount++;
        errors.push({ file: file.name, path: file.path, error: error.message });
      }
    }

    // 일부 파일 삭제 실패해도 성공으로 처리 (idempotent)
    if (failedCount > 0 && deletedCount === 0) {
      // 모든 파일 삭제 실패한 경우만 실패로 처리
      return {
        success: false,
        error: {
          message: '모든 이미지 캐시 삭제 실패',
          errors,
        },
      };
    }

    return { success: true };
  } catch (error) {
    console.error('❌ 이미지 캐시 삭제 실패:', error);
    return {
      success: false,
      error,
    };
  }
};
