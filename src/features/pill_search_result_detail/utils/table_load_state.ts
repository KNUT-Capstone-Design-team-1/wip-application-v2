import { TABLE_READY_TIMEOUT_MS } from '../constants/table_webview';

// 표 로딩 대기·해제 관리.
export const createTableLoadState = () => {
  let isSettled = false;

  const waiters = new Set<() => void>();

  // 완료·실패·시간 초과 후에는 같은 표를 다시 기다리지 않는다.
  const release = () => {
    isSettled = true;
    waiters.forEach((finish) => finish());
  };

  // 표 로딩이 끝나거나 제한 시간이 지날 때까지 기다린다.
  const wait = async (): Promise<void> => {
    if (isSettled) {
      return;
    }

    await new Promise<void>((resolve) => {
      // 타이머와 대기 목록을 정리하고 현재 대기를 끝낸다.
      const finish = () => {
        clearTimeout(timer);
        waiters.delete(finish);
        resolve();
      };

      const timer = setTimeout(release, TABLE_READY_TIMEOUT_MS);
      waiters.add(finish);
    });
  };

  return {
    wait,
    complete: release,
    release,
    // 문서가 바뀌면 기존 대기를 해제하고 새 로딩을 기다린다.
    reset: () => {
      release();
      isSettled = false;
    },
  };
};
