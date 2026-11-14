const { test } = require('node:test');
const assert = require('node:assert/strict');
const { performance } = require('node:perf_hooks');
const { createSqliteRuntime } = require('./helpers/sqlite_runtime.cjs');

const setup = async (overrides = {}) => {
  const runtime = createSqliteRuntime({
    '@features/pill_reminder/services/pill_reminder_notification_service': {
      pillReminderNotificationService: {
        getNotificationPermissionState: async () => ({
          notificationGranted: true,
        }),
        rescheduleAllNotifications: async () => ({
          total: 0,
          success: 0,
          failed: 0,
          failures: [],
        }),
      },
    },
    '@react-native-async-storage/async-storage': {
      default: { getItem: async () => null },
    },
    '@store/app_track_store': {
      useAppTrackStore: {
        getState: () => ({ increaseReviewActionCount() {} }),
      },
    },
    ...overrides,
  });
  const { load, sqlite, db } = runtime;
  const init = load('src/services/database/index.ts');
  await init.initSavedPillTables(db);
  await init.initPillReminderTables(db);
  sqlite.exec(`
    CREATE TABLE pill_data (ITEM_SEQ TEXT PRIMARY KEY, ITEM_NAME TEXT, ENTP_NAME TEXT,
      CHART TEXT, ITEM_IMAGE TEXT, CLASS_NAME TEXT, PRINT_FRONT TEXT, PRINT_BACK TEXT);
    CREATE TABLE health_functional_food_raw_material (
      PRDLST_REPORT_NO TEXT PRIMARY KEY, PRDLST_NM TEXT, BSSH_NM TEXT,
      PRMS_DT TEXT, PRDT_SHAP_CD_NM TEXT, CLASSIFICATION_IDS TEXT, DISPOS TEXT);
    CREATE TABLE functional_food_classification (id INTEGER PRIMARY KEY, PRDCT_NM TEXT);
    CREATE TABLE nearby_pharmacies (id TEXT PRIMARY KEY, Y REAL, X REAL);
  `);
  return runtime;
};

test('folder previews use two reads, preserve recent image order, and skip empty images', async () => {
  const { sqlite, load, queries } = await setup();
  const { pillSaveSqliteDataSource: saved } = load(
    'src/features/pill_save/data/datasources/pill_save_sqlite_datasource.ts',
  );
  const { pillSaveService } = load(
    'src/features/pill_save/services/pill_save_service.ts',
  );
  sqlite.exec(`
    INSERT INTO saved_pill_folders (id, name) VALUES (2, 'Empty'), (3, 'Food');
    INSERT INTO health_functional_food_raw_material (PRDLST_REPORT_NO, PRDLST_NM) VALUES ('food', 'Vitamin');
    INSERT INTO saved_pills (folder_id, item_seq, item_name) VALUES (3, 'functional-food:food', 'Vitamin');
  `);
  for (let i = 0; i < 8; i++) {
    sqlite
      .prepare(
        'INSERT INTO pill_data (ITEM_SEQ, ITEM_NAME, ITEM_IMAGE) VALUES (?, ?, ?)',
      )
      .run(String(i), 'Pill', i === 7 ? '' : `image-${i}`);
    await saved.savePillToFolders(String(i), 'Pill', [1]);
  }
  const expected = await saved.getFolderPreviewImages(1);
  queries.length = 0;
  const folders = await pillSaveService.getFolders();
  assert.equal(queries.length, 2);
  assert.ok(queries.every((query) => query.kind === 'all'));
  assert.deepEqual(
    folders.find((folder) => folder.id === 1).preview_images,
    expected,
  );
  assert.deepEqual(expected, ['image-6', 'image-5', 'image-4', 'image-3']);
  assert.deepEqual(
    folders.find((folder) => folder.id === 2).preview_images,
    [],
  );
  assert.deepEqual(
    folders.find((folder) => folder.id === 3).preview_images,
    [],
  );
  sqlite.close();
});

