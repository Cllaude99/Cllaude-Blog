---
emoji: 🐤
title: '상태가 변경됐을 때 리렌더링을 막으려면 어떻게 해야할까? (feat. useRef, useCallback, useMemo)'
date: '2025-06-07'
categories: featured-Dev
---

# 🤔 상태가 변경됐을 때 리렌더링을 막으려면 어떻게 해야할까?

> "React에서 상태가 변경될 때마다 리렌더링이 발생하는데, 이를 효과적으로 제어할 수 있는 방법은 무엇일까요?"

React 애플리케이션을 개발하다 보면 불필요한 리렌더링으로 인한 성능 저하 문제를 마주치게 됩니다. React는 이러한 문제를 해결하기 위해 `useRef`, `useCallback`, `useMemo`와 같은 훅들을 제공합니다. 이 글에서는 각 훅의 특징과 적절한 사용 시점에 대해 자세히 알아보겠습니다.

## 🪄 useRef로 리렌더링 없이 값 관리하기

`useRef`는 `{ current: value }` 형태의 **객체를 힙(Heap) 영역에 저장**하고, 컴포넌트가 리렌더링되더라도 동일한 참조값을 유지합니다. 이 객체는 React의 상태(state)처럼 변경 여부를 추적받지 않기 때문에, `.current` 값이 바뀌더라도 **객체의 참조는 그대로 유지되어 리렌더링이 발생하지 않습니다.**

React는 내부적으로 객체의 속성 값이 아닌 "참조값의 변경"만 감지하기 때문에, `useRef`를 통해 값만 바꾸는 것은 UI 업데이트와 무관하게 처리됩니다.

### 🌱 useRef와 가비지 컬렉션

이처럼 힙에 저장된 객체는 JavaScript의 가비지 컬렉터(GC)에 의해 관리되며, 더 이상 **도달 가능한 경로에서 참조되지 않을 때 제거 대상이 됩니다.** 대부분의 JS 엔진은 **Mark-and-Sweep 알고리즘**을 사용해, 루트 객체(window, 실행 컨텍스트 등)부터 연결된 객체들을 "mark"하고, mark되지 않은 객체는 "unreachable"로 판단하여 제거합니다.

`useRef` 객체는 컴포넌트가 마운트되어 있는 동안 React 내부에서 참조를 유지하고 있으므로 GC 대상이 아니지만, 컴포넌트가 언마운트되어 더 이상 참조되지 않게 되면, **이 객체는 mark되지 않고 sweep 단계에서 힙 메모리에서 제거됩니다.**

즉, Mark-and-Sweep 관점에서 보면, `useRef`는 컴포넌트가 살아 있는 동안 루트에서 도달 가능한 경로에 있기 때문에 "mark"되고 유지되며, 컴포넌트가 언마운트되어 해당 경로가 끊기는 순간 "unreachable" 상태로 판단되어 자동으로 정리됩니다. 이 구조 덕분에 `useRef`는 **렌더링과는 독립적으로 값이나 DOM 참조를 안전하게 유지**하면서도, **컴포넌트 생명주기 종료 시 메모리 누수 없이 제거되는 효과적인 방식**으로 작동합니다.

예를 들어, 버튼을 클릭할 때마다 카운트를 증가시키지만 화면에는 표시하고 싶지 않은 경우를 살펴보겠습니다.

```jsx
function Counter() {
  const count = useRef(0);
  const [renderCount, setRenderCount] = useState(0);

  const handleClick = () => {
    count.current += 1; // 리렌더링 발생하지 않음
    console.log('현재 카운트:', count.current);
  };

  const handleRender = () => {
    setRenderCount((prev) => prev + 1); // 리렌더링 발생
  };

  return (
    <div>
      <button onClick={handleClick}>카운트 증가 (렌더링 없음)</button>
      <button onClick={handleRender}>렌더링 발생</button>
      <p>렌더링 횟수: {renderCount}</p>
    </div>
  );
}
```

이 예시에서 `count.current`의 값이 변경되어도 컴포넌트는 리렌더링되지 않습니다. 반면 `setRenderCount`를 호출하면 상태가 변경되어 리렌더링이 발생합니다. 이를 통해 `useRef`가 어떻게 리렌더링 없이 값을 관리하는지 명확하게 확인할 수 있습니다. 콘솔을 통해 `count.current` 값이 증가하는 것은 확인할 수 있지만, 이 값의 변경은 화면 업데이트를 트리거하지 않습니다.

## 🧐 useCallback과 useMemo, 언제 사용해야 할까?

