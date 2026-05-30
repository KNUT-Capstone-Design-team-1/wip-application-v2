import { initDatabase } from '../../src/services/database';
import {
  PillDataQuery,
  CannabisQuery,
  ConfigQuery,
  MarkImagesQuery,
  NarcoticsQuery,
  NearbyPharmaciesQuery,
  ProhibitedListQuery,
  PsychotropicsQuery,
} from '../../src/services/database/queries';

let lastExecutedSql = '';
let lastExecutedParams: any[] = [];

const mockDb = {
  execAsync: jest.fn((sql) => {
    lastExecutedSql = sql;
    console.log('\x1b[36m%s\x1b[0m', '--- [EXEC SQL] ---');
    console.log(sql);
    return Promise.resolve();
  }),

  runAsync: jest.fn((sql, params) => {
    lastExecutedSql = sql;
    lastExecutedParams = params || [];
    console.log('\x1b[33m%s\x1b[0m', '--- [RUN SQL] ---');
    console.log('SQL:', sql);
    console.log('Params:', JSON.stringify(params));
    return Promise.resolve({ changes: 1, lastInsertRowId: 1 });
  }),

  getAllAsync: jest.fn((sql, params) => {
    lastExecutedSql = sql;
    lastExecutedParams = params || [];
    console.log('\x1b[32m%s\x1b[0m', '--- [SELECT SQL] ---');
    console.log('SQL:', sql);
    console.log('Params:', JSON.stringify(params));
    return Promise.resolve([]);
  }),

  getFirstAsync: jest.fn((sql, params) => {
    lastExecutedSql = sql;
    lastExecutedParams = params || [];
    console.log('\x1b[35m%s\x1b[0m', '--- [GET FIRST SQL] ---');
    console.log('SQL:', sql);
    console.log('Params:', JSON.stringify(params));
    return Promise.resolve(null);
  }),
};

jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(() => Promise.resolve(mockDb)),
}));

describe('전체 테이블 쿼리 문법 검증 테스트', () => {
  beforeAll(async () => {
    await initDatabase();
  });

  describe('1. PillData (알약 데이터)', () => {
    test('기본 검색 및 페이징 확인', async () => {
      await PillDataQuery.getPillDatas(
        { ITEM_NAME: '타이레놀' },
        { page: 2, limit: 20 },
      );
      expect(lastExecutedSql).toContain('WHERE ITEM_NAME LIKE ?');
      expect(lastExecutedSql).toContain('LIMIT ?, ?');
      expect(lastExecutedParams).toContain(20); // offset/limit 확인
    });
  });

  describe('2. Config (환경설정)', () => {
    test('특정 키 업데이트 확인', async () => {
      await ConfigQuery.updateSpecificConfig('pillDataDataVersion', '20240426');
      expect(lastExecutedSql).toContain(
        'UPDATE config SET `value` = ? WHERE `key` = ?',
      );
      expect(lastExecutedParams).toEqual(['20240426', 'pillDataDataVersion']);
    });
  });

  describe('3. MarkImages (마크 이미지)', () => {
    test('마크 코드로 조회 확인', async () => {
      await MarkImagesQuery.getMarkImages(
        { code: 'M123' },
        { page: 1, limit: 10 },
      );
      expect(lastExecutedSql).toContain('WHERE code = ?');
      expect(lastExecutedParams).toContain('M123');
    });
  });

  describe('4. NearbyPharmacies (주변 약국)', () => {
    test('좌표 기반 거리 필터링 및 정렬 쿼리 확인', async () => {
      await NearbyPharmaciesQuery.getNearbyPharmacies(
        { coordinate: { x: 127.1, y: 37.5 } },
        { page: 1, limit: 5 },
      );

      expect(lastExecutedParams).toContain(127.1); // x 좌표
    });
  });

  describe('5. Narcotics / Cannabis / Psychotropics (마약류)', () => {
    test('마약류 국문명 검색 확인', async () => {
      await NarcoticsQuery.getNarcotics(
        { chemicalNameKr: '코카인' },
        { page: 1, limit: 10 },
      );
      expect(lastExecutedSql).toContain('WHERE chemicalNameKr LIKE ?');
      expect(lastExecutedParams).toContain('%코카인%');
    });

    test('대마초 영문명 검색 확인', async () => {
      await CannabisQuery.getCannabis(
        { chemicalNameEn: 'CANNABIS' },
        { page: 1, limit: 10 },
      );
      expect(lastExecutedSql).toContain('WHERE chemicalNameEn LIKE ?');
    });

    test('향정신성 의약품 검색 확인', async () => {
      await PsychotropicsQuery.getPsychotropics(
        { chemicalNameKr: '졸피뎀' },
        { page: 1, limit: 10 },
      );
      expect(lastExecutedSql).toContain('WHERE chemicalNameKr LIKE ?');
    });
  });

  describe('6. ProhibitedList (도핑 금지 약물)', () => {
    test('금지 약물 카테고리 검색 확인', async () => {
      await ProhibitedListQuery.getProhibitedList(
        { contents: 'Gestrinone' },
        { page: 1, limit: 10 },
      );
      expect(lastExecutedSql).toContain('WHERE contents LIKE ?');
      expect(lastExecutedParams).toContain('%Gestrinone%');
    });
  });
});
