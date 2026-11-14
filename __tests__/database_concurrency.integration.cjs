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

test('resource inserts respect SQLite variable limits, reuse statements and keep sparse BLOB rows', async () => {
  for (const limit of [999, null, 32766]) {
    let decoded = 0;
    const { sqlite, db, load, queries } = createSqliteRuntime({
      '@utils/index': {
        base64ToUint8Array: (value) => {
          decoded++;
          return Buffer.from(value, 'base64');
        },
      },
    });
    db.getAllAsync = async () =>
      limit ? [{ compile_options: `MAX_VARIABLE_NUMBER=${limit}` }] : [];
    const columns = [
      'code',
      'base64',
      ...Array.from({ length: 41 }, (_, i) => `c${i}`),
    ];
    sqlite.exec(
      `CREATE TABLE mark_images (code TEXT PRIMARY KEY, base64 BLOB, ${columns.slice(2).join(', ')})`,
    );
    const rows = Array.from({ length: 605 }, (_, i) => ({
      ...Object.fromEntries(columns.slice(2).map((name) => [name, i])),
      code: String(i),
      ...(i % 2 === 0 ? { base64: 'data:image/png;base64,aGVsbG8=' } : {}),
    }));
    const { insertData } = load('src/services/database/queries/init_table.ts');
    await insertData('mark_images', rows);
    const executes = queries.filter((q) => q.kind === 'execute');
    const prepares = queries.filter((q) => q.kind === 'prepare');
    assert.ok(executes.every((q) => q.values.length <= (limit ?? 900)));
    assert.ok(prepares.length <= 2);
    assert.ok(executes.length > prepares.length);
    assert.equal(
      queries.filter((q) => q.kind === 'finalize').length,
      prepares.length,
    );
    assert.equal(
      sqlite.prepare('SELECT COUNT(*) AS n FROM mark_images').get().n,
      rows.length,
    );
    assert.equal(decoded, 303);
    assert.equal(
      Buffer.from(
        sqlite.prepare("SELECT base64 FROM mark_images WHERE code = '0'").get()
          .base64,
      ).toString(),
      'hello',
    );
    assert.equal(
      sqlite.prepare("SELECT base64 FROM mark_images WHERE code = '1'").get()
        .base64,
      null,
    );
    sqlite.close();
  }
});

test('failed resource inserts finalize statements and roll back the entire page', async () => {
  const { sqlite, load, queries } = createSqliteRuntime({
    '@utils/index': { base64ToUint8Array: (v) => Buffer.from(v, 'base64') },
  });
  sqlite.exec(
    "CREATE TABLE mark_images (code TEXT PRIMARY KEY, title TEXT CHECK(title <> 'fail'))",
  );
  const rows = Array.from({ length: 401 }, (_, i) => ({
    code: String(i),
    title: i === 400 ? 'fail' : 'ok',
  }));
  const { insertData } = load('src/services/database/queries/init_table.ts');
  await assert.rejects(
    insertData('mark_images', rows),
    /CHECK constraint failed/,
  );
  assert.equal(
    sqlite.prepare('SELECT COUNT(*) AS n FROM mark_images').get().n,
    0,
  );
  assert.equal(
    queries.filter((q) => q.kind === 'finalize').length,
    queries.filter((q) => q.kind === 'prepare').length,
  );
  await insertData('mark_images', [{ code: 'retry', title: 'ok' }]);
  assert.equal(
    sqlite.prepare('SELECT COUNT(*) AS n FROM mark_images').get().n,
    1,
  );
  sqlite.close();
});

test('full resource replacement builds search indexes after data insertion', async () => {
  const { sqlite, load } = createSqliteRuntime({
    '@utils/index': { base64ToUint8Array: (v) => Buffer.from(v, 'base64') },
  });
  const query = load('src/services/database/queries/init_table.ts');
  const schema = ['X', 'Y'].map((name) => ({
    name,
    type: 'REAL',
    nullable: true,
    isPK: false,
    defaultValue: null,
  }));
  await query.createTable('nearby_pharmacies', schema, { deferIndexes: true });
  const indexes = () =>
    sqlite
      .prepare(
        "SELECT name FROM sqlite_master WHERE type = 'index' AND name = 'idx_pharmacy_coordinates'",
      )
      .all();
  assert.equal(indexes().length, 0);
  await query.insertData('nearby_pharmacies', [{ X: 127, Y: 37 }]);
  await query.initTableIndexes('nearby_pharmacies');
  assert.equal(indexes().length, 1);
  assert.equal(await query.getTableRowCount('nearby_pharmacies'), 1);
  await query.dropTable('nearby_pharmacies');
  await query.createTable('nearby_pharmacies', schema);
  assert.equal(indexes().length, 1);
  sqlite.close();
});

test('database apply waits for indexes before verifying and rejects index failures', async () => {
  const events = [];
  let failIndexes = false;
  const { sqlite, load } = createSqliteRuntime({
    '@utils/index': { logger: { info: () => {}, error: () => {} } },
    '../data/repositories/database_update_repository': {
      databaseUpdateRepository: {
        getTableSchema: async () => ({ columns: [{ name: 'code' }] }),
        dropTable: async () => events.push('drop'),
        createTable: async (_table, _columns, options) => {
          assert.equal(options.deferIndexes, true);
          events.push('create');
        },
        insertData: async () => events.push('insert'),
        initTableIndexes: async () => {
          events.push('indexes');
          if (failIndexes) throw Error('index build failed');
        },
        getTableRowCount: async () => {
          events.push('verify');
          return 1;
        },
      },
    },
    './database_download_service': {
      databaseDownloadService: {
        readCachedPageData: async () => ({ resource: [{ code: '1' }] }),
      },
    },
  });
  const { databaseUpdateService } = load(
    'src/features/database_update/services/database_update_service.ts',
  );
  assert.equal(
    await databaseUpdateService.applyCachedDataToTable('mark_images', 1, 1),
    'OK',
  );
  assert.deepEqual(events, ['drop', 'create', 'insert', 'indexes', 'verify']);
  events.length = 0;
  failIndexes = true;
  await assert.rejects(
    databaseUpdateService.applyCachedDataToTable('mark_images', 1, 1),
    /index build failed/,
  );
  assert.deepEqual(events, ['drop', 'create', 'insert', 'indexes']);
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