React 공식 문서([useCallback](https://react.dev/reference/react/useCallback#when-to-use-usecallback), [useMemo](https://react.dev/reference/react/useMemo#when-to-use-usememo))에 따르면, `useCallback`과 `useMemo`는 다음과 같은 특정 상황에서만 의미 있는 최적화를 제공합니다.

### 🌱 useCallback이 필요한 경우

1. **자식 컴포넌트가 React.memo로 최적화되어 있을 때**

   ```jsx
   function Parent() {
     const [count, setCount] = useState(0);

     const handleClick = useCallback(() => {
       // 복잡한 로직
     }, []); // 의존성 배열이 비어있으므로 항상 같은 함수 참조 유지

     return <MemoizedChild onClick={handleClick} />;
   }
   ```

   이 예시에서 `handleClick` 함수는 `useCallback`으로 메모이제이션되어 있고, 의존성 배열이 비어있기 때문에 컴포넌트가 리렌더링되어도 항상 동일한 함수 참조를 유지합니다. 이는 `React.memo`로 최적화된 자식 컴포넌트의 불필요한 리렌더링을 방지합니다. 만약 `useCallback`을 사용하지 않았다면, 부모 컴포넌트가 리렌더링될 때마다 새로운 함수가 생성되어 자식 컴포넌트도 함께 리렌더링될 것입니다.

2. **커스텀 훅에서 반환하는 콜백이 다른 훅의 의존성으로 사용될 때**

   ```jsx
   function useSearch() {
     const searchFn = useCallback((query) => {
       // 검색 로직
     }, []); // 의존성 배열이 비어있어 useEffect의 무한 루프 방지

     useEffect(() => {
       searchFn('초기 검색');
     }, [searchFn]);

     return searchFn;
   }
   ```

   이 커스텀 훅 예시에서 `searchFn`은 `useCallback`으로 메모이제이션되어 있어, `useEffect`의 의존성 배열에 안전하게 포함될 수 있습니다. 만약 `useCallback`을 사용하지 않았다면, 매 렌더링마다 새로운 함수가 생성되어 `useEffect`가 불필요하게 재실행되는 무한 루프가 발생할 수 있습니다. 이는 특히 커스텀 훅에서 함수를 반환할 때 자주 발생하는 패턴입니다.

### 🌱 useMemo가 효과적인 경우

1. **계산 비용이 매우 큰 연산을 캐싱할 때**

   ```jsx
   function SearchResults() {
     const [results, setResults] = useState([]);

     const sortedResults = useMemo(() => {
       // 복잡한 정렬 및 필터링 로직
       return results.sort().filter(/* ... */);
     }, [results]); // results가 변경될 때만 재계산

     return <List items={sortedResults} />;
   }
   ```

   이 예시에서 `sortedResults`는 `results` 배열이 변경될 때만 재계산됩니다. 정렬과 필터링 같은 무거운 연산을 매 렌더링마다 수행하는 대신, `useMemo`를 사용하여 필요할 때만 계산을 수행합니다. 이는 특히 데이터 처리 비용이 큰 경우 성능 향상에 도움이 됩니다.

2. **자식 컴포넌트의 props로 전달되는 객체를 메모이제이션할 때**

   ```jsx
   function ProductList() {
     const [products, setProducts] = useState([]);

     const sortConfig = useMemo(
       () => ({
         key: 'price',
         direction: 'ascending',
       }),
       []
     ); // 변경되지 않는 설정 객체

     return <SortableList items={products} config={sortConfig} />;
   }
   ```

   이 예시에서는 `sortConfig` 객체를 `useMemo`로 메모이제이션하고 있습니다. JavaScript에서 객체 리터럴은 매 렌더링마다 새로운 참조를 생성하므로, 이 객체를 props로 받는 자식 컴포넌트는 실제 내용이 변경되지 않았더라도 불필요하게 리렌더링될 수 있습니다. `useMemo`를 사용하면 객체의 참조가 유지되어 이러한 문제를 방지할 수 있습니다.

### 🚨 주의할 점

React 팀은 이러한 최적화 훅들을 "성능 최적화를 위한 도피처(escape hatch)"로 설명합니다. 즉, 모든 함수나 값에 무분별하게 적용하는 것은 오히려 성능을 저하시킬 수 있습니다. 다음과 같은 경우에는 사용을 피하는 것이 좋습니다

1. 단순한 계산이나 객체 생성
2. 자주 변경되는 의존성을 가진 경우
3. React.memo로 최적화되지 않은 컴포넌트에 전달되는 props

## 🙇🏻 마치며

지금까지 React의 리렌더링 최적화를 위한 세 가지 주요 훅에 대해 알아보았습니다.

- `useRef`는 리렌더링 없이 값을 관리하면서도 메모리 관리가 효율적입니다.
- `useCallback`과 `useMemo`는 특정 상황에서만 의미 있는 최적화를 제공하므로, 실제 성능 측정을 통해 필요한 경우에만 사용해야 합니다.

이러한 도구들은 분명 강력한 성능 최적화 수단이지만, "최적화를 위한 최적화"는 오히려 코드를 복잡하게 만들고 유지보수를 어렵게 만들 수 있다고 생각합니다. 성능 개선이 실제로 필요한 부분을 React DevTools의 Profiler나 Performance 탭을 통해 먼저 파악하고, 그 부분에 선별적으로 최적화를 적용하는 것이 더 현명한 접근 방법이라고 생각합니다.

## 참고 자료

- [React 공식 문서 - useCallback](https://react.dev/reference/react/useCallback)
- [React 공식 문서 - useMemo](https://react.dev/reference/react/useMemo)
- [React 공식 문서 - useRef](https://react.dev/reference/react/useRef)
