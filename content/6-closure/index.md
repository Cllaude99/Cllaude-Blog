---
emoji: ☕️
title: 'Closure 알아보기'
date: '2025-03-25'
categories: featured-Dev
---

<img src="js.webp" alt="js" width="100%" />

평소처럼 velog의 트렌딩 글 목록들을 보던 중, React의 useState와 관련된 글을 보았다. 해당 글에서는 ReactHooks, ReactFiberHooks 등의 코드를 통해 useState의 내부 동작을 설명하고 있었으며 useState가 클로저로 구현되어 있음을 설명하고 있었다.

> 나는 이 글을 보며 useState를 사용하며 코드를 짰던 지난 과정이 부끄러워 졌다.

그 이유는 closure의 개념이 useState에 어떻게 적용되어 있는지도 모른채 useState를 사용하고 있었기 때문이다. (내가 작성한 코드에 대해 나도 잘 모르고, 이에 대해 설명할 수 없다는 것은 정말 부끄러운 일인 것 같다 ㅠㅠ)

> 따라서 이를 계기로 JavaScript에 대해서 딥다이브 해보는 시간을 가져보고자 했다.

이 글은 나를 JavaScript 딥다이브의 계기로 이끌어준 첫 번째 글로 `closure`에 대해 나름대로 찾아보고 정리해보았다.

## closure란?

[MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Closures)에서는 클로저를 다음과 같이 설명하고 있다.

> `Closure`는 함수와 그 함수가 선언된 렉시컬 컨텍스트(Lexical Context)의 조합을 말한다.

그렇다면 위에서 말하는 렉시컬 컨텍스트(Lexical Context)는 무엇일까?

이를 알기 위해 스코프와 렉시컬 스코프에 대해서 간단하게 알아보자.

먼저 `스코프`란 변수에 접근할 수 있는 범위를 의미하며 JavaScript에서는 전역 스코프와 지역 스코프가 존재한다.

그렇다면 `렉시컬 스코프`란 무엇일까? 아래의 예시 코드를 통해 확인해보자.

```javascript
var x = 1;

function foo() {
  var x = 10;
  bar();
}

function bar() {
  console.log(x);
}

foo(); // 1
bar(); // 1
```

위 예시에서 `bar` 함수는 전역에 선언되었기 때문에, foo 함수 내부에서 호출되더라도 전역 변수 x를 참조하게 된다. 이것이 바로 렉시컬 스코프의 특징이다.

즉 `렉시컬 스코프`란 함수를 어디에 '선언'했는지에 따라 상위 스코프가 결정되는 것을 말하며 이를 정적 스코프라고도 부른다.

참고로 자바스크립트의 모든 함수는 [[Environment]]라 불리는 숨김 프로퍼티를 갖으며 여기에 렉시컬 스코프에 대한 참조값이 저장된다고 한다.

따라서 함수 본문에서 [[Environment]]를 사용해서 외부 함수의 변수에도 접근할 수 있다.

> 그렇다면 이제 다시 클로저에 대해 알아보자.

아래는 `모던 자바스크립트 딥다이브`에서 참고해온 예시이다.

```javascript
function outerFunc() {
  var x = 10;

  var innerFunc = function () {
    console.log(x);
  };

  return innerFunc;
}

var inner = outerFunc();
inner(); // 10
```

위 코드에서 outerFunc함수는 내부 함수 innerFunc를 반환하고 콜스택에서 제거가 되었기 때문에 생명 주기가 끝난 상태이다.
따라서 outerFunc가 호출된 후에는 내부 변수 x도 유효하지 않을 것이라고 생각할 수 있다.

> 하지만 결과는 그렇지 않다.

위 코드 마지막에 `inner()`를 통해 inner 함수를 호출하면 outerFunc함수안에 있는 내부 함수인 innerFunc가 실행된다.
이때, innerFunc는 선언된 당시의 환경을 기억하고 있고 그 결과 변수 x의 값인 10이 출력된다.

이와 같이 생명 주기가 끝난 외부 함수의 변수에 접근할 수 있는 함수를 `클로저`라고 한다.

> 그렇다면 클로저는 왜 사용되는 것일까?

아래와 같은 이유로 클로저를 사용할 수 있다.

- 데이터 은닉과 캡슐화
- 상태 유지
- 비동기 처리

### 1️⃣ 데이터 은닉과 캡슐화

자바스크립트에는 private 키워드가 없기 때문에, 변수를 외부에서 직접 접근하지 못하게 보호하려면 클로저를 활용해야 한다. 아래의 예시를 통해 클로저를 사용하여 외부에서 직접 변경할 수 없는 카운터를 만드는 코드를 확인해보자.

```javascript
function createCounter() {
  let count = 0; // 외부에서 접근할 수 없는 변수

  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1
```

여기서 count는 외부에서 접근할 수 없고 increment()와 decrement() 함수만이 count를 조작할 수 있다. 따라서 데이터를 안전하게 보호할 수 있다.

### 2️⃣ 상태 유지