test('storage changes reschedule OS notifications after commit and skip unchanged saves', async () => {
  let reschedules = 0;
  const { sqlite, load } = await setup({
    '@features/pill_reminder/services/pill_reminder_notification_service': {
      pillReminderNotificationService: {
        getNotificationPermissionState: async () => ({
          notificationGranted: true,
        }),
        rescheduleAllNotifications: async () => {
          reschedules++;
        },
      },
    },
  });
  const { pillSaveService: service } = load(
    'src/features/pill_save/services/pill_save_service.ts',
  );
  sqlite.exec("INSERT INTO saved_pill_folders (id, name) VALUES (2, 'Other')");
  await service.savePillToFolders('functional-food:1', 'Food', [1, 2]);
  await service.savePillToFolders('functional-food:1', 'Food', [1, 2]);
  assert.equal(reschedules, 0);
  await service.savePillToFolders('functional-food:1', 'Food', [1]);
  assert.equal(reschedules, 1);
  await service.copyPillsToFolders(
    [{ seq: 'functional-food:1', name: 'Food' }],
    [2],
  );
  assert.equal(reschedules, 1);
  await service.deletePillFromFolder('functional-food:1', 2);
  assert.equal(reschedules, 2);
  await service.movePillsToFolders(
    [{ seq: 'functional-food:1', name: 'Food' }],
    1,
    [2],
  );
  assert.equal(reschedules, 3);
  await service.deleteMultiplePillsFromFolder(['functional-food:1'], 2);
  assert.equal(reschedules, 4);
  assert.equal(await service.deleteFolder(1), false);
  assert.equal(reschedules, 4);
  assert.equal(await service.deleteFolder(2), true);
  assert.equal(reschedules, 5);
  sqlite.close();
});

test('bookmark removal neither requests notification permission nor fails after a schedule refresh error', async () => {
  let granted = false;
  let reschedules = 0;
  const errors = [];
  const { sqlite, load } = await setup({
    '@utils/logger': { default: { error: (message) => errors.push(message) } },
    '@features/pill_reminder/services/pill_reminder_notification_service': {
      pillReminderNotificationService: {
        getNotificationPermissionState: async () => ({
          notificationGranted: granted,
        }),
        rescheduleAllNotifications: async () => {
          reschedules++;
          throw Error('native failure');
        },
      },
    },
  });
  const { pillSaveService: service } = load(
    'src/features/pill_save/services/pill_save_service.ts',
  );
  await service.savePillToFolders('functional-food:1', 'Food', [1]);
  assert.equal(
    await service.deletePillFromFolder('functional-food:1', 1),
    true,
  );
  assert.equal(reschedules, 0);
  granted = true;
  await service.savePillToFolders('functional-food:1', 'Food', [1]);
  assert.equal(
    await service.deletePillFromFolder('functional-food:1', 1),
    true,
  );
  assert.equal(reschedules, 1);
  assert.equal(errors.length, 1);
  assert.deepEqual(
    await service.getPillSavedFolderIds('functional-food:1'),
    [],
  );
  sqlite.close();
});

test('bulk transfer stays under binding limits and rolls back partial batches', async () => {
  const { sqlite, load, queries } = await setup();
  const { pillSaveSqliteDataSource: saved } = load(
    'src/features/pill_save/data/datasources/pill_save_sqlite_datasource.ts',
  );
  sqlite.exec(
    "INSERT INTO saved_pill_folders (id, name) VALUES (2, 'Target'), (3, 'Other')",
  );
  const items = Array.from({ length: 1000 }, (_, i) => ({
    seq: String(i),
    name: `Pill ${i}`,
  }));
  for (const item of items)
    sqlite
      .prepare(
        'INSERT INTO saved_pills (folder_id, item_seq, item_name) VALUES (1, ?, ?)',
      )
      .run(item.seq, item.name);
  await saved.copyPillsToFolders([items[0]], [2]);
  queries.length = 0;
  await saved.copyPillsToFolders(items, [2, 3]);
  assert.equal(queries.filter((query) => query.kind === 'run').length, 7);
  assert.ok(queries.every((query) => query.values.length <= 900));
  assert.equal(
    sqlite
      .prepare('SELECT COUNT(*) AS n FROM saved_pills WHERE folder_id = 2')
      .get().n,
    1000,
  );
  const duplicate = await saved.movePillsToFolders([items[0]], 1, [2]);
  assert.equal(duplicate.alreadyExistsItems.length, 1);
  assert.equal(
    sqlite
      .prepare('SELECT COUNT(*) AS n FROM saved_pills WHERE folder_id = 1')
      .get().n,
    1000,
  );
  sqlite.exec(`
    DELETE FROM saved_pills WHERE folder_id IN (2, 3);
    CREATE TRIGGER reject_transfer BEFORE INSERT ON saved_pills
      WHEN NEW.folder_id = 2 AND NEW.item_seq = '950'
      BEGIN SELECT RAISE(ABORT, 'test failure'); END;
  `);
  // Call the public datasource so transaction handling is exercised through the same path as the app.
  await assert.rejects(saved.movePillsToFolders(items, 1, [2]), /test failure/);
  assert.equal(
    sqlite
      .prepare('SELECT COUNT(*) AS n FROM saved_pills WHERE folder_id = 1')
      .get().n,
    1000,
  );
  assert.equal(
    sqlite
      .prepare('SELECT COUNT(*) AS n FROM saved_pills WHERE folder_id = 2')
      .get().n,
    0,
  );
  sqlite.close();
});

