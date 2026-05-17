# 데이터베이스 초기화 시스템

## 개요
SQLite 기반 약품 데이터 관리 시스템 구현 (Realm DB → SQLite 마이그레이션)

---

## 아키텍처

### 1. 데이터베이스 구조

#### Config 테이블
환경 설정 저장
```sql
CREATE TABLE config (
  key VARCHAR(255) PRIMARY KEY NOT NULL,
  value TEXT NULL DEFAULT NULL
)
```

**기본 설정:**
- `pillDataSchemaVersion`: 스키마 버전 (초기값: 0)
- `pillDataResourceVersion`: 데이터 버전 (초기값: 0)

#### PillData 테이블
약품 정보 저장 (34개 컬럼)
```sql
CREATE TABLE pill_data (
  ITEM_SEQ VARCHAR(255) PRIMARY KEY,
  ITEM_NAME TEXT NOT NULL,
  ENTP_NAME TEXT,
  ENTP_SEQ TEXT,
  ITEM_PERMIT_DATE TEXT,
  ETC_OTC_CODE TEXT,
  CHART TEXT,
  BAR_CODE TEXT,
  MATERIAL_NAME TEXT,
  VALID_TERM TEXT,
  STORAGE_METHOD TEXT,
  PACK_UNIT TEXT,
  MAIN_ITEM_INGR TEXT,
  INGR_NAME TEXT,
  ITEM_IMAGE TEXT,
  PRINT_FRONT TEXT,
  PRINT_BACK TEXT,
  DRUG_SHAPE TEXT,
  COLOR_CLASS1 TEXT,
  COLOR_CLASS2 TEXT,
  LINE_FRONT TEXT,
  LINE_BACK TEXT,
  IMG_REGIST_TS TEXT,
  CLASS_NAME TEXT,
  MARK_CODE_FRONT TEXT,
  MARK_CODE_BACK TEXT,
  FORM_CODE TEXT
)
```

---

## 주요 기능

### 1. 데이터베이스 초기화 (`initDatabase`)

**위치:** `src/services/database/index.ts`

**동작 흐름:**
```typescript
initDatabase(onProgress?: (progress) => void)
  ├─ initConfigTable()           // Config 테이블 초기화
  ├─ initPillDataTable()          // PillData 테이블 초기화 및 다운로드
  │   ├─ hasLatestPillData()     // 최신 버전 확인
  │   ├─ requestDatabaseVersion() // 서버 버전 조회
  │   ├─ requestResourceData() // 페이지별 데이터 다운로드
  │   └─ batchInsertPillData()    // 데이터 삽입
  └─ 데이터 검증 (샘플 5개 조회 + 전체 개수)
```

### 2. 버전 관리 (`hasLatestPillData`)

서버 버전과 로컬 버전을 비교하여 업데이트 필요 여부 판단

**버전 형식:** `{schemaVersion}_{dataVersion}`
- 예: `1_20250127`

### 3. 데이터 다운로드

#### API 구조
**엔드포인트:** `EXPO_PUBLIC_GOOGLE_CLOUD_PLATFORM_WIP_PILL_DATA_RESOURCE_URL`

**요청:**
```typescript
GET /api/pill-data?page={pageNumber}
Authorization: Bearer {token}
```

**응답:**
```typescript
{
  resource: IPillData[],  // 약품 데이터 배열 (페이지당 ~5000개)
  total: number,          // 전체 개수 (예: 23862)
  totalPage: number,      // 전체 페이지 수 (예: 5)
  current: number         // 현재 페이지
}
```

#### 다운로드 프로세스
1. 첫 페이지 조회 → `total`, `totalPage` 확인
2. 기존 데이터 삭제 (`DELETE FROM pill_data`)
3. 페이지별 순차 다운로드 (1 → totalPage)
4. 각 페이지 데이터를 SQLite에 `INSERT OR REPLACE`
5. 버전 정보 업데이트

### 4. 배치 삽입 (`batchInsertPillData`)

성능 최적화를 위한 배치 처리
```typescript
INSERT OR REPLACE INTO pill_data (컬럼명...) VALUES (?, ?, ...)
```

- 중복 데이터는 자동으로 덮어쓰기 (`OR REPLACE`)
- 개별 항목 실패 시에도 계속 진행

---

