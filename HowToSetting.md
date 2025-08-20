[프로젝트 빌드 방법](./HowToBuild.md)

# 설정 변경시 네이티브 적용에 관련 설정 반영(recommend)

- expo development build 환경(expo go :x:)

```bash
yarn run rebuild
# npx expo prebuild --clean
```

# env

[EAS ENV Docs](https://docs.expo.dev/eas/environment-variables/)

#### Upload to EAS Servers

```bash
USAGE
  $ eas env:push [ENVIRONMENT] [--environment development|preview|production] [--path <value>]

ARGUMENTS
  ENVIRONMENT  Environment to push variables to. One of 'production', 'preview', or 'development'.

FLAGS
  --environment=(development|preview|production)...  Environment variable's environment
  --path=<value>                                     [default: .env.local] Path to the input `.env` file

DESCRIPTION
  push environment variables from .env file to the selected environment
```

#### Download env from EAS Servers

```bash
USAGE
  $ eas env:pull [ENVIRONMENT] [--non-interactive] [--environment development|preview|production] [--path
    <value>]

ARGUMENTS
  ENVIRONMENT  Environment to pull variables from. One of 'production', 'preview', or 'development'.

FLAGS
  --environment=(development|preview|production)  Environment variable's environment
  --non-interactive                               Run the command in non-interactive mode.
  --path=<value>                                  [default: .env.local] Path to the result `.env` file

DESCRIPTION
  pull environment variables for the selected environment to .env file
```

# app.json

[Expo app.json Props](https://docs.expo.dev/versions/latest/config/app/)

# EAS

## eas-cli

[eas-cli ref](https://github.com/expo/eas-cli/blob/main/packages/eas-cli/README.md)

## eas.json

[EAS eas.json Props](https://docs.expo.dev/eas/json/)

# credentials.json

- 기본적인 앱 서명에 관련된 설정 파일
  [참고 사이트](https://docs.expo.dev/app-signing/local-credentials/)

### Sync Credentials to EAS Servers

#### Upload

```bash
eas credentials
# 선택 Android or Ios
# 선택 profile
# 선택 credentials.json: Upload/Download credentials ...
# 선택 Upload credentials ...
# eas 서버에서 관리될 credentials 이름 설정
# Assign a name to your build credentials: ...
# Go back and Exit
```

#### Download

```bash
eas credentials
# 선택 Android or Ios
# 선택 profile
# 선택 credentials.json: Upload/Download credentials ...
# 선택 Download credentials ...
# credentials.json 및 ./credentials/android/keystore.jks 다운로드
# credentials.json의 keystore path도 자동으로 변경되어 있음
# Go back and Exit
```

# eslint and prettier

[How to use in expo](https://docs.expo.dev/guides/using-eslint/)
