import type { SQLiteDatabase } from 'expo-sqlite';

// 서버에서 내려오는 테이블도 앱 시작과 스키마 재생성 시 인덱스를 복구한다.
const RESOURCE_INDEXES: Record<string, string> = {
  pill_data: `CREATE INDEX IF NOT EXISTS idx_pill_name_seq
    ON pill_data (ITEM_NAME, ITEM_SEQ);`,
  health_functional_food_raw_material: `
    CREATE INDEX IF NOT EXISTS idx_food_date_report
      ON health_functional_food_raw_material
        (PRMS_DT DESC, PRDLST_REPORT_NO, PRDLST_NM, BSSH_NM);
    CREATE INDEX IF NOT EXISTS idx_food_form_date_report
      ON health_functional_food_raw_material
        (TRIM(PRDT_SHAP_CD_NM), PRMS_DT DESC, PRDLST_REPORT_NO, PRDLST_NM, BSSH_NM);`,
  nearby_pharmacies: `CREATE INDEX IF NOT EXISTS idx_pharmacy_coordinates
    ON nearby_pharmacies (Y, X);`,
};

const ensureResourceIndexes = async (db: SQLiteDatabase, table: string) => {
  const sql = RESOURCE_INDEXES[table];
  if (!sql) return;
  await db.execAsync(sql);
  if (table !== 'health_functional_food_raw_material') return;

  // 서버 스키마의 PK/UNIQUE 인덱스가 신고번호 조회를 지원하면 중복 생성하지 않는다.
  const reportIndex = await db.getFirstAsync<{ present: number }>(`
    SELECT 1 AS present
    FROM pragma_index_list('health_functional_food_raw_material') indexes
    JOIN pragma_index_xinfo(indexes.name) columns ON columns.seqno = 0
    WHERE columns.name = 'PRDLST_REPORT_NO'
      AND columns.coll = 'BINARY' AND indexes.partial = 0
    LIMIT 1
  `);
  if (!reportIndex) {
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_food_report_number
      ON health_functional_food_raw_material (PRDLST_REPORT_NO)`);
  }
};

export const initResourceQueryIndexes = async (
  db: SQLiteDatabase,
  table?: string,
) => {
  if (table) {
    await ensureResourceIndexes(db, table);
    return;
  }

  const tables = await db.getAllAsync<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type = 'table'",
  );
  for (const { name } of tables) {
    await ensureResourceIndexes(db, name);
  }
};
