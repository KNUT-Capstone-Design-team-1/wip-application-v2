import AsyncStorage from '@react-native-async-storage/async-storage';
import { SQLiteDatabase } from 'expo-sqlite';
import logger from '@utils/logger';

const SAVE_DATA_KEY = 'saveData';

interface ILegacySavedPill {
  ITEM_SEQ: string;
  ITEM_NAME?: string;
}

const isLegacySavedPill = (value: unknown): value is ILegacySavedPill => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const item = value as Partial<ILegacySavedPill>;
  return typeof item.ITEM_SEQ === 'string' && item.ITEM_SEQ.length > 0;
};

export const migrateAsyncStorageToSQLite = async (db: SQLiteDatabase) => {
  try {
    const raw = await AsyncStorage.getItem(SAVE_DATA_KEY);
    if (!raw) return;

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      await AsyncStorage.removeItem(SAVE_DATA_KEY);
      return;
    }

    if (parsed.length === 0) {
      await AsyncStorage.removeItem(SAVE_DATA_KEY);
      return;
    }

    const validPills = parsed.filter(isLegacySavedPill);

    if (validPills.length === 0) {
      logger.error(
        '[MIGRATION] No valid saved pills found. Keeping legacy data.',
      );
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
    for (const pill of validPills) {
      const itemName = pill.ITEM_NAME || '이름 없음';

      await db.runAsync(
        `INSERT OR IGNORE INTO saved_pills (folder_id, item_seq, item_name, created_at) VALUES (?, ?, ?, datetime('now', 'localtime'))`,
        [defaultFolderId, pill.ITEM_SEQ, itemName],
      );
    }

    const hasInvalidPills = validPills.length !== parsed.length;

    if (hasInvalidPills) {
      logger.error(
        '[MIGRATION] Invalid saved pills found. Keeping legacy data for recovery.',
      );
      return;
    }

    logger.info('[MIGRATION] Migration complete. Removing AsyncStorage key.');
    await AsyncStorage.removeItem(SAVE_DATA_KEY);
  } catch (e: any) {
    logger.error(`[MIGRATION] Failed to migrate saved pills: ${e}`);
  }
};
