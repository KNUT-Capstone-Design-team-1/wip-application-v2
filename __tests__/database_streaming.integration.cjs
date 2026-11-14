const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createSqliteRuntime } = require('./helpers/sqlite_runtime.cjs');

const deferred = () => {
  let resolve;
  const promise = new Promise((done) => {
    resolve = done;
  });
  return { promise, resolve };
};

const createPipeline = ({ fetchPage, insert, cancelled = () => false }) => {
  const events = [];
  const { sqlite, load } = createSqliteRuntime({
    '@utils/logger': { default: { info: () => {} } },
    '../../data/repositories/database_update_repository': {
      databaseUpdateRepository: {
        insertData: async (_table, rows) => insert(rows[0].page),
        initTableIndexes: async () => events.push('indexes'),
      },
    },
    '../database_download_service': {
      databaseDownloadService: {
        fetchAndCachePageData: async (_table, page) => fetchPage(page),
        saveUpdateState: async () => events.push('save'),
      },
    },
    '../database_update_service': {
      databaseUpdateService: {
        initTable: async () => {
          events.push('init');
          return 'OK';
        },
        verifyInsertedRowCount: async () => events.push('verify'),
        updateDatabaseVersion: async () => {
          events.push('version');
          return 'OK';
        },
      },
    },
  });
  const { executeStreamingPhase } = load(
    'src/features/database_update/services/pipeline/streaming_phase.ts',
  );
  const callbacks = Object.fromEntries(
    [
      'setUpdateCurrentTable',
      'setUpdateStatus',
      'setUpdateProgress',
      'setTotalPages',
      'setUpdateCurrentPage',
      'setOverallProgress',
    ].map((name) => [name, () => {}]),
  );
  return {
    events,
    sqlite,
    run: () =>
      executeStreamingPhase(
        [{ table: 'pill_data', schemaVer: 1, dataVer: 1 }],
        { current: 0 },
        cancelled,
        callbacks,
      ),
  };
};

const payload = (page, totalPage = 9) => ({
  resource: [{ page }],
  total: totalPage,
  totalPage,
  current: page,
});

test('streaming overlaps bounded downloads with ordered inserts and finalizes before versioning', async () => {
  const entered = deferred();
  const releaseInsert = deferred();
  const releaseDownloads = deferred();
  const requested = [];
  const inserted = [];
  const pipeline = createPipeline({
    fetchPage: async (page) => {
      requested.push(page);
      if (page > 1) await releaseDownloads.promise;
      return payload(page);
    },
    insert: async (page) => {
      inserted.push(page);
      if (page === 1) {
        entered.resolve();
        await releaseInsert.promise;
      }
    },
  });
  const operation = pipeline.run();
  await entered.promise;
  assert.deepEqual(requested, [1, 2, 3, 4, 5]);
  assert.deepEqual(inserted, [1]);
  assert.ok(pipeline.events.indexOf('save') < pipeline.events.indexOf('init'));
  releaseDownloads.resolve();
  await Promise.resolve();
  assert.equal(
    requested.length,
    5,
    'completed downloads cannot grow beyond the window',
  );
  releaseInsert.resolve();
  await operation;
  assert.deepEqual(inserted, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.deepEqual(pipeline.events.slice(-3), ['indexes', 'verify', 'version']);
  pipeline.sqlite.close();
});

test('streaming drains pending downloads after insert failure without updating version', async () => {
  const started = deferred();
  const release = deferred();
  const pipeline = createPipeline({
    fetchPage: async (page) => {
      if (page > 1) await release.promise;
      if (page === 3) throw Error('network failure');
      return payload(page);
    },
    insert: async () => {
      started.resolve();
      throw Error('insert failure');
    },
  });
  let finished = false;
  const operation = pipeline.run().finally(() => {
    finished = true;
  });
  const checked = assert.rejects(operation, /insert failure/);
  await started.promise;
  await Promise.resolve();
  assert.equal(finished, false);
  release.resolve();
  await checked;
  assert.equal(pipeline.events.includes('version'), false);
  pipeline.sqlite.close();
});

test('streaming cancellation drains active downloads and stops inserting pages', async () => {
  const started = deferred();
  const release = deferred();
  let cancelled = false;
  const inserted = [];
  const pipeline = createPipeline({
    cancelled: () => cancelled,
    fetchPage: async (page) => {
      if (page > 1) await release.promise;
      return payload(page);
    },
    insert: async (page) => {
      inserted.push(page);
      cancelled = true;
      started.resolve();
    },
  });
  let finished = false;
  const operation = pipeline.run().then(() => {
    finished = true;
  });
  await started.promise;
  await Promise.resolve();
  assert.equal(finished, false);
  release.resolve();
  await operation;
  assert.deepEqual(inserted, [1]);
  assert.equal(pipeline.events.includes('version'), false);
  pipeline.sqlite.close();
});

test('JSON bulk inserts preserve values and sparse rows with one binding per chunk', async () => {
  const { sqlite, load, queries } = createSqliteRuntime({ '@utils/index': {} });
  sqlite.exec(
    'CREATE TABLE nearby_pharmacies (id INTEGER PRIMARY KEY, name TEXT, score REAL, optional TEXT)',
  );
  const { insertData } = load('src/services/database/queries/init_table.ts');
  const rows = Array.from({ length: 501 }, (_, id) => ({
    id,
    name: `한글 ' " \\ \n ${id}`,
    score: id / 10,
    ...(id === 500 ? { optional: 'last' } : {}),
  }));
  await insertData('nearby_pharmacies', rows);
  assert.deepEqual(
    sqlite
      .prepare('SELECT * FROM nearby_pharmacies ORDER BY id')
      .all()
      .map((row) => ({ ...row })),
    rows.map((row) => ({ optional: null, ...row })),
  );
  const executions = queries.filter((query) => query.kind === 'execute');
  assert.equal(executions.length, 3);
  assert.ok(executions.every((query) => query.values.length === 1));
  sqlite.close();
});

test('resource insert falls back when SQLite JSON functions are unavailable', async () => {
  const { sqlite, db, load, queries } = createSqliteRuntime({
    '@utils/index': {},
  });
  db.getFirstAsync = async () => {
    throw Error('no such function: json_valid');
  };
  sqlite.exec(
    'CREATE TABLE nearby_pharmacies (id INTEGER PRIMARY KEY, name TEXT)',
  );
  const { insertData } = load('src/services/database/queries/init_table.ts');
  await insertData('nearby_pharmacies', [{ id: 1, name: '약국' }]);
  assert.equal(
    sqlite.prepare('SELECT name FROM nearby_pharmacies').get().name,
    '약국',
  );
  assert.ok(
    queries.some(
      (query) => query.kind === 'execute' && query.values.length === 2,
    ),
  );
  sqlite.close();
});
