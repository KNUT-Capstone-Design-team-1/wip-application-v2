import type { SQLiteDatabase } from 'expo-sqlite';
import { splitQueryValues } from '@services/database/query_batch';
import {
  FUNCTIONAL_FOOD_ITEM_PREFIX,
  getFunctionalFoodReportNumber,
} from '@features/pill_save/utils/saved_item_identity';
import type { IPillReminderPillData } from '../../types/pill_reminder_data_type';

// 한 배치에서 의약품과 영양제의 바인딩 수 합계가 900개를 넘지 않도록 한다.
export const getReminderPillMetadata = async (
  db: SQLiteDatabase,
  itemSeqs: string[],
): Promise<IPillReminderPillData[]> => {
  const result: IPillReminderPillData[] = [];
  for (const chunk of splitQueryValues([...new Set(itemSeqs)])) {
    const pillIds: string[] = [];
    const reportNumbers: string[] = [];
    for (const seq of chunk) {
      const reportNumber = getFunctionalFoodReportNumber(seq);
      if (reportNumber === null) pillIds.push(seq);
      else reportNumbers.push(reportNumber);
    }
    const queries: string[] = [];
    const placeholders = (values: string[]) => values.map(() => '?').join(',');
    if (pillIds.length) {
      queries.push(`SELECT ITEM_SEQ, ITEM_NAME,
        COALESCE(ITEM_IMAGE, '') AS ITEM_IMAGE,
        COALESCE(CLASS_NAME, '') AS CLASS_NAME,
        COALESCE(ENTP_NAME, '') AS ENTP_NAME
        FROM pill_data WHERE ITEM_SEQ IN (${placeholders(pillIds)})`);
    }
    if (reportNumbers.length) {
      queries.push(`SELECT '${FUNCTIONAL_FOOD_ITEM_PREFIX}' || PRDLST_REPORT_NO AS ITEM_SEQ,
        PRDLST_NM AS ITEM_NAME, '' AS ITEM_IMAGE, '영양제' AS CLASS_NAME,
        COALESCE(BSSH_NM, '') AS ENTP_NAME
        FROM health_functional_food_raw_material
        WHERE PRDLST_REPORT_NO IN (${placeholders(reportNumbers)})`);
    }
    result.push(
      ...(await db.getAllAsync<IPillReminderPillData>(
        queries.join(' UNION ALL '),
        [...pillIds, ...reportNumbers],
      )),
    );
  }
  return result;
};