test('saving selected folders preserves reminders in retained folders', async () => {
  const { sqlite, load } = await setup();
  const { pillSaveSqliteDataSource: saved } = load(
    'src/features/pill_save/data/datasources/pill_save_sqlite_datasource.ts',
  );
  sqlite.exec(
    "INSERT INTO saved_pill_folders (id, name) VALUES (2, 'Removed'), (3, 'Added')",
  );
  await saved.savePillToFolders('functional-food:test', 'Vitamin', [1, 2]);
  sqlite.exec(`
    INSERT INTO pill_reminders (id, folder_id, times, days) VALUES (1, 1, '08:00', '1'), (2, 2, '09:00', '2');
    INSERT INTO pill_reminder_items (reminder_id, item_seq, item_name) VALUES
      (1, 'functional-food:test', 'Vitamin'), (2, 'functional-food:test', 'Vitamin');
  `);
  await saved.savePillToFolders(
    'functional-food:test',
    'Vitamin updated',
    [1, 3],
  );
  assert.deepEqual(
    sqlite
      .prepare('SELECT id FROM pill_reminders')
      .all()
      .map((row) => row.id),
    [1],
  );
  assert.deepEqual(
    await saved.getPillSavedFolderIds('functional-food:test'),
    [1, 3],
  );
  await saved.savePillToFolders('functional-food:test', 'Vitamin', []);
  assert.equal(
    sqlite.prepare('SELECT COUNT(*) AS n FROM pill_reminders').get().n,
    0,
  );
  sqlite.close();
});

