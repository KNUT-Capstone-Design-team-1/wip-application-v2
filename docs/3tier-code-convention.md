# 🚀 React + Zustand 코딩 컨벤션 (3-Tier Architecture)

## 📌 핵심 아키텍처 개요

우리 프로젝트는 컴포넌트와 전역 상태(Zustand Store)의 직접적인 결합을 피하고, 중간에 **커스텀 훅(Custom Hook)** 계층을 두어 비즈니스 로직과 UI를 완벽히 분리합니다.

렌더링 성능 최적화와 CQRS(명령과 조회의 분리) 패턴 유지를 최우선 목표로 합니다.

- **Dumb Store:** 순수 데이터와 단순 Setter만 존재 (비즈니스 로직 ❌)
- **Smart Hook:** API 통신, 에러 처리, 생명주기 등 통제 (컨트롤러 역할)
- **Pure Component:** 데이터 출력 및 사용자 이벤트 발생 (렌더링 뷰 역할)

---

## Part 1. 컴포넌트 ↔ Zustand Store State (데이터 구독 규칙)

데이터(State)를 읽어올 때는 렌더링 최적화와 라이브러리 교체에 대비하여 **'원자적(Atomic) 구독'**을 원칙으로 합니다.

### 📝 규칙 1-1. 상태는 필요한 자식 컴포넌트에서 직접 구독한다 (Prop Drilling 금지)

최상위 부모(Root) 컴포넌트가 모든 상태를 읽어서 자식에게 내려주면 '렌더링 폭포수'가 발생합니다. 부모는 레이아웃만 잡고, 상태는 해당 값을 화면에 그리는 맨 끝단 자식 컴포넌트가 직접 구독합니다.

### 📝 규칙 1-2. 원자적 직접 구독(Direct Subscription) 원칙

Store 파일 내부에 추상화된 범용 Selector 훅을 따로 생성하는 것을 금지합니다.
컴포넌트는 자신이 필요한 데이터 구조를 알고 명시적으로 상태를 콜백으로 선택하여 가져옵니다.

**❌ Bad (Store에 Selector Hook을 만들고 컴포넌트가 가져다 쓰는 형태)**

```javascript
// store 훅 파일
export const useSearchKeyword = () => useStore((state) => state.keyword);

// 컴포넌트
const keyword = useSearchKeyword();
```

**✅ Good (명시적 직접 구독 방식)**

```javascript
// 컴포넌트 내부에서 필요한 상태만 직접 콜백을 통해 구독
const keyword = useStore((state) => state.keyword);
```

---

## Part 2. 컴포넌트 ↔ Action Hook (비즈니스 로직 호출 규칙)

액션(Action) 훅은 렌더링 비용이 `0`이어야 합니다.

### 📝 규칙 2-1. 액션 훅 내부에서 상태 구독(렌더링 탑승) 철저히 배제

액션 훅 안에서 `useStore(state => ...)` 또는 `useShallow`를 사용하여 상태를 구독하면 안 됩니다. 특정 이벤트가 발생한 '순간'의 최신 상태가 필요하다면 `getState()`를 사용하거나 컴포넌트로부터 파라미터로 넘겨받습니다.

**❌ Bad (상태 변경 시 액션 훅 리렌더링 유발)**

```javascript
export const useSearchActions = () => {
  const keyword = useStore((state) => state.keyword);
  const handleSearch = () => executeSearch(keyword);
  return { handleSearch };
};
```

**✅ Good (`getState` 활용으로 렌더링 비용 0)**

```javascript
export const useSearchActions = () => {
  const executeSearch = useStore((state) => state.executeSearch);
  const handleSearch = useCallback(() => {
    const currentKeyword = useStore.getState().keyword; // 1회성 최신 상태 조회
    executeSearch(currentKeyword);
  }, [executeSearch]);
  return { handleSearch };
};
```

### 📝 규칙 2-2. 액션 훅의 배치: 오케스트레이션 vs 자율성

- **메인 비즈니스 액션 (결제, 최종 폼 제출):** 최상위 부모(Root)에서 훅을 호출하여 자식에게 Props로 넘겨줍니다. (데이터 흐름 중앙 통제)
- **도메인 특화 서브 액션 (좋아요, 단일 삭제, 트래킹):** 부모를 거치지 않고, 해당 이벤트가 발생하는 하위 자식 컴포넌트에서 직접 훅을 Import 하여 사용합니다.