클로저는 함수가 실행된 이후에도 외부 함수의 변수 상태를 기억한다.
이 말은 곧, 클로저를 이용하면 함수 호출 간에 상태를 유지할 수 있다는 뜻이다.

이 또한 예시 코드를 통해 살펴보자.
아래는 클로저를 이용해 상태를 유지하는 예시이다.

```javascript
function makeAdder(x) {
  return function (y) {
    return x + y;
  };
}

const add5 = makeAdder(5);
const add10 = makeAdder(10);

console.log(add5(2)); // 7
console.log(add10(2)); // 12
```

위의 makeAdder는 함수를 반환한다. 반환된 함수는 x 값을 기억하고 있어서, 각각 5 또는 10을 더하는 새로운 함수가 된다. 즉 클로저를 사용하여 이전의 x의 상태를 기억하고 있는 것이다.

### 3️⃣ 비동기 처리

클로저는 자바스크립트에서 비동기 처리에서도 사용된다. 예를 들어 setTimeout, 이벤트 핸들러, 프로미스 등에서 반복문 안의 변수를 기억해야 할 때, 클로저가 꼭 필요하다.

```javascript
for (var i = 0; i < 3; i++) {
  (function (j) {
    setTimeout(() => {
      console.log(j);
    }, 1000);
  })(i);
}
```

위 코드에서는 i 값이 클로저로 캡처되어, 1초 후 0, 1, 2가 순서대로 출력된다. 만약 클로저를 사용하지 않으면 3, 3, 3이 출력될 수 있다.

즉, 클로저를 사용하면 위와 같이 변수에 대한 캡슐화를 통해 외부에서 직접 해당 변수에 접근할 수 없게하여 보호할 수 있으며, 함수 호출이 종료된 후에도 변수를 유지할 수 있고, 비동기 처리에서 반복문 안의 변수를 기억해야 할 때에도 사용할 수 있다.

> 위의 내용들로 봐서는 클로저는 그저 좋아보이기만 하는데 단점은 혹시 없을까?

클로저를 사용할때에는 `메모리 누수`를 주의해야한다.

> 왜 메모리 누수를 주의해야 할까?

그 이유는 위에서 외부함수의 종료이후에도 변수에 접근할 수 있었던 상황에서 확인할 수 있다.

자바스크립트에서는 함수 실행이 끝나면, 그 함수의 변수들은 스코프를 벗어나면서 가비지 콜렉터에 의해 자동으로 메모리에서 해제된다.

하지만 클로저는 함수가 종료된 이후에도 외부 변수에 접근하고 있기 때문에,
해당 변수들이 계속해서 메모리에 남아 있게 된다.

따라서 메모리에서 해제되지 않고 계속 유지되어 메모리 누수가 발생할 수 있다는 단점이 존재한다.

아래의 코드를 통해 다시 한 번 이해해보자.

```javascript
function outer() {
  let largeData = new Array(1000000).fill('*'); // 큰 데이터

  return function inner() {
    console.log(largeData[0]); // 클로저로 인해 largeData가 참조됨
  };
}

const retained = outer(); // outer는 종료됐지만 largeData는 메모리에 유지됨
```

위 코드에서 largeData는 inner 함수가 참조하고 있기 때문에,
outer 함수의 실행이 끝났더라도 메모리에서 해제되지 않고 계속 유지된다.

이처럼 필요 이상으로 클로저가 많은 데이터를 참조하게 되면 메모리 낭비로 이어질 수 있으므로 주의해야 한다.

> 그렇다면 메모리 누수 문제를 이를 어떻게 해결해줄 수 있을까?

필요하지 않은 참조를 끊어서 해결해 줄 수 있다.

즉, 클로저가 참조하고 있는 변수를 null로 초기화하면, 가비지 콜렉터는 이를 메모리 해제 대상으로 보고 해제할 수 있게 된다.

### 자, 그렇다면 이제 클로저가 useState에서 어떻게 사용되는지에 대해 알아보자

useState는 React의 훅으로 상태관리를 위해 사용된다.

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

위 코드와 같이 useState는 상태인 count와 그 값을 변경시킬 수 있는 함수를 배열의 형태로 반환한다.

위의 코드를 실행해보면 버튼을 클릭할때마다 count값이 계속 증가하게 된다.
일반적으로 상태가 변하면 컴포넌트는 리렌더링된다고 알고 있다.

그렇다면 위에서 버튼을 클릭할때마다 setCount함수에 의해 count의 값이 변경되고, 값이 변경됨에따라 컴포넌트가 리렌더링이되는데 왜 count의 값은 0으로 매번 초기화되는 것이 아닌 이전 값을 계속 기억할 수 있는 것일까?

> 이에 대한 답은 클로저에 있다.

즉, 위 코드에서 useState(0)는 값의 변경에 따라 매번 초기화될 것처럼 보이지만, 실제로는 그렇지 않다. 그 이유는 useState 내부에서 외부 상태 저장소에 접근하는 클로저가 만들어지기 때문이다.

만약 useState가 아래와 같이 만들어졌다면 어떻게 되었을까?

