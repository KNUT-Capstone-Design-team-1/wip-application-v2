import { TABLE_READY_TIMEOUT_MS } from '../constants/table_webview';
import type { TableLoadResult } from '../types/table_webview_type';

export class TableLoadError extends Error {
  constructor(readonly reason: Exclude<TableLoadResult, 'ready'>) {
    super('Table loading: ' + reason);
    this.name = 'TableLoadError';
  }
}

// 시간 초과는 현재 대기만 끝내고, 늦게 도착한 결과와 재시도를 허용한다.
export const createTableLoadState = () => {
  let status: 'ready' | 'error' | undefined;
  const waiters = new Set<(result: TableLoadResult) => void>();

  const finish = (result: TableLoadResult) => {
    waiters.forEach((resolve) => resolve(result));
  };

  const wait = (): Promise<TableLoadResult> => {
    const settledStatus = status;
    const isSettled = !!settledStatus;

    if (isSettled) {
      return Promise.resolve(settledStatus);
    }

    return new Promise((resolve) => {
      const settle = (result: TableLoadResult) => {
        clearTimeout(timer);
        waiters.delete(settle);
        resolve(result);
      };

      const timer = setTimeout(() => settle('timeout'), TABLE_READY_TIMEOUT_MS);
      waiters.add(settle);
    });
  };

  return {
    wait,
    complete: () => {
      status = 'ready';
      finish(status);
    },
    fail: () => {
      status = 'error';
      finish(status);
    },
    cancel: () => finish('cancelled'),
  };
};
