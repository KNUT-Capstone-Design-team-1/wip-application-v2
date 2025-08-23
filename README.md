# 이게뭐약

- AI를 활용한 알약 검색 애플리케이션

# Requirement

- node 20 이상
- JDK11
- eas-cli (npm install -g eas-cli)
- (ios) ruby 2.7.6 이상
- (ios) cocoapods 1.13 이상 1.15 미만
- (ios) activesupport 6.1.7.5 이상 7.1.0 미만

# 초기설정

#### install library

```bash
yarn install
```

#### development build setting

```bash
# npx expo prebuild와 동일
yarn run prebuild
```

#### add env

- .env.local을 root에 다운로드
  - 배포된 파일을 다운로드 또는 [EAS 활용](./HowToSetting.md#download-env-from-eas-servers)

```bash
eas login
eas env:pull
```

#### add new library

```bash
# recommend
npx expo install {library}
# yarn add {library}
```

- **npx expo install** 사용시 expo와 호환되는 라이브러리 버전 설치 없으면 자동으로 yarn add 진행

# Configure

- [EAS를 활용한 ENV 다운로드 방법](./HowToSetting.md#download-env-from-eas-servers)
- .env.local

```bash
EXPO_PUBLIC_REALM_ENCRYPTION_KEY="realm 데이터베이스 암호화 키"

EXPO_PUBLIC_GOOGLE_CLOUD_RSA_PUB_KEY="구글 클라우드 플랫폼 서버리스 토큰 암호화 키"
EXPO_PUBLIC_GOOGLE_CLOUD_INIT_INFO_URL="구글 클라우드 플랫폼 init-info API URL"
EXPO_PUBLIC_GOOGLE_CLOUD_DL_SERVER_URL="구글 클라우드 플랫폼 image-search API URL"
EXPO_PUBLIC_GOOGLE_CLOUD_DRUG_DETAIL_URL="구글 클라우드 플랫폼 drug-detail API URL"

EXPO_PUBLIC_CLOUD_FLARE_RESOURCE_DOWNLOAD_URL="클라우드 플레어 리소스 스토리지 URL"
EXPO_PUBLIC_CLOUD_FLARE_RESOURCE_BUCKET="클라우드 플레어 리소스 버킷 이름"
EXPO_PUBLIC_CLOUD_FLARE_TOKEN_VALUE="클라우드 플레어 R2 토큰"
EXPO_PUBLIC_CLOUD_FLARE_ACCESS_KEY_ID="클라우드 플레어 R2 액세스 키 아이디"
EXPO_PUBLIC_CLOUD_FLARE_SECRET_ACCESS_KEY="클라우드 플레어 R2 액세스 키"
```

# Execution

```bash
# 앱 빌드, 실행 전 문제점 점검
npx expo-doctor

# 안드로이드  실행
yarn run android

# IOS 실행
yarn run ios
```

# Build

[How to build](./HowToBuild.md)

```

```

# Reset Cache

- 에뮬레이터 종료 후 실행할 것

```bash
# 안드로이드 빌드 캐시 제거
yarn reset:android

# iOS 빌드 캐시 제거
yarn reset:ios
```

# TroubleShooting

## 만능

```bash
rm -rf android
rm -rf ios
rm -rf node_modules
yarn cache clean
yarn install
yarn run prebuild
# 이후 빌드 진행
```

## 빌드 중 expo 모듈 관련 에러

[Expo Docs](https://docs.expo.dev/)

- Expo 라이브러리는 기본적으로 expo관련 모듈(라이브러리)들을 가지고 있음
- expo관련 모듈의 버전이 낮을 경우
  - [Docs](https://docs.expo.dev/)사이트에 검색, 설치, 설정 진행
- 다른 라이브러리와 충돌일 경우
  - 충돌 라이브러리를 expo로 교체 또는 충돌 부분을 수정
- 충돌 부분 수정 방법
  - expo-doctor 또는 디버깅 후 충돌 부분(의존 관계 라이브러리)을 수정

## yarn run rebuild 또는 npx expo prebuild --clean 관련 에러

### Failed to delete android, ios code: ENOTEMPTY: directory not empty, rmdir

- 한번 더 실행 시 해결됨

## eas 서버에서 빌드 중 yarn install 부분 Error: Couldn't allocate enough memory 발생

- yarn fetch 중 nodejs에 설정된 메모리의 부족으로 인해 발생하는 문제
- yarn.lock이나 yarn cache에 관련된 수정이 발생한 이후 첫 빌드에서 발생 종종 발생 예정
- eas 서버로 한번 더 build 요청 시 문제 해결됨