## 사용자 인터페이스

### UpdateDB 컴포넌트
**위치:** `app/UpdateDB.tsx`

**기능:**
- 실시간 프로그레스 바 (0-100%)
- 현재 상태 메시지
- 페이지 진행 상황 (예: "5 / 5 페이지")
- 퍼센트 표시

**상태 메시지:**
1. "DB 초기화 중"
2. "DB 버전 확인 중"
3. "서버 정보 확인 중"
4. "기존 데이터 삭제 중"
5. "약품 데이터 다운로드 중"
6. "버전 정보 업데이트 중"
7. "다운로드 완료"
8. "초기화 완료"

### 앱 레이아웃 통합
**위치:** `app/_layout.tsx`

```typescript
const RootLayout = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [updateProgress, setUpdateProgress] = useState({...});

  useEffect(() => {
    initDatabase((progress) => {
      setUpdateProgress(progress); // 실시간 프로그레스 업데이트
    });
  }, []);

  if (isInitializing) {
    return <UpdateDB {...updateProgress} />; // 로딩 화면
  }

  return <MainApp />; // 메인 화면
};
```

---

## API 클라이언트

### 1. 데이터베이스 버전 조회
**파일:** `src/services/apis/google_cloud/wip_database_version.ts`

```typescript
requestDatabaseVersion(): Promise<{
  pillData: {
    schemaVersion: number,
    dataVersion: number
  }
}>
```

### 2. 약품 데이터 조회
**파일:** `src/services/apis/google_cloud/wip_pill_data_resource.ts`

```typescript
requestResourceData(page: number): Promise<{
  resource: IPillData[],
  total: number,
  totalPage: number,
  current: number
}>
```

### 3. 인증 토큰
**파일:** `src/services/apis/google_cloud/google_cloud_token.ts`

RSA 공개키 암호화를 사용한 토큰 생성
- 현재 UTC 시간을 RSA-OAEP로 암호화
- Base64 인코딩하여 Bearer 토큰으로 사용

---

## 에러 처리

### 1. SQLite 문법 에러
**문제:** `INSERT IGNORE` (MySQL 문법)
**해결:** `INSERT OR IGNORE` (SQLite 문법)

### 2. API 응답 구조 불일치
**문제:** `datas` 필드 없음
**해결:** `resource` 필드 사용

### 3. 개별 데이터 삽입 실패
- try-catch로 개별 항목 에러 처리
- 실패해도 다음 항목 계속 진행
- 에러 로그 출력: `Failed to insert pill data: {ITEM_SEQ}`

### 4. 네트워크 에러
- axios 에러 처리
- 상세 에러 정보 로깅 (status, statusText, data, message)

---

## 성능 최적화

### 1. 프로그레스 콜백
사용자 경험 향상을 위한 실시간 진행률 표시

```typescript
onProgress?.({
  status: '약품 데이터 다운로드 중',
  progress: currentPage / totalPage,  // 0.0 ~ 1.0
  currentPage: 2,
  totalPages: 5
});
```

### 2. 배치 처리
페이지당 ~5000개 데이터를 한 번에 처리

### 3. 메모리 관리
- 페이지별 순차 처리로 메모리 사용 최소화
- 대용량 데이터 로깅 방지

---

## 데이터 검증

### 초기화 완료 후 자동 검증

**1. 샘플 데이터 조회 (5개)**
```sql
SELECT ITEM_SEQ, ITEM_NAME, ENTP_NAME, PRINT_FRONT
FROM pill_data
LIMIT 5
```

**2. 전체 개수 확인**
```sql
SELECT COUNT(*) as count FROM pill_data
```

**콘솔 출력:**
```
✅ PillData loaded (샘플 5개): [...]
✅ Total PillData count: 23862
```

---

## 파일 구조

```
src/services/
├── database/
│   ├── index.ts                 # 메인 DB 초기화 로직
│   ├── sqlite.ts                # SQLite 연결 관리
│   ├── types.ts                 # 타입 정의
│   └── queries/
│       ├── config.ts            # Config 쿼리
│       └── pill_data.ts         # PillData 쿼리
│
└── apis/
    └── google_cloud/
        ├── google_cloud_token.ts          # 토큰 생성
        ├── wip_database_version.ts        # 버전 조회 API
        ├── wip_pill_data_resource.ts      # 데이터 조회 API
        └── wip_pill_data_table_schema.ts  # 스키마 조회 API

app/
├── _layout.tsx              # 앱 레이아웃 + DB 초기화
└── UpdateDB.tsx             # 로딩 화면 UI
```

