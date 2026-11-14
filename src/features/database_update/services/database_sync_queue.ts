let pendingSync: Promise<void> = Promise.resolve();

// 취소는 네이티브 DB 작업을 즉시 중단하지 않는다. 종료까지 기다린 뒤 다음 실행을 허용한다.
export const enqueueDatabaseSync = (
  task: () => Promise<void>,
  isCancelled: () => boolean,
): Promise<void> => {
  const operation = pendingSync.then(async () => {
    if (!isCancelled()) await task();
  });
  pendingSync = operation.catch(() => undefined);
  return operation;
};
