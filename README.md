# Introduction

AI를 활용한 알약 검색 애플리케이션입니다.

---

# Requirements

- Node.js `20+`
- `JDK 11`

---

# Initialize

프로젝트 최초 실행 시 필요한 설정입니다.

```bash
# EAS CLI 설치
npm install -g eas-cli

# 패키지 설치
yarn install

# EAS 로그인
eas login

# 환경 변수 다운로드
eas env:pull
```

## Credential 다운로드

```bash
eas credentials
```

이후 아래 순서대로 진행합니다.

1. `Android` 또는 `iOS` 선택
2. Profile 선택
3. `credentials.json: Upload/Download credentials ...` 선택
4. `Download credentials ...` 선택
5. `Go back` → `Exit`

---

# Execute & Build

앱 실행 및 개발 환경 검증 명령어입니다.

```bash
# Native 프로젝트 재생성
yarn rebuild

# Android 실행
yarn android

# iOS 실행
yarn ios

# Android APK 빌드
yarn apk

# iOS IPA 빌드
yarn ipa
```

> `apk`, `ipa` 빌드는 Linux 또는 macOS 환경에서만 사용 가능합니다.

---

# Development

개발 중 자주 사용하는 명령어입니다.

```bash
# Expo 호환 라이브러리 설치
npx expo install {library}

# 라이브러리 업데이트
npx expo install --fix

# 코드 검사
npx expo lint

# 프로젝트 상태 점검
npx expo-doctor

# API 테스트
yarn test:api

# Query 테스트
yarn test:query
```

> `expo install` 사용 시 Expo SDK 버전에 맞는 라이브러리 버전이 자동으로 설치됩니다.

---

# Trouble Shooting

## 프로젝트 초기화

빌드 또는 의존성 문제가 발생할 경우:

```bash
rm -rf android
rm -rf ios
rm -rf node_modules

yarn cache clean
yarn install
yarn rebuild
```

---

## Expo 라이브러리 버전이 낮은 경우

- Expo SDK와 호환되는 버전만 지원될 수 있습니다.

- 공식 문서에서 지원 버전을 확인하세요.

- [Expo Docs](https://docs.expo.dev/?utm_source=chatgpt.com)

---

## `yarn rebuild` 또는 `expo prebuild --clean` 에러

다음 오류가 발생할 수 있습니다.

```text
Failed to delete android, ios
code: ENOTEMPTY: directory not empty, rmdir
```

### 해결 방법

명령어를 다시 실행합니다.

```bash
yarn rebuild
```

또는

```bash
npx expo prebuild --clean
```

---

## EAS Build 중 메모리 부족 오류

다음 오류가 발생할 수 있습니다.

```text
Error: Couldn't allocate enough memory
```

### 원인

- `yarn fetch` 과정에서 Node.js 메모리 부족
- `yarn.lock` 또는 cache 변경 직후 첫 빌드에서 자주 발생

### 해결 방법

- EAS Build 재실행
- 잠시 후 다시 시도

---

# References

- [EAS Environment Variables Docs](https://docs.expo.dev/eas/environment-variables/?utm_source=chatgpt.com)
- [Expo app.json Props](https://docs.expo.dev/versions/latest/config/app/?utm_source=chatgpt.com)
- [EAS CLI README](https://github.com/expo/eas-cli/blob/main/packages/eas-cli/README.md?utm_source=chatgpt.com)
- [EAS eas.json Docs](https://docs.expo.dev/eas/json/?utm_source=chatgpt.com)
- [Expo Local Credentials Docs](https://docs.expo.dev/app-signing/local-credentials/?utm_source=chatgpt.com)
- [Expo ESLint Guide](https://docs.expo.dev/guides/using-eslint/?utm_source=chatgpt.com)