---

## 환경 변수

`.env` 파일에 다음 변수 필요:

```bash
# Google Cloud API
EXPO_PUBLIC_GOOGLE_CLOUD_PLATFORM_WIP_DATA_BASE_VERSION_URL=...
EXPO_PUBLIC_GOOGLE_CLOUD_PLATFORM_WIP_PILL_DATA_RESOURCE_URL=...
EXPO_PUBLIC_GOOGLE_CLOUD_RSA_PUB_KEY=...

# Cloudflare (향후 사용)
EXPO_PUBLIC_CLOUD_FLARE_RESOURCE_DOWNLOAD_URL=...
EXPO_PUBLIC_CLOUD_FLARE_RESOURCE_BUCKET=...
EXPO_PUBLIC_CLOUD_FLARE_ACCESS_KEY_ID=...
EXPO_PUBLIC_CLOUD_FLARE_SECRET_ACCESS_KEY=...
```

---

## 사용 예시

### 1. 앱 최초 실행
```
1. 앱 시작
2. UpdateDB 로딩 화면 표시
3. "DB 초기화 중" (0%)
4. "서버 정보 확인 중" (0%)
5. "약품 데이터 다운로드 중" (20%, 40%, 60%, 80%, 100%)
   - 1/5 페이지 → 2/5 페이지 → ... → 5/5 페이지
6. "다운로드 완료" (100%)
7. 0.5초 대기
8. 메인 화면으로 전환
```

### 2. 이미 최신 버전인 경우
```
1. "DB 버전 확인 중"
2. "DB 최신 상태" → 즉시 완료
3. 메인 화면으로 전환
```

---

## 향후 개선 사항

### 1. 성능 최적화
- [ ] SQLite 트랜잭션 사용 (배치 삽입 속도 향상)
- [ ] 인덱스 추가 (검색 성능 향상)
- [ ] 병렬 다운로드 고려

### 2. 에러 처리
- [ ] 재시도 로직 추가
- [ ] 네트워크 오프라인 감지
- [ ] 다운로드 중단 시 복구 기능

### 3. 사용자 경험
- [ ] 다운로드 일시정지/재개 기능
- [ ] 백그라운드 다운로드
- [ ] 데이터 사용량 경고 (WiFi 권장)

### 4. 데이터 관리
- [ ] 증분 업데이트 (전체 다운로드 대신 변경된 데이터만)
- [ ] 데이터 압축
- [ ] 캐싱 전략

---

## 트러블슈팅

### Q1. "INSERT IGNORE" 에러 발생
**원인:** MySQL 문법 사용
**해결:** `INSERT OR IGNORE` 사용 (SQLite 문법)

### Q2. "datas is missing or not an array" 에러
**원인:** API 응답 구조 불일치
**해결:** API가 `resource` 필드 사용하는지 확인

### Q3. 로딩 화면에서 멈춤
**원인:**
- 네트워크 연결 문제
- API 토큰 인증 실패
- 서버 에러

**확인 방법:**
1. 콘솔 로그 확인
2. 네트워크 탭 확인 (Expo DevTools)
3. API 응답 확인

### Q4. 데이터가 로드되지 않음
**확인 사항:**
1. 콘솔에 "✅ Total PillData count: 0" → 다운로드 실패
2. 환경 변수 확인
3. API 엔드포인트 URL 확인
4. 인증 토큰 확인

---

## 참고 자료

- [Expo SQLite 공식 문서](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [SQLite 문법 가이드](https://www.sqlite.org/lang.html)
- [React Native Progress Bar](https://github.com/oblador/react-native-progress)

---

## 버전 히스토리

### v1.0.0 (2025-01-28)
- ✅ SQLite 기반 데이터베이스 초기화 시스템 구현
- ✅ 서버에서 PillData 다운로드 기능 구현
- ✅ 프로그레스 바 UI 구현
- ✅ 실시간 다운로드 진행률 표시
- ✅ 데이터 검증 로그 추가
- ✅ API 응답 구조 호환성 처리
