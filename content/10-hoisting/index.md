---
emoji: 🎣
title: 'var, let, const와 호이스팅'
date: '2025-03-27'
categories: featured-Dev
---

<img src="./js.webp" alt="js" style="width: 100%;" />
<br/>

[mdn](https://developer.mozilla.org/ko/docs/Glossary/Hoisting)에 따르면 JavaScript 호이스팅은 인터프리터가 코드를 실행하기 전에 함수, 변수, 클래스 또는 임포트(import)의 선언문을 해당 범위의 맨 위로 끌어올리는 것처럼 보이는 현상을 말한다. 이는 변수나 함수가 실제 코드에서 작성된 위치와 관계없이 선언 단계에서 메모리에 저장되기 때문에 발생한다.

이러한 호이스팅은 var,let,const에서 모두 이루어진다.
(var, let, const는 자바스크립트에서 변수를 선언할 때 사용하는 키워드이다.)

## var

var은 다음과 같은 특징을 가진다.

- 함수 스코프
- 재선언 및 재할당 가능
- 호이스팅 발생

아래는 `함수 스코프`를 가지는 var의 예시이다.

```javascript
function main() {
  if (true) {
    var a = 1;
  }
  console.log(a);
}

main();

// 위 코드의 결과는 1이다.
```

var 키워드는 함수 스코프를 가지기 때문에 main 함수 내에서 선언된 변수 a는 함수 스코프 내에서 선언되어 함수 내에서 어디서든 접근할 수 있다.

### var 키워드는 재선언이 가능하다.

```javascript
var a = 1;
var a = 2;
```

위와 같이 변수 a를 두 번 선언해도 에러가 발생하지 않는다.

### var 키워드는 호이스팅이 발생한다.

```javascript
console.log(num);

var num = 20;
```

위 코드의 결과는 undefined이다. (num의 선언단계에서 메모리에 저장되어 호이스팅이 발생하기 때문에 undefined가 출력된다.)

## let과 const

반면 let과 const는 `블록 스코프`를 가진다.

```javascript
function main() {
  if (true) {
    let a = 1;
  }
  console.log(a);
}

main();

// 위 코드의 결과는 에러가 발생한다.
```

위 코드에서 let은 블록 스코프를 가지기 때문에 블록 스코프 내에서 선언된 변수 a는 블록 스코프 내에서만 접근할 수 있다.

```javascript
function main() {
  let x = 'hello';
  if (true) {
    let x = 'world';
  }
  console.log(x);
}
```

마찬가지로 let은 블록스코프를 가지기 때문에 위 코드의 결과는 hello이다.

### let과 const는 재선언이 불가능하다.

```javascript
let a = 1;
let a = 2;

const a = 1;
const a = 2;

// 위 코드는 에러가 발생한다.
```

차이점이 있다면 let은 재할당이 가능하지만 const는 재할당이 불가능하다.

```javascript
let a = 1;
a = 2;

const a = 1;
a = 2;
```

위의 경우, let은 재할당이 가능하여 에러가 발생하지 않지만, const는 재할당이 불가능하기 때문에 에러가 발생한다.

### const 의 경우 선언을 함과 동시에 값을 할당해주어야한다. 즉 선언만 하고 값을 비울 수 없다. (ex. const a; 불가능)

const의 경우 일반적으로 값을 변경할 수 없지만 객체의 경우 속성값을 변경할 수 있다.

```javascript
const obj = { a: 1 };
obj.a = 2;
console.log(obj);
```

위의 경우, obj의 속성값을 변경할 수 있기 때문에 2가 출력된다.

만약 객체의 값을 변경하지 않기를 원한다면 Object.freeze를 사용하여 객체를 동결할 수 있다.

```javascript
const obj = { a: 1 };
Object.freeze(obj);
obj.a = 2;
console.log(obj);
```

위의 경우, obj의 속성값을 변경할 수 없기 때문에 1이 출력된다.

### let과 const 또한 `호이스팅`이 발생한다.

```javascript
console.log(num);

let num = 20;

// 위의 경우, 참조에러가 발생한다.
```

위의 경우 참조에러가 발생해서 호이스팅이 발생하지 않는다고 생각할 수 있지만 그렇지 않다. `TDZ`에 의해 접근이 불가능 한 것이다.

> 여기서 TDZ에 대해서 간단하게 알아보자

TDZ란 변수가 선언되었지만 아직 초기화 되지 않는 상태를 말한다. 즉, '선언만 되고 아직 초기화 되지 않는 변수가 머무는 공간'이라고 생각하면 될 것 같다.

JavaScript에서는 'let'이나 'const'로 선언한 변수들이 TDZ을 거쳐 간다.
이때 이 공간에 있는 변수를 참조하려고 하면  'ReferenceError'가 발생한다.

> 그렇다면 `TDZ`는 왜 필요할까?

TDZ는 초기화 되지 않는 변수를 사용하는 것을 방지하여 프로그래밍의 오류를 줄이는데 사용될 수 있다.

결과적으로 let과 const는 호이스팅 되어 변수를 메모리에 올려놨지만 TDZ라는 지역에 있어 해당 변수를 초기화하는 코드 줄을 지나야 접근이 가능한 것이다.

```javascript
// let으로 선언된 변수
let letVariable;
console.log(letVariable); // 출력: undefined (TDZ를 벗어남, 하지만 아직 값이 할당되지 않음)
letVariable = '초기화 완료';
console.log(letVariable); // 출력: "초기화 완료"
```

위와 같이 let으로 선언한 letVariable은 별도의 값을 할당하지 않을 경우 undefined로 초기화된다. 이후 letVariable에 값을 할당하면 TDZ를 벗어나 참조에러가 뜨지 않고 초기화된 값이 출력된다.

## 함수 호이스팅

변수에 대해 알아보았으니 함수에 대해서도 알아보자.
JavaScript에서는 함수를 정의하는 방식에 따라 `함수 선언식`과 `함수 표현식`으로 나눌 수 있다.

`함수 선언식`은 이름이 있는 함수로 자바스크립트 엔진이 코드를 실행하기 전에 메모리에 로드하기 때문에 호이스팅이 발생한다.

```javascript
console.log(add(2, 3));

function add(a, b) {
  return a + b;
}
```

여기서 add함수는 선언된 위치보다 앞서 호출되어도 정상적으로 실행된다. 이는 자바스크립트 엔진이 함수 선언을 미리 메모리에 로드했기 때문이다.

반면, `함수 표현식`은 변수에 익명 함수를 할당하는 방식으로 할당된 변수명으로 호출할 수 있다. `함수 표현식`은 호이스팅 되지 않으며 변수에 할당된 이후에만 호출할 수 있다.

```javascript
console.log(add(2, 3));

const add = function (a, b) {
  return a + b;
};
```

위의 경우 호이스팅이 일어나지 않아 참조에러가 발생한다.

이상 var, let, const, 함수 선언식, 함수 표현식에 대해 알아보았다.
