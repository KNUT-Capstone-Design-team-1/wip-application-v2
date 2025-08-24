# 이게뭐약

- AI를 활용한 알약 검색 애플리케이션

# Requirement

- node 20 이상
- JDK11
- yarn / eas-cli
  ```bash
  npm install -g yarn eas-cli
  ```

# 초기설정

- [초기 설정 상세 문서](./docs/HOW_TO_SETTING.md)

```bash
# install library
yarn install

# development build setting
yarn run prebuild

# add env
eas login
eas env:pull
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

- [빌드 방법 상세 문서](./docs/HOW_TO_BUILD.md)

#### 공통

```bash
# eas server를 사용하기 위한 로그인
eas login

# 앱을 빌드할 수 있는 실제 네이티브(Android, iOS) 프로젝트를 생성 준비
yarn run rebuild
```

### use eas local build

```bash
# eas credential 다운로드
eas credentials
# 선택 Android or Ios
# 선택 profile
# 선택 credentials.json: Upload/Download credentials ...
# 선택 Download credentials ...
# credentials.json 및 ./credentials/android/keystore.jks 다운로드
# credentials.json의 keystore path도 자동으로 변경되어 있음
# Go back and Exit

# apk build for dev (linux 혹은 macos 에서만 사용가능)
yarn apk

# ipa build for deploy (linux 혹은 macos 에서만 사용가능)
yarn ios
```

# Development

#### Add new library

```bash
# recommend (사용시 expo와 호환되는 라이브러리 버전 설치 없으면 자동으로 yarn add 진행)
npx expo install {library}
# yarn add {library}
```

#### Check lint (문법 검사)

```bash
npx expo lint
```

# TroubleShooting

#### 만능

```bash
rm -rf android
rm -rf ios
rm -rf node_modules
yarn cache clean
yarn install
yarn run prebuild
# 이후 빌드 진행
```

#### 빌드 중 expo 모듈 관련 에러

[Expo Docs](https://docs.expo.dev/)

- Expo 라이브러리는 기본적으로 expo관련 모듈(라이브러리)들을 가지고 있음
- expo관련 모듈의 버전이 낮을 경우
  - [Docs](https://docs.expo.dev/)사이트에 검색, 설치, 설정 진행
- 다른 라이브러리와 충돌일 경우
  - 충돌 라이브러리를 expo로 교체 또는 충돌 부분을 수정
- 충돌 부분 수정 방법
  - expo-doctor 또는 디버깅 후 충돌 부분(의존 관계 라이브러리)을 수정

#### yarn run rebuild 또는 npx expo prebuild --clean 관련 에러

- `Failed to delete android, ios code: ENOTEMPTY: directory not empty, rmdir`
- 한번 더 실행 시 해결됨

#### eas 서버에서 빌드 중 yarn install 부분 Error: Couldn't allocate enough memory 발생

- yarn fetch 중 nodejs에 설정된 메모리의 부족으로 인해 발생하는 문제
- yarn.lock이나 yarn cache에 관련된 수정이 발생한 이후 첫 빌드에서 발생 종종 발생 예정
- eas 서버로 한번 더 build 요청 시 문제 해결됨