---

## Part 3. Action Hook ↔ Zustand Store Functions (액션 조립 규칙)

Store의 순수 액션을 커스텀 훅이 가져와 비즈니스 로직으로 조립(가공)할 때 지켜야 할 규칙입니다.

### 📝 규칙 3-1. 래퍼(Wrapper) 함수는 무조건 `useCallback`으로 고정한다

Action Hook에서 새로운 함수를 만들어 반환할 때는, 렌더링 시 함수 참조(메모리 주소)가 변경되는 것을 막기 위해 반드시 `useCallback`으로 감싸야 합니다.

**✅ Good**

```javascript
export const useSearchActions = () => {
  const executeSearch = useStore((state) => state.executeSearch);
  const onSubmit = useCallback(() => {
    executeSearch();
  }, [executeSearch]); // 원본 함수는 주소가 변하지 않으므로 안전함
  return { onSubmit };
};
```

### 📝 규칙 3-2. Store의 함수를 런타임에 덮어씌우지 않는다

Zustand 내부의 함수(Action)를 컴포넌트 생명주기 도중 `set({ func: newFunc })` 형태로 통째로 덮어씌우는 것은 렌더링 폭포수를 유발하므로 절대 금지합니다.

---

## Part 4. 🌟 로컬 상태(useState) 및 생명주기(useEffect) 관리 규칙

순수 액션(명령) 훅과 상태/생명주기를 가진 훅은 철저히 분리하여 렌더링 최적화를 방어합니다.

### 📝 규칙 4-1. 액션 훅의 순수성 보장 (상태 통합 금지)

`useOOOActions` 훅 내부에는 **`useState`나 `useEffect`를 절대 배치하지 않습니다.** 이를 어기고 로컬 상태를 액션 훅에 섞어 Root 컴포넌트에서 호출할 경우, 해당 로컬 상태가 변할 때마다 Root 전체가 강제 리렌더링됩니다.

### 📝 규칙 4-2. 로컬 상태의 응집 (UI 내부 격리)

인풋 텍스트, 모달 열림 상태 등 특정 UI에 종속적인 상태는 Root로 끌어올리지 말고 **해당 UI를 그리는 자식 컴포넌트 내부**에 둡니다. (필요 시 자식 전용 UI 훅 `useSearchInputState` 등으로 분리)

**✅ Good (UI 상태는 자식이 스스로 관리)**

```javascript
const SearchInput = () => {
  const [localText, setLocalText] = useState(''); // 로컬 상태는 컴포넌트 내부에 응집
  const { handleSearch } = useSearchActions(); // 액션 훅은 별도로 Import

  return <TextInput onSubmit="{()" value="{localText}"> handleSearch()} />
};

```

### 📝 규칙 4-3. Root 레벨 생명주기 통제는 'Init Hook'으로 분리

Feature 진입 시 최초 1회 API를 호출하는 등 Root 컴포넌트 레벨에서의 `useEffect`가 필요하다면, 상태 반환이 없고 오직 마운트/언마운트 사이클만 관리하는 초기화 전용 훅(`useOOOInit`)을 별도로 만들어 사용합니다.

**✅ Good**

```javascript
// 생명주기만 전담하는 훅 (상태 반환 없음)
export const useFeatureInit = () => {
  const { loadInitialData } = useFeatureActions();
  useEffect(() => {
    loadInitialData();
  }, []);
};

// Root 컴포넌트
const FeatureRoot = () => {
  useFeatureInit(); // 부모는 상태 변화 없이 생명주기만 실행됨
  return <View> ... </View>;
};
```

### 📝 규칙 4-4. 다수 공유되는 로컬 상태는 Zustand로 격상

만약 `useState`로 만든 상태를 2~3개 이상의 자식이나 액션 로직에서 공통으로 써야 해서 Root로 끌어올리려는 충동이 든다면, 그것은 더 이상 로컬 상태가 아닙니다. 억지로 Prop Drilling을 하지 말고 **즉시 Zustand Store 내부 상태로 격상**시킨 후 규칙 1-1에 따라 개별 구독합니다.
