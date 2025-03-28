---
emoji: 🍮
title: 'this 바인딩을 알아보자'
date: '2025-03-28'
categories: featured-Dev
---

<img src="./js.webp" alt="js" style="width: 100%;" /> <br/>

프로토타입 기반 객체지향 언어인 JavaScript에 대해 알아가던 중 this 바인딩을 알게되었다. 그리고... 머리가 너무 아파졌다...

> 너무 어려웠기 때문이다.

<img src="./vomit.jpeg" alt="vomit" style="width: 100%;" /><br/>

그래서 이번 기회에 this 바인딩에 대해 알아보고 정리해보려고 한다.

(참고로 this라는 키워드는 자바스크립트에서 뿐만아니라 Java, C#등의 객체지향 프로그래밍 언어에서 사용된다.)

## JavaScript에서 this는 함수가 호출되는 방식에 따라 다르게 바인딩된다.

> 생각났다 이것땜에 머리가 어지러웠다. 그래도 다시 호흡하며...

<img src="./breath.jpeg" alt="breath" style="width: 100%;" /> <br/>

`함수가 호출되는 방식`에 따라 this에 바인딩되는 객체가 달라진다고 하는데 그렇다면 함수가 호출되는 방식에는 어떠한 것이 있을까?

`함수 호출 방식`은 아래와 같이 다양하다.

- 일반 함수 호출
- 메서드 호출
- 생성자 함수 호출
- apply/call/bind 호출

위의 함수 호출방식에 대해 하나씩 알아보자.

### 1️⃣ 일반 함수 호출

```javascript
console.log(this === window); // true

function thisFunction1() {
  console.log(this);
}
thisFunction1(); // window 또는 global

function thisFunction2() {
  const a = 10;
  console.log(this.a);
}

thisFunction2(); // undefined

function thisFunction3() {
  console.log('thisFunction3: ', this); // window 또는 global
  function thisFunction4() {
    console.log('thisFunction4: ', this); // window 또는 global
  }
  thisFunction4();
}

thisFunction3();
```

위 코드의 실행결과를 보면 알 수 있듯이 `일반 함수`로 호출될 때 this는 `전역 객체`를 가리킨다. (즉, 브라우저에서는 window, node.js에서는 global을 가리키게 된다.)

특히 위의 thisFunction3안에 있는 thisFunction4 내부함수에서도 this가 전역객체에 바인딩 된다.

### 2️⃣ 메서드 호출

다음으로 함수가 객체의 메서드로 호출되는 상황에서 this가 바인딩되는 상황을 살펴보자.

```javascript
const obj1 = {
  name: '메서드 호출',
  showThis: function () {
    console.log(this.name);
  },
};

obj1.showThis(); // 메서드 호출

---

const obj2 = {
  a: 'hello',
  f1: function () {
    console.log(this.a);
  },
};

obj2.f1(); // hello
```

위와 같이 객체의 메서드로 호출될 때, this는 해당 메서드를 소유한 객체를 가리킨다. (`.` 왼쪽에 있는 값을 가리킨다고 보면 쉬울 것 같다.)

### 🚨 메소드 호출시에는 함수를 매개변수(콜백)로 넘겨서 실행하는 것을 주의해야 한다.

> 무슨말인지는 아래의 코드를 보자.

```javascript
const obj = {
  a: 'hello',
  f1: function () {
    console.log(this.a);
  },
};

setTimeout(obj.f1, 1000); // undefined
```

위와 같이 객체에 정의되어있는 함수의 레퍼런스를 매개변수로 전달하는 상황에서는 this는 기본 바인딩이 적용돼서 전역 객체에 바인딩 된다.

그 이유는 setTimeout 함수 안에 전달한 콜백은 f1 함수의 레퍼런스일 뿐, obj의 콘텍스트를 가지고 있지 않기 때문이다.

즉, 위의 예시처럼 setTimeout 내부에서 호출되는 콜백은 obj 객체의 콘텍스트에서 실행되는 것이 아니기 때문에, this는 기본 바인딩이 적용돼서 전역 객체에 바인딩 된다.

### 3️⃣ 생성자 함수 호출

생성자 함수 호출과정에서 this바인딩에 대해 확인해보자

```javascript
function Person(name) {
  this.name = name;
}
const person = new Person('JS');
console.log(person.name); // 'JS'
```

위와 같이 new 키워드와 함께 호출되는 생성자 함수에서, this는 새로 생성되는 인스턴스를 가리킨다.

주의할 점은 아래와 같이 new를 붙이지 않는다면, 생성자 함수로 동작하지 않게된다.

```javascript
const person = Person('JS');
console.log(person.name); // undefined
```

그렇다면 호출에 따라 this가 전역으로 바인딩되기도 하고, 해당 메서드가 있는 객체, 인스턴스를 가리키기도 하는데 내 맘대로 this를 지정할 수는 없을까?

> 답은 아래의 apply/call/bind 메서드를 사용하면 된다.

### 4️⃣ apply/call/bind 호출 (명시적 바인딩)

JavaScript의 모든 함수는 call, apply, bind라는 프로토타입 메소드를 가지고있다.

즉, 위의 메소드들은 Function.prototype 객체의 메소드이다. (Function.prototype.apply, Function.prototype.call, Function.prototype.bind)

```javascript
function fn() {
  console.log(this.name);
}
fn(); // undefined

const obj = {
  name: '자바스크립트',
};

fn.call(obj); // 자바스크립트
```

위의 결과를 보면, 함수가 실행되고 첫 번째 인자로 전달한 값에 this가 바인딩된 것을 확인할 수 있다.

## 화살표 함수

> 그렇다면 es6에서 추가된 화살표함수에서 this 바인딩에 대해 알아보자.

화살표 함수의 경우 this 바인딩시에 앞서 살펴본 규칙들이 적용되지 않고 this에 `렉시컬 스코프`가 적용된다.

즉 화살표 함수는 자신만의 this를 가지지 않는다. (이러한 이유로 화살표 함수는 생성자 함수로 사용할 수 없다.)

> 아래에서 함수 선언식과 함수 표현식에서 this바인딩을 비교해보자.

```javascript
const obj = {
  arrowFn: () => {
    console.log(this);
  },
  fn() {
    console.log(this);
  },
};

obj.arrowFn(); // window 또는 global
obj.fn(); // obj
```

함수 선언식의 경우 this는 함수를 호출한 객체를 가리키지만, 화살표 함수의 경우에는 객체 리터럴이 평가되는 스코프는 전역 스코프이기 때문에 전역 객체(window 또는 global)를 가리키게 된다.

> 아래 화살표 함수의 콜백함수의 예시도 보자

```javascript
const obj = {
  a: 10,
  fn: function () {
    setTimeout(() => {
      console.log(this.a);
    }, 1);
  },
};

obj.fn(); // 10
```

위의 예시에서 setTimeout의 콜백함수로 화살표 함수를 주었을 경우 화살표 함수는 렉시컬 스코프를 따르므로 this는 obj 객체를 가리킨다. 따라서 위의 obj.fn에 의해 콜백함수가 실행될 때 this는 obj 객체를 가리키게 된다.

이상 this 바인딩에 대해 알아보았다.

요즘에는 함수 표현식을 많이 써서 this 바인딩의 개념을 찾아보기 힘들지만 그래도 this 바인딩은 중요한 개념이니 한 번 보고 가면 좋을 것 같다!

<img src="./Sale Working GIF.gif" alt="Sale Working GIF" style="width: 100%;" />
