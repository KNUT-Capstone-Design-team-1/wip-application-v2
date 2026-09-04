import { PillSaveService } from '../../../src/features/pill_save/services/pill_save_service';
import { IPillSaveRepository } from '../../../src/features/pill_save/data/repositories/pill_save_repository';
import { ISavedPillFolder } from '../../../src/services/database/types';
import { useAppTrackStore } from '../../../src/store/app_track_store';

jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(),
}));

jest.mock('../../../src/store/app_track_store', () => ({
  useAppTrackStore: {
    getState: jest.fn(() => ({
      increaseReviewActionCount: jest.fn(),
    })),
  },
}));

describe('PillSaveService 단위 테스트', () => {
  let service: PillSaveService;
  let mockRepository: jest.Mocked<IPillSaveRepository>;

  const sampleFolders: (ISavedPillFolder & { pill_count: number })[] = [
    {
      id: 1,
      name: '기본 보관함',
      is_default: 1,
      created_at: '2026-01-01',
      pill_count: 2,
    },
    {
      id: 2,
      name: '감기약 폴더',
      is_default: 0,
      created_at: '2026-01-02',
      pill_count: 0,
    },
  ];

  beforeEach(() => {
    mockRepository = {
      getFolders: jest.fn().mockResolvedValue(sampleFolders),
      getFolderPreviewImages: jest
        .fn()
        .mockResolvedValue(['img1.png', 'img2.png']),
      createFolder: jest.fn().mockResolvedValue(3),
      renameFolder: jest.fn().mockResolvedValue(true),
      deleteFolder: jest.fn().mockResolvedValue(true),
      deleteMultiplePills: jest.fn().mockResolvedValue(true),
      getPillSavedFolderIds: jest.fn().mockResolvedValue([1]),
      savePillToFolders: jest.fn().mockResolvedValue(undefined),
      movePillsToFolders: jest
        .fn()
        .mockResolvedValue({ alreadyExistsItems: [] }),
      copyPillsToFolders: jest
        .fn()
        .mockResolvedValue({ alreadyExistsItems: [] }),
      deletePillFromFolder: jest.fn().mockResolvedValue(true),
      getPillsByFolder: jest.fn().mockResolvedValue([]),
    };
    service = new PillSaveService(mockRepository);
  });

  describe('getFolders', () => {
    it('정렬 옵션에 따라 올바른 order clause로 폴더를 조회하고 프리뷰 이미지를 매핑해야 한다', async () => {
      const folders = await service.getFolders('name_asc');

      expect(mockRepository.getFolders).toHaveBeenCalledWith('name_asc');
      expect(mockRepository.getFolderPreviewImages).toHaveBeenCalledWith(1);
      // pill_count가 0인 폴더 2는 프리뷰 이미지를 조회하지 않고 빈 배열이어야 함
      expect(mockRepository.getFolderPreviewImages).not.toHaveBeenCalledWith(2);
      expect(folders[0].preview_images).toEqual(['img1.png', 'img2.png']);
      expect(folders[1].preview_images).toEqual([]);
    });

    it('createdAt_desc 정렬 옵션을 올바르게 처리해야 한다', async () => {
      await service.getFolders('createdAt_desc');
      expect(mockRepository.getFolders).toHaveBeenCalledWith('createdAt_desc');
    });

    it('pillCount_desc 정렬 옵션을 올바르게 처리해야 한다', async () => {
      await service.getFolders('pillCount_desc');
      expect(mockRepository.getFolders).toHaveBeenCalledWith('pillCount_desc');
    });
  });

  describe('createFolder', () => {
    it('유효한 폴더 이름일 경우 생성을 요청해야 한다', async () => {
      const id = await service.createFolder(' 새 폴더 ');
      expect(mockRepository.createFolder).toHaveBeenCalledWith('새 폴더');
      expect(id).toBe(3);
    });

    it('빈 문자열일 경우 생성하지 않고 null을 반환해야 한다', async () => {
      const id = await service.createFolder('   ');
      expect(mockRepository.createFolder).not.toHaveBeenCalled();
      expect(id).toBeNull();
    });
  });

  describe('renameFolder', () => {
    it('유효한 이름일 경우 이름 변경을 요청해야 한다', async () => {
      const success = await service.renameFolder(2, ' 변경된 폴더 ');
      expect(mockRepository.renameFolder).toHaveBeenCalledWith(
        2,
        '변경된 폴더',
      );
      expect(success).toBe(true);
    });

    it('빈 문자열일 경우 변경하지 않고 false를 반환해야 한다', async () => {
      const success = await service.renameFolder(2, '   ');
      expect(mockRepository.renameFolder).not.toHaveBeenCalled();
      expect(success).toBe(false);
    });
  });

  describe('deleteFolder', () => {
    it('폴더 삭제를 요청해야 한다', async () => {
      const success = await service.deleteFolder(2);
      expect(mockRepository.deleteFolder).toHaveBeenCalledWith(2);
      expect(success).toBe(true);
    });
  });

  describe('savePillToFolders', () => {
    it('알약 저장 성공 시 북마크 트래킹 액션을 호출해야 한다', async () => {
      const increaseMock = jest.fn();
      (useAppTrackStore.getState as unknown as jest.Mock).mockReturnValue({
        increaseReviewActionCount: increaseMock,
      });

      await service.savePillToFolders('199303108', '타이레놀', [1, 2]);

      expect(mockRepository.savePillToFolders).toHaveBeenCalledWith(
        '199303108',
        '타이레놀',
        [1, 2],
      );
      expect(increaseMock).toHaveBeenCalledWith('bookmarked');
    });

    it('파라미터가 유효하지 않으면 저장을 수행하지 않아야 한다', async () => {
      await service.savePillToFolders('', '타이레놀', [1]);
      expect(mockRepository.savePillToFolders).not.toHaveBeenCalled();
    });
  });
});
