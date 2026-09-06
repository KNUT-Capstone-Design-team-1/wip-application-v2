import { pillSaveRepository } from '@features/pill_save/data/repositories/pill_save_repository';
import { IPillSaveData } from '@features/pill_save/types/pill_save_type';
import {
  IPillSaveOperationItem,
  IPillSaveOperationResult,
  ISavedFolderWithMeta,
} from '@features/pill_save/types/pill_save_folder_type';
import { useAppTrackStore } from '@store/app_track_store';
import { FolderSortOption } from '@features/pill_save/constants/pill_save_constant';

// 알약 보관함 비즈니스 로직 서비스
export const pillSaveService = {
  // 정렬 옵션에 따라 정렬된 폴더 목록 및 각 폴더별 프리뷰 이미지 목록 조회
  async getFolders(
    sortBy: FolderSortOption = 'name_asc',
  ): Promise<ISavedFolderWithMeta[]> {
    const rows = await pillSaveRepository.getFolders(sortBy);

    const result = await Promise.all(
      rows.map(async (row) => {
        if (row.pill_count === 0) {
          return { ...row, preview_images: [] };
        }

        const previewImages = await pillSaveRepository.getFolderPreviewImages(
          row.id,
        );

        return {
          ...row,
          preview_images: previewImages,
        };
      }),
    );

    return result;
  },

  // 새 보관함 폴더 생성 유스케이스
  async createFolder(name: string): Promise<number | null> {
    if (!name.trim()) {
      return null;
    }

    return await pillSaveRepository.createFolder(name.trim());
  },

  // 폴더 이름 변경 유스케이스
  async renameFolder(folderId: number, name: string): Promise<boolean> {
    if (!name.trim()) {
      return false;
    }

    return await pillSaveRepository.renameFolder(folderId, name.trim());
  },

  // 특정 폴더 삭제 유스케이스 (기본 폴더 제외)
  async deleteFolder(folderId: number): Promise<boolean> {
    return await pillSaveRepository.deleteFolder(folderId);
  },

  // 특정 폴더에서 여러 알약 다중 삭제 유스케이스
  async deleteMultiplePillsFromFolder(
    itemSeqs: string[],
    folderId: number,
  ): Promise<boolean> {
    if (!itemSeqs || itemSeqs.length === 0) {
      return true;
    }

    return await pillSaveRepository.deleteMultiplePills(itemSeqs, folderId);
  },

  // 특정 알약이 저장된 폴더 ID 목록 조회 유스케이스
  async getPillSavedFolderIds(itemSeq: string): Promise<number[]> {
    if (!itemSeq) {
      return [];
    }

    return await pillSaveRepository.getPillSavedFolderIds(itemSeq);
  },

  // 알약을 선택한 폴더들에 저장하고 리뷰 트래킹을 수행하는 유스케이스
  async savePillToFolders(
    itemSeq: string,
    itemName: string,
    folderIds: number[],
  ): Promise<void> {
    if (!itemSeq || !itemName) {
      return;
    }

    await pillSaveRepository.savePillToFolders(itemSeq, itemName, folderIds);

    if (folderIds.length > 0) {
      useAppTrackStore.getState().increaseReviewActionCount('bookmarked');
    }
  },

  // 알약 다중 이동 유스케이스
  async movePillsToFolders(
    items: IPillSaveOperationItem[],
    sourceFolderId: number,
    targetFolderIds: number[],
  ): Promise<IPillSaveOperationResult> {
    if (items.length === 0 || targetFolderIds.length === 0) {
      return { alreadyExistsItems: [] };
    }

    return await pillSaveRepository.movePillsToFolders(
      items,
      sourceFolderId,
      targetFolderIds,
    );
  },

  // 알약 다중 복사 유스케이스
  async copyPillsToFolders(
    items: IPillSaveOperationItem[],
    targetFolderIds: number[],
  ): Promise<IPillSaveOperationResult> {
    if (items.length === 0 || targetFolderIds.length === 0) {
      return { alreadyExistsItems: [] };
    }

    return await pillSaveRepository.copyPillsToFolders(items, targetFolderIds);
  },

  // 특정 폴더에서 특정 알약 단일 삭제 유스케이스
  async deletePillFromFolder(
    itemSeq: string,
    folderId: number,
  ): Promise<boolean> {
    if (!itemSeq) {
      return false;
    }

    return await pillSaveRepository.deletePillFromFolder(itemSeq, folderId);
  },

  // 특정 폴더의 알약 목록 조회 유스케이스
  async getPillsByFolder(folderId: number): Promise<IPillSaveData[]> {
    return await pillSaveRepository.getPillsByFolder(folderId);
  },
};
