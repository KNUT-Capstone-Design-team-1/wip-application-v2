import AsyncStorage from '@react-native-async-storage/async-storage';
import { SQLiteDatabase } from 'expo-sqlite';
import logger from '@utils/logger';

const SAVE_DATA_KEY = 'saveData';

export const migrateAsyncStorageToSQLite = async (db: SQLiteDatabase) => {
  try {
    const raw = await AsyncStorage.getItem(SAVE_DATA_KEY);
    if (!raw) return;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      await AsyncStorage.removeItem(SAVE_DATA_KEY);
      return;
    }

    logger.info(
      '[MIGRATION] Found saved pills in AsyncStorage. Migrating to SQLite...',
    );

    // Get the default folder ID
    const defaultFolderRow = await db.getFirstAsync<{ id: number }>(
      `SELECT id FROM saved_pill_folders WHERE is_default = 1 LIMIT 1`,
    );

    if (!defaultFolderRow) {
      logger.error('[MIGRATION] Default folder not found!');
      return;
    }

    const defaultFolderId = defaultFolderRow.id;

    // Migrate each pill
    for (const pill of parsed) {
      if (!pill.ITEM_SEQ) continue;

      const itemName = pill.ITEM_NAME || '이름 없음';

      await db.runAsync(
        `INSERT OR IGNORE INTO saved_pills (folder_id, item_seq, item_name, created_at) VALUES (?, ?, ?, datetime('now', 'localtime'))`,
        [defaultFolderId, pill.ITEM_SEQ, itemName],
      );
    }

    logger.info('[MIGRATION] Migration complete. Removing AsyncStorage key.');
    await AsyncStorage.removeItem(SAVE_DATA_KEY);
  } catch (e: any) {
    logger.error(`[MIGRATION] Failed to migrate saved pills: ${e}`);
  }
};
