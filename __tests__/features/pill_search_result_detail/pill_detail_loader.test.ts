import { createPillDetailStore } from '../../../src/features/pill_search_result_detail/store/pill_detail_store';
import { createPillDetailLoader } from '../../../src/features/pill_search_result_detail/utils/pill_detail_loader';
import { IPillDetail } from '../../../src/features/pill_search_result_detail/types/pill_detail_type';

// 비동기 조회 완료 시점을 제어.
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((complete) => {
    resolve = complete;
  });

  return { promise, resolve };
}

const basic: IPillDetail = {
  ITEM_SEQ: '1',
  ITEM_NAME: '알약',
  ENTP_NAME: '제조사',
};

// 로딩 단계별 의존성 구성.
function setup() {
  const store = createPillDetailStore({ itemSeq: '1' });
  const service = {
    getBasicDetail: jest.fn<Promise<IPillDetail | null>, [string]>(),
    getRemoteDetail: jest.fn<Promise<Partial<IPillDetail> | null>, [string]>(),
  };
  const loader = createPillDetailLoader(store, service);

  return { store, service, loader };
}

test('기본 정보를 먼저 표시하고 원격 상세만 뒤에 병합한다', async () => {
  const { store, service, loader } = setup();
  const remote = deferred<Partial<IPillDetail> | null>();
  service.getBasicDetail.mockResolvedValue(basic);
  service.getRemoteDetail.mockReturnValue(remote.promise);
  const pending = loader.load();
  await Promise.resolve();
  expect(store.getState().pillData).toEqual(basic);
  expect(store.getState().loading).toBe(false);
  expect(store.getState().detailLoading).toBe(true);
  remote.resolve({ NB_DOC_DATA: '주의사항' });
  await pending;
  expect(store.getState().pillData).toEqual({
    ...basic,
    NB_DOC_DATA: '주의사항',
  });
  expect(store.getState().detailLoading).toBe(false);
});

test('새 조회 후 먼저 시작한 요청이 완료돼도 최신 결과를 덮어쓰지 않는다', async () => {
  const { store, service, loader } = setup();
  const first = deferred<IPillDetail | null>();
  service.getBasicDetail
    .mockReturnValueOnce(first.promise)
    .mockResolvedValueOnce({ ...basic, ITEM_NAME: '최신 알약' });
  service.getRemoteDetail.mockResolvedValue({ NB_DOC_DATA: '최신 문서' });
  const oldRequest = loader.load();
  await loader.load();
  first.resolve(basic);
  await oldRequest;
  expect(store.getState().pillData?.ITEM_NAME).toBe('최신 알약');
  expect(store.getState().pillData?.NB_DOC_DATA).toBe('최신 문서');
  expect(service.getRemoteDetail).toHaveBeenCalledTimes(1);
});

test('화면 이탈 후 완료된 상세 응답은 반영하지 않는다', async () => {
  const { store, service, loader } = setup();
  const remote = deferred<Partial<IPillDetail> | null>();
  service.getBasicDetail.mockResolvedValue(basic);
  service.getRemoteDetail.mockReturnValue(remote.promise);
  const pending = loader.load();
  await Promise.resolve();
  loader.cancel();
  remote.resolve({ NB_DOC_DATA: '늦은 응답' });
  await pending;
  expect(store.getState().pillData).toEqual(basic);
});

test('없는 품목·기본 정보 실패에도 로딩 상태를 종료한다', async () => {
  const { store, service, loader } = setup();
  service.getBasicDetail
    .mockResolvedValueOnce(null)
    .mockRejectedValueOnce(new Error('DB 오류'));
  await loader.load();
  expect(service.getRemoteDetail).not.toHaveBeenCalled();
  await expect(loader.load()).rejects.toThrow('DB 오류');
  expect(store.getState().loading).toBe(false);
  expect(store.getState().detailLoading).toBe(false);
});

test('원격 조회 실패 시 이미 표시한 기본 정보는 유지한다', async () => {
  const { store, service, loader } = setup();
  service.getBasicDetail.mockResolvedValue(basic);
  service.getRemoteDetail.mockRejectedValue(new Error('네트워크 오류'));
  await expect(loader.load()).rejects.toThrow('네트워크 오류');
  expect(store.getState().pillData).toEqual(basic);
  expect(store.getState().detailLoading).toBe(false);
});

test('화면별 Store가 모달·저장·로딩 상태를 서로 공유하지 않는다', async () => {
  const { store, service, loader } = setup();
  const other = createPillDetailStore({ itemSeq: '2' });
  service.getBasicDetail.mockResolvedValue(basic);
  service.getRemoteDetail.mockResolvedValue(null);
  store.getState().setFolderModalVisible(true);
  store.getState().setSavedFolderIds([3]);
  await loader.load();
  expect(other.getState().loading).toBe(true);
  expect(other.getState().pillData).toBeNull();
  expect(other.getState().savedFolderIds).toEqual([]);
  expect(other.getState().isFolderModalVisible).toBe(false);
});

test('품목 코드가 없으면 조회 없이 로딩 상태만 종료한다', async () => {
  const store = createPillDetailStore({});
  const service = { getBasicDetail: jest.fn(), getRemoteDetail: jest.fn() };
  await createPillDetailLoader(store, service).load();
  expect(service.getBasicDetail).not.toHaveBeenCalled();
  expect(store.getState().loading).toBe(false);
  expect(store.getState().detailLoading).toBe(false);
});
