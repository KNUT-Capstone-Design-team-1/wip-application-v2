# wip-application-v2 실행 및 빌드 방법

## 1. Git 클론

```bash
git clone https://github.com/KNUT-Capstone-Design-team-1/wip-application-v2.git
```

## 2. 패키지 설치

```bash
npm install
```

## 3. 환경변수 파일

1. 프로젝트 최상단에 `env`폴더 생성
2. `env`폴더에 `.env.development` , `.env.production`파일 생성
3. 각 파일 내용에 아래 코드를 환경에 맞게 작성
   ```
   API_URL="API 주소"
   # 예시: API_URL=http://localhost:5000
   ```

## 4. 앱 실행

`npx react-native doctor` 명령어를 사용해 앱을 실행하는데 문제가 없는지 확인 가능.

### - 안드로이드

개발 환경 실행

```bash
npm run android:dev
```

프로덕션 환경 실행

```bash
npm run android:prod
```

### - IOS

개발 환경 실행

```bash
npm run ios:dev
```

프로덕션 환경 실행

```bash
npm run ios:prod
```

## 5. 앱 빌드

1. **keystore** 파일 추가
2. 경로: `wip-application-v2/android/app`

**APK** 파일 생성
생성위치: `wip-application-v2/android/app/build/outputs/apk`

```bash
npm run apk
```

**AAB** 파일 생성
생성위치: `wip-application-v2/android/app/build/outputs/bundle`

```bash
npm run aab
```
