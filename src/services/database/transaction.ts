import type { SQLiteDatabase } from 'expo-sqlite';

const transactionQueues = new WeakMap<SQLiteDatabase, Promise<void>>();

// 같은 연결에서 BEGIN이 겹치지 않도록 완료(롤백 포함) 후 다음 작업을 시작한다.
// task 안에서 이 함수를 다시 호출하지 않고 전달받은 연결로 쿼리를 실행한다.
export const runDatabaseTransaction = (
  db: SQLiteDatabase,
  task: () => Promise<void>,
): Promise<void> => {
  const previous = transactionQueues.get(db) ?? Promise.resolve();
  const operation = previous.then(() => db.withTransactionAsync(task));
  transactionQueues.set(
    db,
    operation.catch(() => undefined),
  );
  return operation;
};
