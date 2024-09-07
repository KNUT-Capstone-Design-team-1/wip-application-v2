# wip-application-v2

- 알약 촬영 검색 애플리케이션 이게뭐약

# Install Library

```bash
npm install
```

# environment

- /env/.env.development
- /env/.env.production

```
API_URL="API 주소"
# 예시: API_URL=http://localhost:5000
```

# Requirement

- /env/config.json

```json
{
  "resource": {
    "aesKey": "",
    "aesIv": ""
  },
  "googleCloud": {
    "initInfoURL": "",
    "deeplearningServerURL": ""
  }
}
```

- /env/google_cloud_service_key.json

```json
{
  "type": "",
  "project_id": "",
  "private_key_id": "",
  "private_key": "",
  "client_email": "",
  "client_id": "",
  "auth_uri": "",
  "token_uri": "",
  "auth_provider_x509_cert_url": "",
  "client_x509_cert_url": "",
  "universe_domain": ""
}
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
