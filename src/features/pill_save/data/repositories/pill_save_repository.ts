import { pillSaveSqliteDataSource } from '@features/pill_save/data/datasources/pill_save_sqlite_datasource';
import { IPillSaveData } from '@features/pill_save/types/pill_save_type';
import {
  IPillSaveOperationItem,
  IPillSaveOperationResult,
  ISavedFolderWithPillCount,
} from '@features/pill_save/types/pill_save_folder_type';
import { FolderSortOption } from '@features/pill_save/constants/pill_save_constant';

// 알약 보관함 리포지토리
export const pillSaveRepository = {
  // 폴더 목록 조회
  async getFolders(
    sortBy: FolderSortOption,
  ): Promise<ISavedFolderWithPillCount[]> {
    return await pillSaveSqliteDataSource.getFolders(sortBy);
  },

  // 폴더 프리뷰 이미지 목록 조회
  async getFolderPreviewImages(folderId: number): Promise<string[]> {
    return await pillSaveSqliteDataSource.getFolderPreviewImages(folderId);
  },

  // 폴더 생성
  async createFolder(name: string): Promise<number | null> {
    return await pillSaveSqliteDataSource.createFolder(name);
  },

  // 폴더 이름 변경
  async renameFolder(folderId: number, name: string): Promise<boolean> {
    return await pillSaveSqliteDataSource.renameFolder(folderId, name);
  },

  // 폴더 삭제
  async deleteFolder(folderId: number): Promise<boolean> {
    return await pillSaveSqliteDataSource.deleteFolder(folderId);
  },

  // 다중 알약 삭제
  async deleteMultiplePills(
    itemSeqs: string[],
    folderId: number,
  ): Promise<boolean> {
    return await pillSaveSqliteDataSource.deleteMultiplePills(
      itemSeqs,
      folderId,
    );
  },

  // 알약 저장 폴더 ID 목록 조회
  async getPillSavedFolderIds(itemSeq: string): Promise<number[]> {
    return await pillSaveSqliteDataSource.getPillSavedFolderIds(itemSeq);
  },

  // 알약 폴더들에 저장
  async savePillToFolders(
    itemSeq: string,
    itemName: string,
    folderIds: number[],
  ): Promise<void> {
    return await pillSaveSqliteDataSource.savePillToFolders(
      itemSeq,
      itemName,
      folderIds,
    );
  },

  // 알약 다른 폴더들로 이동
  async movePillsToFolders(
    items: IPillSaveOperationItem[],
    sourceFolderId: number,
    targetFolderIds: number[],
  ): Promise<IPillSaveOperationResult> {
    return await pillSaveSqliteDataSource.movePillsToFolders(
      items,
      sourceFolderId,
      targetFolderIds,
    );
  },

  // 알약 다른 폴더들로 복사
  async copyPillsToFolders(
    items: IPillSaveOperationItem[],
    targetFolderIds: number[],
  ): Promise<IPillSaveOperationResult> {
    return await pillSaveSqliteDataSource.copyPillsToFolders(
      items,
      targetFolderIds,
    );
  },

  // 특정 폴더에서 단일 알약 삭제
  async deletePillFromFolder(
    itemSeq: string,
    folderId: number,
  ): Promise<boolean> {
    return await pillSaveSqliteDataSource.deletePillFromFolder(
      itemSeq,
      folderId,
    );
  },

  // 특정 폴더의 알약 목록 조회
  async getPillsByFolder(folderId: number): Promise<IPillSaveData[]> {
    return await pillSaveSqliteDataSource.getPillsByFolder(folderId);
  },
};
