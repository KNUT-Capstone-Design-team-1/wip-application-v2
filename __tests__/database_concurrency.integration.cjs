const { test } = require('node:test');
const assert = require('node:assert/strict');
const { Buffer } = require('node:buffer');
const { createSqliteRuntime } = require('./helpers/sqlite_runtime.cjs');

const deferred = () => {
  let resolve;
  const promise = new Promise((done) => {
    resolve = done;
  });
  return { promise, resolve };
};

test('transactions serialize BEGIN and recover after an intervening rollback', async () => {
  const { sqlite, db, load } = createSqliteRuntime();
  const { runDatabaseTransaction } = load(
    'src/services/database/transaction.ts',
  );
  sqlite.exec('CREATE TABLE writes (id INTEGER PRIMARY KEY)');
  const entered = deferred();
  const release = deferred();
  const first = runDatabaseTransaction(db, async () => {
    entered.resolve();
    await release.promise;
    await db.runAsync('INSERT INTO writes VALUES (1)');
  });
  await entered.promise;
  const failed = runDatabaseTransaction(db, async () => {
    await db.runAsync('INSERT INTO writes VALUES (2)');
    throw Error('intentional failure');
  });
  const last = runDatabaseTransaction(db, async () => {
    await db.runAsync('INSERT INTO writes VALUES (3)');
  });
  const results = Promise.allSettled([first, failed, last]);
  release.resolve();
  assert.deepEqual(
    (await results).map((result) => result.status),
    ['fulfilled', 'rejected', 'fulfilled'],
  );
  assert.deepEqual(
    sqlite
      .prepare('SELECT id FROM writes ORDER BY id')
      .all()
      .map((row) => row.id),
    [1, 3],
  );
  sqlite.close();
});

test('concurrent resource page inserts complete without nested transactions', async () => {
  const { sqlite, load } = createSqliteRuntime({
    '@utils/index': {
      base64ToUint8Array: (value) => Buffer.from(value, 'base64'),
    },
  });
  sqlite.exec('CREATE TABLE mark_images (code TEXT PRIMARY KEY, title TEXT)');
  const { insertData } = load('src/services/database/queries/init_table.ts');
  await Promise.all([
    insertData('mark_images', [{ code: '1', title: 'One' }]),
    insertData('mark_images', [{ code: '2', title: 'Two' }]),
  ]);
  assert.equal(
    sqlite.prepare('SELECT COUNT(*) AS n FROM mark_images').get().n,
    2,
  );
  sqlite.close();
});

test('cancelled sync retains ownership until native work finishes and skips stale queued tasks', async () => {
  const { sqlite, load } = createSqliteRuntime();
  const { enqueueDatabaseSync } = load(
    'src/features/database_update/services/database_sync_queue.ts',
  );
  const entered = deferred();
  const release = deferred();
  const events = [];
  let cancelled = false;
  const first = enqueueDatabaseSync(
    async () => {
      events.push('first:start');
      entered.resolve();
      await release.promise;
      events.push('first:end');
    },
    () => cancelled,
  );
  await entered.promise;
  cancelled = true;
  const stale = enqueueDatabaseSync(
    async () => {
      events.push('stale');
    },
    () => true,
  );
  const next = enqueueDatabaseSync(
    async () => {
      events.push('next');
    },
    () => false,
  );
  await Promise.resolve();
  assert.deepEqual(events, ['first:start']);
  release.resolve();
  await Promise.all([first, stale, next]);
  assert.deepEqual(events, ['first:start', 'first:end', 'next']);
  await assert.rejects(
    enqueueDatabaseSync(
      async () => {
        throw Error('sync failure');
      },
      () => false,
    ),
    /sync failure/,
  );
  await enqueueDatabaseSync(
    async () => {
      events.push('retry');
    },
    () => false,
  );
  assert.equal(events.at(-1), 'retry');
  sqlite.close();
});

test('notification changes arriving during rescheduling are applied before callers finish', async () => {
  const entered = deferred();
  const release = deferred();
  let calls = 0;
  const { sqlite, load } = createSqliteRuntime({
    '@features/pill_reminder/data/repositories/pill_reminder_notification_repository':
      {},
    '@features/pill_reminder/services/pill_reminder_notification_permission_service':
      {},
    '@features/pill_reminder/utils/reminder_notification_response_helper': {},
    '@features/pill_reminder/services/pill_reminder_reschedule_service': {
      rescheduleAllPillReminders: async () => {
        calls++;
        if (calls === 1) {
          entered.resolve();
          await release.promise;
        }
        return { total: calls, success: calls, failed: 0, failures: [] };
      },
    },
  });
  const { pillReminderNotificationService: service } = load(
    'src/features/pill_reminder/services/pill_reminder_notification_service.ts',
  );
  const first = service.rescheduleAllNotifications();
  await entered.promise;
  const second = service.rescheduleAllNotifications();
  release.resolve();
  const results = await Promise.all([first, second]);
  assert.equal(calls, 2);
  assert.ok(results.every((result) => result.total === 2));
  await service.rescheduleAllNotifications();
  assert.equal(calls, 3);
  sqlite.close();
});