test('food indexes preserve pages and filters and reduce sorted rows to the requested page', async (context) => {
  const { sqlite, load, db, queries } = await setup();
  sqlite.exec(`
    WITH RECURSIVE numbers(n) AS (VALUES(1) UNION ALL SELECT n + 1 FROM numbers WHERE n < 30000)
    INSERT INTO health_functional_food_raw_material
    SELECT printf('%06d', n), 'Vitamin ' || n, 'Maker ' || (n % 10),
      printf('2026%04d', n % 365), CASE WHEN n % 2 = 0 THEN ' Capsule ' ELSE 'Powder' END,
      '[]', hex(zeroblob(512)) FROM numbers;
  `);
  const foods = load('src/services/database/queries/functional_food.ts');
  const { initResourceQueryIndexes } = load(
    'src/services/database/queries/resource_query_indexes.ts',
  );
  const options = { page: 5, limit: 30 };
  const baseline =
    sqlite.prepare(`SELECT p.* FROM health_functional_food_raw_material p
    WHERE TRIM(p.PRDT_SHAP_CD_NM) = ? ORDER BY p.PRMS_DT DESC, p.PRDLST_REPORT_NO LIMIT ? OFFSET ?`);
  const args = ['Capsule', 30, 120];
  const expected = baseline.all(...args);
  const measure = (fn) => {
    const samples = Array.from({ length: 9 }, () => {
      const start = performance.now();
      fn();
      return performance.now() - start;
    });
    return samples.sort((a, b) => a - b)[4];
  };
  const beforeMs = measure(() => baseline.all(...args));
  await initResourceQueryIndexes(db);
  await initResourceQueryIndexes(db); // Restart must be idempotent.
  assert.equal(
    sqlite
      .prepare(
        "SELECT COUNT(*) AS n FROM sqlite_master WHERE name = 'idx_food_report_number'",
      )
      .get().n,
    0,
  );
  queries.length = 0;
  assert.deepEqual(
    await foods.getFunctionalFoods({ productForm: 'Capsule' }, options),
    expected,
  );
  const query = queries[0];
  const plan = sqlite
    .prepare('EXPLAIN QUERY PLAN ' + query.sql)
    .all(...query.values)
    .map((row) => row.detail);
  assert.ok(
    plan.some((detail) => detail.includes('idx_food_form_date_report')),
  );
  const afterMs = measure(() => sqlite.prepare(query.sql).all(...query.values));
  assert.equal(
    await foods.getFunctionalFoodsCount({ productForm: 'Capsule' }),
    15000,
  );
  const page = await foods.getFunctionalFoods(
    { keyword: 'Vitamin 1', manufacturer: 'Maker 2' },
    { page: 1, limit: 30 },
  );
  assert.ok(
    page.every(
      (item) =>
        item.PRDLST_NM.includes('Vitamin 1') &&
        item.BSSH_NM.includes('Maker 2'),
    ),
  );
  const allPage = await foods.getFunctionalFoods({}, { page: 1, limit: 30 });
  assert.equal(allPage.length, 30);
  assert.deepEqual(
    allPage,
    sqlite
      .prepare(
        `SELECT * FROM health_functional_food_raw_material
    ORDER BY PRMS_DT DESC, PRDLST_REPORT_NO LIMIT 30`,
      )
      .all(),
  );
  sqlite.exec(`
    INSERT INTO functional_food_classification VALUES (1, 'Category'), (2, 'Category');
    UPDATE health_functional_food_raw_material SET CLASSIFICATION_IDS = '[1,2]'
      WHERE PRDLST_REPORT_NO = '000001';
    UPDATE health_functional_food_raw_material SET PRDLST_NM = 'Literal %_!'
      WHERE PRDLST_REPORT_NO = '000002';
  `);
  assert.equal(
    (await foods.getFunctionalFoods({ classificationName: 'Category' })).length,
    1,
  );
  assert.equal(
    await foods.getFunctionalFoodsCount({ classificationName: 'Category' }),
    1,
  );
  const escaped = await foods.getFunctionalFoods({ keyword: '%_!' });
  assert.equal(escaped.length, 1);
  assert.equal(escaped[0].PRDLST_REPORT_NO, '000002');
  const pharmacyPlan = sqlite
    .prepare(
      'EXPLAIN QUERY PLAN SELECT * FROM nearby_pharmacies WHERE Y BETWEEN ? AND ? AND X BETWEEN ? AND ?',
    )
    .all(35, 36, 126, 127);
  assert.ok(
    pharmacyPlan.some((row) => row.detail.includes('idx_pharmacy_coordinates')),
  );
  context.diagnostic(
    JSON.stringify({ fixtureRows: 30000, beforeMs, afterMs, plan }),
  );
  sqlite.close();
});

test('resource indexes handle missing tables and return after table recreation', async () => {
  const { sqlite, load, db } = createSqliteRuntime();
  const { initResourceQueryIndexes } = load(
    'src/services/database/queries/resource_query_indexes.ts',
  );
  await initResourceQueryIndexes(db);
  const schema = `CREATE TABLE health_functional_food_raw_material (
    PRDLST_REPORT_NO TEXT, PRDLST_NM TEXT, BSSH_NM TEXT,
    PRMS_DT TEXT, PRDT_SHAP_CD_NM TEXT)`;
  sqlite.exec(schema);
  await initResourceQueryIndexes(db, 'health_functional_food_raw_material');
  assert.equal(
    sqlite
      .prepare(
        "SELECT COUNT(*) AS n FROM sqlite_master WHERE name = 'idx_food_report_number'",
      )
      .get().n,
    1,
  );
  sqlite.exec('DROP TABLE health_functional_food_raw_material');
  sqlite.exec(schema);
  await initResourceQueryIndexes(db, 'health_functional_food_raw_material');
  assert.equal(
    sqlite
      .prepare(
        "SELECT COUNT(*) AS n FROM sqlite_master WHERE name = 'idx_food_form_date_report'",
      )
      .get().n,
    1,
  );
  sqlite.close();
});

