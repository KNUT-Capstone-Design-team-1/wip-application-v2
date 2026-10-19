import { TABLE_READY_TIMEOUT_MS } from '../constants/table_webview';

// 표 로딩 대기·해제 관리.
export const createTableLoadState = () => {
  let loaded = false;
  const waiters = new Set<() => void>();

  // 현재 대기 요청 해제.
  const release = () => {
    waiters.forEach((finish) => finish());
  };

  // 높이 수신 완료 표시.
  const complete = () => {
    loaded = true;
    release();
  };

  // 표 로딩 완료 대기.
  const wait = async (): Promise<void> => {
    if (loaded) {
      return;
    }

    await new Promise<void>((resolve) => {
      const finish = () => {
        clearTimeout(timer);
        waiters.delete(finish);
        resolve();
      };

      const timer = setTimeout(finish, TABLE_READY_TIMEOUT_MS);
      waiters.add(finish);
    });
  };

  return {
    wait,
    complete,
    release,
    reset: () => {
      loaded = false;
    },
  };
};
