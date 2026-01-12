# 이게뭐약

- AI를 활용한 알약 검색 애플리케이션

# Requirement

- node 20 이상
- JDK11

# 초기설정

```bash
# 전역 라이브러리 설치
yarn add -g yarn eas-cli

# 패키지 설치
yarn install

# eas server를 사용하기 위한 로그인
eas login

# 환경변수 다운로드
eas env:pull

# 앱 빌드, 실행 전 문제점 점검
npx expo-doctor

# 앱 빌드 준비
yarn run rebuild

# 실행 (안드로이드 | IOS)
yarn run android
yarn run ios
```

# 테스트

```bash
yarn test
```

# 개발

```bash
# 라이브러리 추가 (사용시 expo와 호환되는 라이브러리 버전 설치 없으면 자동으로 yarn add 진행)
npx expo install {library}

# 코드 검사
npx expo lint
```

# 로컬 환경 빌드

```bash
# eas credential 다운로드
eas credentials
# 선택 Android or Ios
# 선택 profile
# 선택 credentials.json: Upload/Download credentials ...
# 선택 Download credentials ...
# Go back and Exit

# apk build for dev (linux 혹은 macos 에서만 사용가능)
yarn apk
yarn ipa
```

# 트러블 슈팅

**대부분의 오류**

```bash
rm -rf android
rm -rf ios
rm -rf node_modules
yarn cache clean
yarn install
yarn run rebuild
```

**expo를 통해 설치하는 라이브러리의 버전이 낮을 경우**

- [Expo Docs](https://docs.expo.dev/) 해당 라이브러리를 검색

**expo의 라이브러리가 다른 라이브러리와 충돌일 경우**

- 충돌 라이브러리를 expo로 교체 또는 충돌 부분을 수정
- expo-doctor 또는 디버깅 후 충돌 부분(의존 관계 라이브러리)을 수정

**yarn run rebuild 또는 npx expo prebuild --clean 관련 에러**

- `Failed to delete android, ios code: ENOTEMPTY: directory not empty, rmdir`
- 명령 재시도

**eas 서버에서 빌드 중 yarn install 부분 Error: Couldn't allocate enough memory 발생**

- yarn fetch 중 nodejs에 설정된 메모리의 부족으로 인해 발생하는 문제 (일시적인 문제)
- yarn.lock이나 yarn cache에 관련된 수정이 발생한 이후 첫 빌드에서 발생 종종 발생 예정
- eas 서버로 다시 빌드 요청

# 참고

- [초기 설정 상세 문서](./docs/HOW_TO_SETTING.md)
- [빌드 방법 상세 문서](./docs/HOW_TO_BUILD.md)
