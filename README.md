# wip-application-v2

- 알약 촬영 검색 애플리케이션 이게뭐약

# Install Library

```bash
npm install
```

# Requirement

- /env/.env

```bash
REALM_ENCRYPTION_KEY="realm 데이터베이스 암호화 키"

GOOGLE_CLOUD_RSA_PUB_KEY="구글 클라우드 플랫폼 서버리스 토큰 암호화 키"
GOOGLE_CLOUD_INIT_INFO_URL="구글 클라우드 플랫폼 init-info API URL"
GOOGLE_CLOUD_DL_SERVER_URL="구글 클라우드 플랫폼 image-search API URL"
GOOGLE_CLOUD_DRUG_DETAIL_URL="구글 클라우드 플랫폼 drug-detail API URL"

CLOUD_FLARE_RESOURCE_DOWNLOAD_URL="클라우드 플레어 리소스 스토리지 URL"
CLOUD_FLARE_RESOURCE_BUCKET="클라우드 플레어 리소스 버킷 이름"
CLOUD_FLARE_TOKEN_VALUE="클라우드 플레어 R2 토큰"
CLOUD_FLARE_ACCESS_KEY_ID="클라우드 플레어 R2 액세스 키 아이디"
CLOUD_FLARE_SECRET_ACCESS_KEY="클라우드 플레어 R2 액세스 키"
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
