---
emoji: 🕹️
title: '제어, 비제어 컴포넌트로 알아보는 React Hook Form'
date: '2025-03-29'
categories: featured-Dev
---

<img src="./react-hook-form.png" alt="react-hook-form" style="width: 100%;" /> <br/>

나는 react-hook-form 라이브러리를 통해 폼을 관리하고 있다.

라이브러리를 사용할때는 왜 해당 라이브러리를 선택했는지? 꼭 해당 라이브러리를 선택해야만 했는지? 등에 대해 고민해보고 사용해야한다고 생각한다.

이번 포스팅에서는 왜 react-hook-form 라이브러리를 사용했는지에 대해 설명해보고자 한다.

> 그 전에 먼저 제어, 비제어 컴포넌트에 대해 알아보자.

## 👉🏻 제어 컴포넌트

[공식문서](https://ko.legacy.reactjs.org/docs/forms.html#controlled-components)에서는 `제어 컴포넌트`를 아래와 같이 설명하고 있다.

```
HTML에서 <input>, <textarea>, <select>와 같은 폼 엘리먼트는 일반적으로 사용자의 입력을 기반으로 자신의 state를 관리하고 업데이트합니다.

React에서는 변경할 수 있는 state가 일반적으로 컴포넌트의 state 속성에 유지되며 setState()에 의해 업데이트됩니다.

우리는 React state를 “신뢰 가능한 단일 출처 (single source of truth)“로 만들어 두 요소를 결합할 수 있습니다.

그러면 폼을 렌더링하는 React 컴포넌트는 폼에 발생하는 사용자 입력값을 제어합니다.

이러한 방식으로 React에 의해 값이 제어되는 입력 폼 엘리먼트를 “제어 컴포넌트 (controlled component)“라고 합니다.
```

위의 설명을 정리해보면 `제어 컴포넌트`란 DOM이 아닌 React State로 사용자의 입력을 관리하는 컴포넌트라고 할 수 있다.

> 아래의 코드를 통해서 조금 더 알아보자

```javascript
import { useState, useEffect } from 'react';

export default function App() {
  const [input, setInput] = useState('');

  const onChange = (e) => {
    setInput(e.target.value);
  };

  return (
    <div className="App">
      <input onChange={onChange} value={input} />
    </div>
  );
}
```

위 코드는 input 요소에 사용자가 타이핑할 때마다 onChange 이벤트가 발생하고, 입력값이 상태로 저장된다. 이렇듯 `제어 컴포넌트`에서는 입력값의 변경이 곧바로 상태에 반영되므로 사용자가 입력한 값(화면에 보여지는 값)과 실제 데이터로 저장된 값이 항상 일치한다는 특징이 있다.

> 하지만 이러한 특징 때문에 주의할 점도 존재한다!

`제어 컴포넌트`에서는 사용자가 입력 필드에 값을 입력할 때마다 React의 state가 업데이트되고, 그에 따라 컴포넌트가 리렌더링된다.

예를 들어 사용자가 `input`요소에 계속해서 타이핑을 한다면, 키를 한 번 누를 때마다 state가 변경되고 그에 따른 리렌더링이 발생하게 된다.

이러한 리렌더링은 입력 필드가 많거나 렌더링 비용이 높은 컴포넌트에서는 성능 저하로 이어질 수 있어 주의가 필요하다.

특히 사용자의 입력값에 따라 API 요청이 이루어지는 구조라면, 입력할 때마다 매번 불필요한 네트워크 요청이 발생할 수 있다. (이 경우 디바운싱을 고려해보면 좋을 것 같다.)

## 👉🏻 비제어 컴포넌트

`비제어 컴포넌트`는 DOM 자체가 값을 관리한다.

즉, 사용자가 입력한 값을 state가 아닌 DOM에서 직접 가져오는 방식이다.

> 아래의 코드를 통해서 조금 더 알아보자

```javascript
import { useRef } from 'react';

export default function App() {
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`입력한 값: ${inputRef.current.value}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" ref={inputRef} />
      <button type="submit">제출</button>
    </form>
  );
}
```

위 코드에서는 input 요소에 ref를 연결하고, onSubmit 이벤트가 발생했을 때 inputRef.current.value를 통해 값을 가져온다. (상태를 전혀 사용하지 않고도 사용자 입력값을 다룰 수 있다.)

이러한 `비제어 컴포넌트`는 state로 값을 관리하지 않기 때문에 값이 업데이트될때마다 리렌더링이 되지 않아 성능상의 이점이 있다.(이러한 특징으로 인해 화면에 보여지는 값과 실제 데이터로 저장된 값이 일치하지 않을 수 있다.)

### 👉🏻 useRef가 리렌더링을 발생시키지 않는 이유...

여기서 잠깐!

<img src="./wait.gif" alt="wait" style="width: 100%;" /> <br/>

비제어 컴포넌트에서 useRef를 사용했을 때 왜 리렌더링되지 않았을까?

> 그 이유는 자바스크립트의 메모리 구조와 React의 렌더링 메커니즘을 이해하면 알 수 있다.

자바스크립트 환경에서 메모리는 크게 `Stack`과 `Heap` 두 가지로 나눌 수 있다.

`Stack`의 경우 함수 실행 컨텍스트, 기본형 변수가 저장되는 곳으로 숫자, 문자열 등이 저장되며, `Heap`의 경우 참조형 데이터가 저장되는 곳으로 객체, 배열, 함수, 그리고 useRef의 값이 저장된다. 즉, 객체처럼 참조형 데이터는 모두 Heap에 저장되고, 변수에는 그 데이터의 참조가 담긴다.

### 그럼 useRef는 어디에 값을 저장할까?

위에서도 살펴보았듯이 useRef는 `Heap 메모리`에 저장된다.

```javascript
const myRef = useRef(0);
```

위에서 useRef를 사용하면 myRef에는 { current: 0 }과 같은 참조형 객체가 저장된다.
이 객체는 Heap 메모리에 저장되며, React는 컴포넌트가 리렌더링되더라도 이 참조값을 그대로 유지합니다.

즉, useRef로 생성한 객체는 리렌더링이 발생해도 새롭게 만들어지지 않고,
항상 기존 Heap에 저장된 동일한 객체를 계속 바라보게 되는 것이다.

## 그래서 왜 리렌더링되지 않을까?

그 이유는 React의 렌더링 메커니즘과 밀접한 관련이 있다.

React는 useState로 관리되는 상태가 변경되면, 해당 컴포넌트를 다시 렌더링한다. 그 이유는 상태가 바뀔 때마다 React 내부에서 컴포넌트 함수를 다시 호출하도록 설계되어 있기 때문이다.

반면, `useRef.current = 값`처럼 `.current`의 값을 변경하는 것은
Heap 메모리에 저장된 객체의 속성만 바꾸는 것일 뿐, React 입장에서는 변화가 감지되지 않는다.

정리하자면, useRef로 얻는 값은 참조형 객체이고, `.current`를 통해 변경하는 건 그 객체의 속성 값만 바꾸는 것이지, 참조 자체를 바꾸는 게 아니기 때문에 React는 이를 감지하지 않고 리렌더링도 발생하지 않는것이다!

## 그렇다면 비제어 컴포넌트를 사용하는 게 더 좋은 걸까?

<img src="./choose.gif" alt="choose" style="width: 100%;" /> <br/>

위의 내용을 봤을때는 비제어 컴포넌트가 불필요한 렌더링도 발생시키지 않고 코드도 간단해보여서 더 좋을 것 같은데 비제어 컴포넌트만 사용하면 되지 않을까? 라고 생각할 수 있다.

> 하지만 그렇다고 해서 무조건 비제어 컴포넌트를 사용하는 것이 더 낫다고 말할 수는 없다.

오히려 [공식문서](https://ko.legacy.reactjs.org/docs/uncontrolled-components.html)에서는 대부분의 경우에 폼을 구현하는데 제어 컴포넌트를 사용하는 것이 좋다고 설명하고 있다.

## 제어 vs 비제어, 언제 어떤 걸 써야 할까?

두 방식은 각각의 장단점이 있고, 사용 목적이나 상황에 따라 적절히 선택하는 것이 중요하다.

### ✅ 제어 컴포넌트가 적합한 경우

- 입력값에 따라 실시간 UI 업데이트가 필요한 경우
  (실시간 검색, 글자 수 제한 표시, 실시간 유효성 검사 등)

- 입력값을 즉시 React state로 활용하는 경우 (조건부 렌더링, 입력값에 따른 버튼 활성화 등)

### ✅ 비제어 컴포넌트가 유용한 경우

- 입력값을 단지 제출 시점에 한 번만 읽으면 되는 경우
  (로그인 폼, 검색창 등 단순한 입력 등)

- 성능상 이유로 state 업데이트와 리렌더링을 피하고 싶은 경우

결론적으로 제어 컴포넌트와 비제어 컴포넌트 중 어느 한 쪽이 무조건 더 낫다고 말할 수는 없을 것 같다.

중요한 건 "내가 만들고 있는 UI에서 어떤 방식이 더 적절한가?" 를 판단하고 이에 따라 적절한 방식을 선택하는 것이다.

사용자 입력값을 지속적으로 추적하거나, 상태 기반의 다양한 처리가 필요하다면 → `제어 컴포넌트`

단순 입력만 받고 값을 한 번만 읽으면 충분하다면 → `비제어 컴포넌트`

아래는 제어 컴포넌트가 할 수 있는 것과 비제어 컴포넌트가 할 수 있는 것을 비교한 표로 참고해보면 좋을 것 같다.

<img src="./compare.png" alt="제어 컴포넌트와 비제어 컴포넌트 비교" style="width: 100%;" /> <br/>

## react-hook-form을 사용한 이유

`react-hook-form`은 비제어 컴포넌트 기반으로 설계된 폼 라이브러리이다.

하지만 단순한 비제어 방식에 머무르지 않고, 제어 방식이 갖는 강력한 유효성 검사, 상태 추적, 에러 핸들링까지도 리렌더링을 최소화하면서도 제공해준다.

즉, 제어 컴포넌트의 유연함과 비제어 컴포넌트의 성능 이점을 모두 갖추었고, 더 나아가 더 많은 기능을 제공해주기 때문에 사용하였다.

업데이트 또한 지속적으로 이루어지고 있으며 다른 form 라이브러리와 비교해도 가장 높은 다운로드 수를 기록하고 있다.

<img src="./download.png" alt="react-hook-form 다운로드 수" style="width: 100%;" /> <br/>

아래와 같이 [공식문서](https://react-hook-form.com/)에서 렌더링 횟수를 확인할 수 있다.

<img src="./render.gif" alt="react-hook-form 렌더링 횟수" style="width: 100%;" /> <br/>

또한 다른 라이브러리에 비해 마운팅 속도도 빠르다.

<img src="./mount.png" alt="react-hook-form 마운팅 속도" style="width: 100%;" /> <br/>

개인적으로 `react-hook-form` 라이브러리를 사용하면서 아래와 같은 이점들이 있었다.

### 1️⃣ 코드가 간결해졌음

```javascript