test('reminder lookup returns one row per reminder for multiple matching items', async () => {
  const { sqlite, load } = await setup();
  sqlite.exec(`
    INSERT INTO pill_reminders (id, folder_id, times, days) VALUES (1, 1, '08:00', '1'), (2, 1, '09:00', '2');
    INSERT INTO pill_reminder_items (reminder_id, item_seq, item_name) VALUES
      (1, 'a', 'A'), (1, 'b', 'B'), (2, 'b', 'B');
  `);
  const { pillReminderSqliteDataSource: reminders } = load(
    'src/features/pill_reminder/data/datasources/pill_reminder_sqlite_datasource.ts',
  );
  assert.deepEqual(
    (await reminders.getRemindersByItemSeqs(['a', 'b'])).map((item) => item.id),
    [1, 2],
  );
  assert.deepEqual(
    (await reminders.getRemindersByItemSeq('a')).map((item) => item.id),
    [1],
  );
  sqlite.close();
});

test('1000 mixed items retain metadata, reminder ordering, and safe bindings through deletion', async () => {
  const { sqlite, load, queries } = await setup();
  const seqs = Array.from({ length: 1000 }, (_, i) =>
    i % 2 ? `functional-food:${i}` : String(i),
  );
  const insertPill = sqlite.prepare(
    'INSERT INTO pill_data (ITEM_SEQ, ITEM_NAME) VALUES (?, ?)',
  );
  const insertFood = sqlite.prepare(
    'INSERT INTO health_functional_food_raw_material (PRDLST_REPORT_NO, PRDLST_NM) VALUES (?, ?)',
  );
  const insertSaved = sqlite.prepare(
    'INSERT INTO saved_pills (folder_id, item_seq, item_name) VALUES (1, ?, ?)',
  );
  const insertReminder = sqlite.prepare(
    "INSERT INTO pill_reminders (id, times, days) VALUES (?, ?, '1')",
  );
  const insertItem = sqlite.prepare(
    'INSERT INTO pill_reminder_items (reminder_id, item_seq, item_name) VALUES (?, ?, ?)',
  );
  for (let i = 0; i < seqs.length; i++) {
    if (i % 2) insertFood.run(String(i), `Food ${i}`);
    else insertPill.run(String(i), `Pill ${i}`);
    insertSaved.run(seqs[i], `Item ${i}`);
    insertReminder.run(i + 1, i % 2 ? '09:00' : '08:00');
    insertItem.run(i + 1, seqs[i], `Item ${i}`);
  }
  const { pillReminderSqliteDataSource: reminders } = load(
    'src/features/pill_reminder/data/datasources/pill_reminder_sqlite_datasource.ts',
  );
  const { pillSaveSqliteDataSource: saved } = load(
    'src/features/pill_save/data/datasources/pill_save_sqlite_datasource.ts',
  );
  queries.length = 0;
  const metadata = await reminders.getPillDataBySeqs([...seqs, seqs[0]]);
  assert.equal(metadata.length, 1000);
  assert.equal(
    metadata.find((item) => item.ITEM_SEQ === 'functional-food:999').ITEM_NAME,
    'Food 999',
  );
  assert.equal((await reminders.getSavedPillsBySeqs(seqs)).length, 1000);
  const rows = await reminders.getRemindersByItemSeqs(seqs);
  assert.equal(rows.length, 1000);
  assert.equal(rows[0].id, 1);
  assert.equal(rows[499].id, 999);
  assert.equal(rows[500].id, 2);
  const items = await reminders.getReminderItemsByReminderIds(
    rows.map((row) => row.id),
  );
  assert.equal(items.length, 1000);
  assert.equal(items[0].id, 1);
  assert.equal(items.at(-1).id, 1000);
  assert.equal(await saved.deleteMultiplePills(seqs, 1), true);
  assert.equal(
    sqlite.prepare('SELECT COUNT(*) AS n FROM saved_pills').get().n,
    0,
  );
  assert.equal(
    sqlite.prepare('SELECT COUNT(*) AS n FROM pill_reminders').get().n,
    0,
  );
  assert.ok(queries.every((query) => query.values.length <= 900));
  sqlite.close();
});
