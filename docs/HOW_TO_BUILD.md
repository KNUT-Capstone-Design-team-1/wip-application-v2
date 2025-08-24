[프로젝트 설정 방법](./HOW_TO_SETTING.md)

# When add new library(recommend)

- expo development build 환경(expo go :x:)에서 순수 자바스크립트 라이브러리를 제외한 모든 라이브러리는 네이티브 관련 설정이 필요(ex. autolinking, pod install 등)

```bash
yarn run rebuild
# npx expo prebuild --clean
```

# EAS

- 빌드 설정은 eas.json [참고](./HOW_TO_SETTING.md#easjson)

### EAS 설치

```bash
yarn add -g eas-cli
```

### EAS login

```bash
eas login
```

## SERVER

### Development

```bash
eas build [-p, --platform android|ios|all] --profile development
```

### Preview

```bash
eas build [-p, --platform android|ios|all] --profile preview
```

### Product

```bash
eas build [-p, --platform android|ios|all] --profile production
```

## LOCAL

- 프로젝트 root에 **keystore (.jks)** 파일 및 **credentials.json** 파일 추가 또는 [eas 서버에서 다운](./HOW_TO_SETTING.md#sync-credentials-to-eas-servers)
- credentials.json에서 **keystore (.jks)** 파일 경로 수정 가능
- local 빌드시 os 환경별 tmp 디렉토리에서 빌드 진행(저장공간 용량 확인필수)

### Development

```bash
eas build --platform ${android | ios} --profile development --local
```

### Preview

```bash
eas build --platform ${android | ios} --profile preview --local
```

### Product

```bash
eas build --platform ${android | ios} --profile production --local
```
