import {
  validateFolderCreation,
  validatePillLimit,
  validateFolderSelectionLimit,
  MAX_FOLDER_COUNT,
  MAX_PILL_COUNT_PER_FOLDER,
  MAX_FOLDER_SELECTION,
} from '../../../src/features/pill_save/utils/pill_save_validator';
import { ISavedPillFolder } from '../../../src/services/database/types';

describe('PillSave Validator 단위 테스트', () => {
  const mockFolders: ISavedPillFolder[] = [
    { id: 1, name: '기본 보관함', is_default: 1, created_at: '2026-01-01' },
    { id: 2, name: '감기약', is_default: 0, created_at: '2026-01-02' },
  ];

  describe('validateFolderCreation', () => {
    it('폴더 이름이 비어있으면 실패해야 한다', () => {
      const result = validateFolderCreation(mockFolders, '   ', true);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('폴더 이름을 입력해주세요.');
    });

    it('폴더 개수가 최대치를 초과하면 실패해야 한다', () => {
      const fullFolders = new Array(MAX_FOLDER_COUNT)
        .fill(null)
        .map((_, i) => ({
          id: i + 1,
          name: `폴더 ${i + 1}`,
          is_default: 0,
          created_at: '2026-01-01',
        }));

      const result = validateFolderCreation(fullFolders, '새 폴더', true);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain(`최대 ${MAX_FOLDER_COUNT}개`);
    });

    it('중복된 폴더 이름이면 실패해야 한다', () => {
      const result = validateFolderCreation(mockFolders, '감기약', true);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('이미 존재하는 폴더 이름입니다.');
    });

    it('자기 자신의 이름을 그대로 수정할 때는 중복으로 처리되지 않아야 한다', () => {
      const result = validateFolderCreation(mockFolders, '감기약', false, 2);
      expect(result.isValid).toBe(true);
    });
  });

  describe('validatePillLimit', () => {
    it('알약 개수가 폴더당 최대치를 초과하면 실패해야 한다', () => {
      const foldersWithCount = [
        { ...mockFolders[0], pill_count: MAX_PILL_COUNT_PER_FOLDER },
      ];

      const result = validatePillLimit(foldersWithCount, [1], 1);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain(
        `최대 ${MAX_PILL_COUNT_PER_FOLDER}개`,
      );
    });

    it('알약 개수가 제한 이내이면 성공해야 한다', () => {
      const foldersWithCount = [{ ...mockFolders[0], pill_count: 50 }];

      const result = validatePillLimit(foldersWithCount, [1], 10);
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateFolderSelectionLimit', () => {
    it('이동/복사 시 선택 폴더 수가 최대치를 초과하면 실패해야 한다', () => {
      const result = validateFolderSelectionLimit(MAX_FOLDER_SELECTION, true);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain(`최대 ${MAX_FOLDER_SELECTION}개`);
    });

    it('선택 수가 제한 이내이면 성공해야 한다', () => {
      const result = validateFolderSelectionLimit(5, true);
      expect(result.isValid).toBe(true);
    });
  });
});
