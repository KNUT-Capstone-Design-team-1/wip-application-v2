import { runDatabaseTransaction } from '@services/database/transaction';
import { splitQueryValues } from '@services/database/query_batch';
import type { SQLiteDatabase } from 'expo-sqlite';
import type {
  IPillSaveOperationItem,
  IPillSaveOperationResult,
} from '../../types/pill_save_folder_type';

type TransferEntry = { item: IPillSaveOperationItem; targetId: number };
const placeholders = (count: number) => Array(count).fill('?').join(',');

// 대상 중복을 한 번만 조회하고 조합을 한 번만 순회한다.
const planTransfer = async (
  db: SQLiteDatabase,
  items: IPillSaveOperationItem[],
  targetFolderIds: number[],
) => {
  type ExistingRow = {
    folder_id: number;
    item_seq: string;
    folder_name: string | null;
  };
  const rows: ExistingRow[] = [];
  for (const chunk of splitQueryValues(items, targetFolderIds.length)) {
    rows.push(
      ...(await db.getAllAsync<ExistingRow>(
        `SELECT s.folder_id, s.item_seq, f.name AS folder_name
       FROM saved_pills s
       JOIN saved_pill_folders f ON s.folder_id = f.id
       WHERE s.folder_id IN (${placeholders(targetFolderIds.length)})
         AND s.item_seq IN (${placeholders(chunk.length)})`,
        [...targetFolderIds, ...chunk.map((item) => item.seq)],
      )),
    );
  }
  const existing = new Map(
    rows.map((row) => [`${row.folder_id}_${row.item_seq}`, row.folder_name]),
  );
  const entries: TransferEntry[] = [];
  const alreadyExistsItems: IPillSaveOperationItem[] = [];
  for (const item of items) {
    for (const targetId of targetFolderIds) {
      const key = `${targetId}_${item.seq}`;
      if (existing.has(key)) {
        alreadyExistsItems.push({
          ...item,
          folderId: targetId,
          folderName: existing.get(key) ?? '',
        });
      } else {
        entries.push({ item, targetId });
      }
    }
  }
  return { entries, alreadyExistsItems };
};

// 3개 바인딩 × 300행으로 SQLite의 999개 파라미터 한도를 넘지 않는다.
const insertTransferEntries = async (
  db: SQLiteDatabase,
  entries: TransferEntry[],
) => {
  for (let start = 0; start < entries.length; start += 300) {
    const chunk = entries.slice(start, start + 300);
    await db.runAsync(
      `INSERT INTO saved_pills (folder_id, item_seq, item_name)
       VALUES ${chunk.map(() => '(?, ?, ?)').join(',')}`,
      chunk.flatMap(({ item, targetId }) => [targetId, item.seq, item.name]),
    );
  }
};

export const transferSavedPills = async (
  db: SQLiteDatabase,
  items: IPillSaveOperationItem[],
  targetFolderIds: number[],
  sourceFolderId?: number,
): Promise<IPillSaveOperationResult> => {
  const uniqueItems = [
    ...new Map(items.map((item) => [item.seq, item])).values(),
  ];
  const targets = [...new Set(targetFolderIds)];
  if (!uniqueItems.length || !targets.length) return { alreadyExistsItems: [] };

  let result: IPillSaveOperationResult = { alreadyExistsItems: [] };
  await runDatabaseTransaction(db, async () => {
    const { entries, alreadyExistsItems } = await planTransfer(
      db,
      uniqueItems,
      targets,
    );
    if (sourceFolderId !== undefined && entries.length) {
      const seqs = [...new Set(entries.map(({ item }) => item.seq))];
      for (const chunk of splitQueryValues(seqs, 1)) {
        await db.runAsync(
          `DELETE FROM saved_pills WHERE folder_id = ?
           AND item_seq IN (${placeholders(chunk.length)})`,
          [sourceFolderId, ...chunk],
        );
      }
    }
    await insertTransferEntries(db, entries);
    result = { alreadyExistsItems };
  });
  return result;
};
