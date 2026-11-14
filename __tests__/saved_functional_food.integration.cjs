// Run with: node --test __tests__/saved_functional_food.integration.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createSqliteRuntime } = require('./helpers/sqlite_runtime.cjs');

test('foods share folder operations and reminder metadata without colliding with pills', async () => {
  const { sqlite, load } = createSqliteRuntime();
  sqlite.exec(`
    CREATE TABLE pill_data (ITEM_SEQ TEXT PRIMARY KEY, ITEM_NAME TEXT,
      ENTP_NAME TEXT, CHART TEXT, ITEM_IMAGE TEXT, CLASS_NAME TEXT,
      PRINT_FRONT TEXT, PRINT_BACK TEXT);
    CREATE TABLE health_functional_food_raw_material
      (PRDLST_REPORT_NO TEXT PRIMARY KEY, PRDLST_NM TEXT, BSSH_NM TEXT);
    CREATE TABLE saved_pill_folders (id INTEGER PRIMARY KEY, name TEXT,
      is_default INTEGER DEFAULT 0, sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE saved_pills (idx INTEGER PRIMARY KEY, folder_id INTEGER,
      item_seq TEXT, item_name TEXT, UNIQUE(folder_id, item_seq));
    CREATE TABLE pill_reminder_items (id INTEGER PRIMARY KEY, reminder_id INTEGER,
      item_seq TEXT, item_name TEXT, dosage INTEGER);
    INSERT INTO pill_data VALUES ('123', 'Medicine', 'Pharma', '', 'pill.png', 'Drug', '', '');
    INSERT INTO health_functional_food_raw_material VALUES ('123', 'Vitamin', 'Food maker');
    INSERT INTO saved_pill_folders (id, name, is_default) VALUES (1, 'Default', 1), (2, 'Travel', 0);
  `);
  const identity = load('src/features/pill_save/utils/saved_item_identity.ts');
  const { pillSaveSqliteDataSource: saved } = load(
    'src/features/pill_save/data/datasources/pill_save_sqlite_datasource.ts',
  );
  const { pillReminderSqliteDataSource: reminders } = load(
    'src/features/pill_reminder/data/datasources/pill_reminder_sqlite_datasource.ts',
  );
  const foodId = identity.getFunctionalFoodItemSeq('123');
  assert.equal(identity.getFunctionalFoodReportNumber(foodId), '123');
  assert.equal(identity.getFunctionalFoodReportNumber('123'), null);
  await saved.savePillToFolders('123', 'Medicine', [1]);
  await saved.savePillToFolders(foodId, 'Vitamin', [1]);
  const items = await saved.getPillsByFolder(1);
  assert.equal(items.length, 2);
  assert.equal(
    items.find((item) => item.ITEM_SEQ === foodId).ENTP_NAME,
    'Food maker',
  );
  assert.equal(
    items.find((item) => item.ITEM_SEQ === '123').ITEM_IMAGE,
    'pill.png',
  );
  await saved.copyPillsToFolders([{ seq: foodId, name: 'Vitamin' }], [2]);
  assert.equal((await saved.getPillsByFolder(2))[0].ITEM_SEQ, foodId);
  await saved.deletePillFromFolder(foodId, 2);
  await saved.movePillsToFolders([{ seq: foodId, name: 'Vitamin' }], 1, [2]);
  assert.deepEqual(await saved.getPillSavedFolderIds(foodId), [2]);
  assert.equal(
    (await reminders.getPillsByFolder(2))[0].ENTP_NAME,
    'Food maker',
  );
  const metadata = await reminders.getPillDataBySeqs(['123', foodId]);
  assert.equal(metadata.length, 2);
  assert.equal(
    metadata.find((item) => item.ITEM_SEQ === foodId).ITEM_NAME,
    'Vitamin',
  );
  sqlite
    .prepare('INSERT INTO pill_reminder_items VALUES (1, 7, ?, ?, 2)')
    .run(foodId, 'Vitamin');
  for (const rows of [
    await reminders.getReminderItemsByReminderId(7),
    await reminders.getReminderItemsByReminderIds([7]),
  ]) {
    assert.equal(rows[0].item_seq, foodId);
    assert.equal(rows[0].ENTP_NAME, 'Food maker');
    assert.equal(rows[0].dosage, 2);
  }
  // A cache refresh may remove a product; saved names remain available for reminder editing.
  sqlite
    .prepare(
      'DELETE FROM health_functional_food_raw_material WHERE PRDLST_REPORT_NO = ?',
    )
    .run('123');
  const { pillReminderQueryService } = load(
    'src/features/pill_reminder/services/pill_reminder_query_service.ts',
  );
  const fallback = await pillReminderQueryService.getPillsBySeqs([foodId]);
  assert.equal(fallback[0].item_name, 'Vitamin');
  assert.equal((await saved.getPillsByFolder(2))[0].ITEM_NAME, 'Vitamin');
  await saved.savePillToFolders(foodId, 'Vitamin', []);
  assert.deepEqual(await saved.getPillSavedFolderIds(foodId), []);
  assert.equal((await saved.getPillsByFolder(1))[0].ITEM_SEQ, '123');
  sqlite.close();
});
