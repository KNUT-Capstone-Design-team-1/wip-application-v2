import { getDatabase } from '../../../src/services/database/sqlite';
import {
  getClassificationCatalog,
  invalidateClassificationCatalog,
} from '../../../src/services/database/queries/classification_catalog';
jest.mock('../../../src/services/database/sqlite', () => ({
  getDatabase: jest.fn(),
}));
const query = jest.fn();
beforeEach(() => {
  invalidateClassificationCatalog('narcotics');
  (getDatabase as jest.Mock).mockResolvedValue({ getAllAsync: query });
  query.mockReset().mockResolvedValue([]);
});
test('동시 요청과 후속 요청은 한 번의 쿼리를 공유한다', async () => {
  const [a, b] = await Promise.all([
    getClassificationCatalog(),
    getClassificationCatalog(),
  ]);
  expect(a).toBe(b);
  expect(await getClassificationCatalog()).toBe(a);
  expect(query).toHaveBeenCalledTimes(1);
  expect(query.mock.calls[0][0]).toContain('UNION ALL');
  expect(query.mock.calls[0][0]).not.toContain('LIMIT');
});
test('분류 DB 갱신 후 다시 읽고 다른 테이블 갱신은 캐시를 보존한다', async () => {
  await getClassificationCatalog();
  invalidateClassificationCatalog('pill_data');
  await getClassificationCatalog();
  expect(query).toHaveBeenCalledTimes(1);
  invalidateClassificationCatalog('prohibited_list');
  await getClassificationCatalog();
  expect(query).toHaveBeenCalledTimes(2);
});
test('실패한 조회는 캐시하지 않고 재시도한다', async () => {
  query.mockRejectedValueOnce(new Error('db busy'));
  await expect(getClassificationCatalog()).rejects.toThrow('db busy');
  await expect(getClassificationCatalog()).resolves.toEqual([]);
  expect(query).toHaveBeenCalledTimes(2);
});

test('갱신 전에 시작된 조회가 완료되어도 새 캐시를 덮어쓰지 않는다', async () => {
  let resolveOld!: (rows: unknown[]) => void;
  query.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        resolveOld = resolve;
      }),
  );
  const old = getClassificationCatalog();
  await Promise.resolve();
  await Promise.resolve();
  invalidateClassificationCatalog('cannabis');
  const fresh = await getClassificationCatalog();
  resolveOld([{ kind: 'cannabis', kr: 'old' }]);
  await old;
  expect(await getClassificationCatalog()).toBe(fresh);
  expect(query).toHaveBeenCalledTimes(2);
});
