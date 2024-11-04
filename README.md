# wip-application-v2

- 알약 촬영 검색 애플리케이션 이게뭐약

# Install Library

```bash
npm install
```

# Requirement

- /env/.env

```bash
REALM_ENCRYPTION_KEY=""

GOOGLE_CLOUD_RSA_PUB_KEY=""
GOOGLE_CLOUD_INIT_INFO_URL=""
GOOGLE_CLOUD_DL_SERVER_URL=""

CLOUD_FLARE_RESOURCE_DOWNLOAD_URL=""
CLOUD_FLARE_RESOURCE_BUCKET=""
CLOUD_FLARE_TOKEN_VALUE=""
CLOUD_FLARE_ACCESS_KEY_ID=""
CLOUD_FLARE_SECRET_ACCESS_KEY=""

GET_DRUG_PRDT_PRMSN_DTL_INQ=""
DRUG_PRDT_PRMSN_INFO_SERVICE=""
PERM_ENC_SERVICE_KEY=""
PERM_DEC_SERVICE_KEY=""
```

# Execution

```bash
# 앱 실행 전 문제점 점검
npx react-native doctor

# 안드로이드 개발 환경 실행
npm run android:dev

# 안드로이드 프로덕션 환경 실행
npm run android:prod

# IOS 개발 환경 실행
npm run ios:dev

# IOS 프로덕션 환경 실행
npm run ios:prod
```

# Build

- `/android/app` 경로에 **keystore (.jks)** 파일 추가 후 빌드 진행

```bash
# APK 파일 생성 (/android/app/build/outputs/apk)
npm run apk

# AAB 파일 생성 (/android/app/build/outputs/bundle)
npm run aab
```