```javascript
function useState(initialValue) {
  let _val = initialValue;

  function setState(newValue) {
    _val = newValue;
  }

  return [_val, setState];
}
```

위 구조에서는 컴포넌트가 다시 호출되면 \_val도 초기화되고 이전의 값을 기억하지 못하게 되었을 것이다.

하지만 실제 useState는 아래와 같이 구현되어 있다.
(실제 useState의 코드를 모두 구현할 수는 없겠지만 클로저의 개념을 사용하여 useState의 코드를 흉내내보면 아래의 코드와 같을 것이다.)

```javascript
let stateStore = []; // 모든 상태 값들을 저장하는 전역 배열
let cursor = 0; //  현재 useState가 몇 번째 호출되는지 추적하는 인덱스

function useState(initialValue) {
  const currentIndex = cursor;

  if (stateStore[currentIndex] === undefined) {
    stateStore[currentIndex] = initialValue;
  }

  const setState = (newValue) => {
    stateStore[currentIndex] = newValue;
    render(); // 임의로 만든 리렌더 함수
  };

  const state = stateStore[currentIndex];
  cursor++;
  return [state, setState];
}

function render() {
  cursor = 0;
  App();
}

function App() {
  const [count, setCount] = useState(0);
  console.log('count:', count);

  setTimeout(() => {
    setCount(count + 1); /
  }, 1000);
}

App();
```

위 코드에서는 클로저를 통해 상태를 유지하고 있다.

외부 상태 저장소인 stateStore[]에 모든 상태값을 저장하며 이 값은 컴포넌트 내부가 아닌, 외부 배열에 저장하고 있다. 따라서 컴포넌트가 다시 호출되어도 상태가 사라지지 않는 것이다.

또한, setState는 currentIndex 값을 기억하고 있다. 이 덕분에 정확히 "어느 위치의 상태를 바꿔야 할지" 알고 있는 것이다.

즉, 상태가 변경되어 리렌더링 될때 함수형 컴포넌트는 매번 다시 실행되는데,
그럼에도 불구하고 상태가 유지되는 이유는 외부 저장소와 클로저 덕분이다.
그리고 이러한 구조는 React의 Fiber 아키텍처와 매우 밀접한 관련이 있다고 한다.

Fiber에 대해서도 정말 조금만 알아보자면, Fiber는 React가 16버전부터 도입한 아키텍처라고 한다.

Fiber는 각 컴포넌트의 상태와 정보를 담은 트리 구조이며, 각 함수형 컴포넌트는 렌더링 시점마다 Fiber 노드가 생성되고, 여기에 memoizedState 라는 필드가 생긴다. 이 필드는 useState 등의 Hook 상태 값들이 연결된 단일 연결 리스트이다.

즉, React는 컴포넌트가 렌더링될 때 useState를 호출하면
현재 Fiber에서 해당 위치의 Hook을 꺼내 상태를 읽고, 클로저를 통해 상태를 변경할 수 있게 한다고한다.

Fiber.memoizedState에 Hook 정보를 저장하고 setState는 클로저로 이 값을 참조하며 이후 변경이 생기면 다시 렌더링되며, Hook 리스트가 업데이트 되는 것이다.

Fiber의 개념은 아직 너무 어려워서 아래의 글들을 참고해보았다. (나중에 다시 한번 참고해보면 좋을 것 같다!)

- [React Fiber 아키텍처 분석](https://d2.naver.com/helloworld/2690975)
- [React 공식 문서](https://github.com/facebook/react/)
- [Virtual DOM과 Internals](https://ko.legacy.reactjs.org/docs/faq-internals.html)
- [React가 0.016초마다 하는 일 (Feat. Fiber)](https://medium.com/stayfolio-tech/react%EA%B0%80-0-016%EC%B4%88%EB%A7%88%EB%8B%A4-%ED%95%98%EB%8A%94-%EC%9D%BC-feat-fiber-1b9c3839675a)

<br/>

하나의 글을 보고 이렇게 깊게까지 찾아본 적은 처음인 것 같다. 가볍게 velog를 보고 있었는데, 우연치 않게 useState가 클로저로 구현되어 있다는 글을 보고 클로저에 대해서 찾아보고 실제 useState의 코드는 아니지만 클로저의 개념을 적용하여 코드로 흉내내보는 과정을 통해 깊게 이해할 수 있었다.

🎯 참고로 이러한 클로저는 자바스크립트만의 특징이 아니라 Python, Kotlin, Swift 등등 1급 함수를 지원하는 언어에서 사용할 수 있다.(1급 함수는 함수를 변수에 할당 할 수 있고, 인자로 전달하거나 반환할 수 있는 함수를 말한다.)

🎯 클래스도 클로저라고 볼 수 있을까?

나는 클래스는 클로저라고 볼 수 없다고 생각한다. 그 이유는 클로저는 함수가 외부 스코프의 변수에 접근할 수 있을 때 생성되는 개념인데,클래스는 자기 자신(this)의 참조이기 때문에 외부 스코프와는 관계가 없다고 생각하기 때문이다.
