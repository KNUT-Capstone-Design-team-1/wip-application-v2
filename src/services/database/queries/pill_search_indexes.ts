import type { SQLiteDatabase } from 'expo-sqlite';

// 쿼리와 부분 인덱스가 같은 조건식을 사용해야 SQLite가 인덱스를 선택할 수 있다.
export const PILL_IDENTIFICATION_CONDITION =
  "TRIM(COALESCE(DRUG_SHAPE, '')) <> ''";

export const initPillSearchIndexes = async (db: SQLiteDatabase) => {
  const table = await db.getFirstAsync<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'pill_data'",
  );
  if (!table) return;

  // 넓은 원본 레코드 대신 검색 필드만 읽고, 페이지가 결정된 뒤 본문을 조회한다.
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_pill_identification_search ON pill_data (
      ITEM_NAME, ITEM_SEQ, DRUG_SHAPE, PRINT_FRONT, PRINT_BACK,
      COLOR_CLASS1, COLOR_CLASS2, LINE_FRONT, LINE_BACK,
      MARK_CODE_FRONT, MARK_CODE_BACK, FORM_CODE, ENTP_NAME
    ) WHERE ${PILL_IDENTIFICATION_CONDITION};
    CREATE INDEX IF NOT EXISTS idx_pill_ingredient_names
      ON pill_data (MAIN_ITEM_INGR, MATERIAL_ENG_NAME)
      WHERE MAIN_ITEM_INGR IS NOT NULL AND MATERIAL_ENG_NAME IS NOT NULL;
  `);
};
