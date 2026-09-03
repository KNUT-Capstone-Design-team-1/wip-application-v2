import {
  IPillSaveDataSource,
  pillSaveSqliteDataSource,
} from '@features/pill_save/data/datasources/pill_save_sqlite_datasource';
import { IPillSaveData } from '@features/pill_save/types/pill_save_type';
import { ISavedPillFolder } from '@services/database/types';

// 알약 보관함 리포지토리 인터페이스
export interface IPillSaveRepository {
  getFolders(
    orderBySql: string,
  ): Promise<(ISavedPillFolder & { pill_count: number })[]>;

  getFolderPreviewImages(folderId: number): Promise<string[]>;

  createFolder(name: string): Promise<number | null>;

  renameFolder(folderId: number, name: string): Promise<boolean>;

  deleteFolder(folderId: number): Promise<boolean>;

  deleteMultiplePills(itemSeqs: string[], folderId: number): Promise<boolean>;

  getPillSavedFolderIds(itemSeq: string): Promise<number[]>;

  savePillToFolders(
    itemSeq: string,
    itemName: string,
    folderIds: number[],
  ): Promise<void>;

  movePillsToFolders(
    items: { seq: string; name: string }[],
    sourceFolderId: number,
    targetFolderIds: number[],
  ): Promise<{ alreadyExistsItems: { seq: string; name: string }[] }>;

  copyPillsToFolders(
    items: { seq: string; name: string }[],
    targetFolderIds: number[],
  ): Promise<{ alreadyExistsItems: { seq: string; name: string }[] }>;

  deletePillFromFolder(itemSeq: string, folderId: number): Promise<boolean>;

  getPillsByFolder(folderId: number): Promise<IPillSaveData[]>;
}

// 알약 보관함 리포지토리 구현체
export class PillSaveRepository implements IPillSaveRepository {
  constructor(
    private readonly dataSource: IPillSaveDataSource = pillSaveSqliteDataSource,
  ) {}

  // 폴더 목록 조회
  async getFolders(orderBySql: string) {
    return await this.dataSource.getFolders(orderBySql);
  }

  // 폴더 프리뷰 이미지 목록 조회
  async getFolderPreviewImages(folderId: number) {
    return await this.dataSource.getFolderPreviewImages(folderId);
  }

  // 폴더 생성
  async createFolder(name: string) {
    return await this.dataSource.createFolder(name);
  }

  // 폴더 이름 변경
  async renameFolder(folderId: number, name: string) {
    return await this.dataSource.renameFolder(folderId, name);
  }

  // 폴더 삭제
  async deleteFolder(folderId: number) {
    return await this.dataSource.deleteFolder(folderId);
  }

  // 다중 알약 삭제
  async deleteMultiplePills(itemSeqs: string[], folderId: number) {
    return await this.dataSource.deleteMultiplePills(itemSeqs, folderId);
  }

  // 알약 저장 폴더 ID 목록 조회
  async getPillSavedFolderIds(itemSeq: string) {
    return await this.dataSource.getPillSavedFolderIds(itemSeq);
  }

  // 알약 폴더들에 저장
  async savePillToFolders(
    itemSeq: string,
    itemName: string,
    folderIds: number[],
  ) {
    return await this.dataSource.savePillToFolders(
      itemSeq,
      itemName,
      folderIds,
    );
  }

  // 알약 다른 폴더들로 이동
  async movePillsToFolders(
    items: { seq: string; name: string }[],
    sourceFolderId: number,
    targetFolderIds: number[],
  ) {
    return await this.dataSource.movePillsToFolders(
      items,
      sourceFolderId,
      targetFolderIds,
    );
  }

  // 알약 다른 폴더들로 복사
  async copyPillsToFolders(
    items: { seq: string; name: string }[],
    targetFolderIds: number[],
  ) {
    return await this.dataSource.copyPillsToFolders(items, targetFolderIds);
  }

  // 특정 폴더에서 단일 알약 삭제
  async deletePillFromFolder(itemSeq: string, folderId: number) {
    return await this.dataSource.deletePillFromFolder(itemSeq, folderId);
  }

  // 특정 폴더의 알약 목록 조회
  async getPillsByFolder(folderId: number) {
    return await this.dataSource.getPillsByFolder(folderId);
  }
}

// 알약 보관함 리포지토리 싱글톤 인스턴스
export const pillSaveRepository = new PillSaveRepository();