const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

<input value={name} onChange={(e) => setName(e.target.value)} />
<input value={email} onChange={(e) => setEmail(e.target.value)} />
<input value={password} onChange={(e) => setPassword(e.target.value)} />
```

기존에는 위와 같이 각각의 상태를 관리해야 했지만, `react-hook-form`을 사용하면 아래와 같이 간결해진다.

```javascript
<input {...register("name")} />
<input type="email" {...register("email")} />
<input type="password" {...register("password")} />
<button type="submit">제출</button>

</form>
```

### 2️⃣ 유효성 검사와 에러 핸들링이 편리함

```javascript
<input
  {...register('email', {
    required: '이메일은 필수입니다.',
    pattern: {
      value: /\S+@\S+\.\S+/,
      message: '이메일 형식이 아닙니다.',
    },
  })}
/>;
{
  errors.email && <p>{errors.email.message}</p>;
}
```

위와 같이 필드별 유효성 검사도 간편하게 설정할 수 있었고 errors 객체를 통해 에러 메시지를 바로 렌더링할 수 있었다. (Yup, Zod 같은 validation 라이브러리와도 쉽게 연동 가능)

폼의 구조가 복잡해질수록 직접 상태를 관리하고 유효성 검사를 처리하는 것은 점점 더 부담스러워지는데, `react-hook-form`을 통해 그 과정을 정말 깔끔하게 해결하여 코드가 간결해졌다.

복잡한 폼에서 상태관리 및 유효성 검사를 하는데 어려움이 있다면 `react-hook-form`을 사용해보는 것을 추천한다.
