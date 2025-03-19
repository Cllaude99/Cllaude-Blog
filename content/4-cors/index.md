---
emoji: ⚠️
title: 'CORS 이해하기'
date: '2025-03-19'
categories: featured-Dev
---

오늘은 웹 개발을 해봤다면, 한번 쯤은 마주쳐봤을 **CORS에러**에 대해 이야기를 해보려고한다. 그렇다면 **CORS에러**는 왜 발생하고, **CORS에러**가 발생했을 경우에는 어떻게 해결해 주어야 할까?

### 👉🏻 Same-Origin-Policy(SOP) & Cross-Origin-Policy(COP)

> **CORS에러**에 대해 알아보기 전에 **Same-Origin**과 **Cross-Origin**에 대해서 알아보자!

먼저 **"Same-Origin"**이란, 웹 브라우저에서 같은 출처(origin)에서 로드된 문서나 스크립트가 동일한 출처에만 접근할 수 있는 보안 정책을 의미한다. 여기서 **"출처"(Origin)**는 프로토콜, 호스트, 그리고 포트를 포함한 세 가지 요소로 정의된다. 즉, 두 URL이 동일한 **프로토콜, 호스트, 그리고 포트**를 공유하면 **같은 출처**로 간주된다.

다음으로 **"Cross-Origin"**이란, 웹 브라우저에서 한 출처(origin)에서 로드된 문서나 스크립트가 다른 출처의 리소스에 접근하는 상황을 의미한다. 기본적으로 same-origin 정책 때문에 **이러한 접근은 제한**되지만, **특정 방법을 통해 이를 허용**할 수 있다. (뒤에 나오겠지만 미리 스포를 하자면 사실 **CORS**는 에러가 아니라 우리를 도와주는 **해결책**일지도...?)

### 👉🏻 CORS에러 발생이유?

> 그렇다면 **CORS에러**는 왜 발생하는 것일까?

CORS에러가 발생하는 이유는 기본적으로 **XMLHttpRequest, Fetch API 스크립트**는 **SOP정책**을 따르기 때문이다. 즉, 다른 출처에 대한 요청을 제한하기 때문에 **CORS에러**가 발생하는 것이다!

잠깐, 여기서 **출처(Origin)**란, **Protolcol** 과 **Host** 그리고 **Port** 까지 모두 합친 URL을 의미한다고 보면 된다.

> 아래의 예시를 통해 **동일 출처** 인지에 대한 이해가 되었는지 확인해보자!

![](https://velog.velcdn.com/images/cllaude/post/f528571e-f3df-4a76-9be6-e7014c58bc8e/image.png)

> 그렇다면 기본적으로 SOP정책을 따르는 것이 아닌, **동일한 출처가 아니어도 요청이 가능하도록** 해주면 되지 않을까...?

**하지만**, 출처가 다른 두 어플리케이션 사이에 요청이 자유로운 환경은 위험한 환경이다. 그 이유는 만일 위와 같은 SOP제약이 없다면, 해커가 CSRF(Cross-Site Request Forgery)나 XSS(Cross-Site Scripting) 등의 방법을 이용해서 우리가 만든 어플리케이션에서 해커가 심어놓은 코드가 실행하여 개인 정보를 가로챌 수 있기 때문이다.

### 👉🏻 그렇다면 CORS에러를 어떻게 해결할 수 있을까?

**CORS**라는 용어에 대해서 다시 한번 살펴보자!
**CORS**란 (Cross-Origin Resource Sharing)의 약자로 교차 출처 리소스 공유를 뜻한다.
다시 말하면 CORS는 **다른 출처의 리소스 공유에 대한 허용/비허용 정책**을 의미하는 것이다.

즉, console창에 뜨는 **CORS라는 에러 메세지**는 사실 브라우저의 SOP 정책에 따라 다른 출처의 리소스를 차단하면서 발생된 에러이며, CORS는 **다른 출처의 리소스를 얻기위한 해결 방안** 이었던 것이다. 요약하자면 SOP 정책을 위반해도 **CORS 정책을 따르면 다른 출처의 리소스라도 허용**한다는 뜻이다.

그렇다면 CORS정책을 따르면 하면 해당 에러를 해결할 수 있다는 뜻인데, 어떠한 정책을 따라 주어야 할까...?

> 해당 에러에 대한 해결방법을 설명하기에 앞서 먼저 서버에 요청을 할때에 브라우저의 기본 동작을 살펴보자!

> 1️⃣ 클라이언트에서 HTTP요청의 헤더에 Origin을 담아 전달

먼저 클라이언트에서는 HTTP 프로토콜을 이용하여 서버에 요청을 보내게 되며, 이때 브라우저는 요청 헤더에 Origin 이라는 필드에 출처를 함께 담아 보낸다. (아래는 **네트워크 탭**에서 확인할 수 있다.)

![](https://velog.velcdn.com/images/cllaude/post/38a91e39-dad4-4be8-879b-bf9f26fb8968/image.png)

> 2️⃣ 서버는 응답헤더에 Access-Control-Allow-Origin을 담아 클라이언트로 전달한다.

위 1번과정에서 요청을 받은 서버는 이 요청에 대한 응답을 할 때 응답 헤더에 **Access-Control-Allow-Origin**이라는 필드를 추가하고 값으로 '이 리소스를 접근하는 것이 허용된 출처 url'을 내려보낸다. (즉 아래 예시에서는 http://localhost:3000 으로 부터 오는 요청에는 해당 리소스에 대한 접근을 허용한다는 의미이다)

![](https://velog.velcdn.com/images/cllaude/post/414535d9-1e78-4ac0-ac3b-e42859081a2b/image.png)

> 3️⃣ 서버로 부터의 응답이후에 클라이언트에서는 **Origin값**과 서버가 보내준 **Access-Control-Allow-Origin**을 비교한다.

즉, 2번과정 이후 응답을 받은 브라우저는 자신이 보냈던 **요청의 Origin**과 서버가 보내준 **응답의 Access-Control-Allow-Origin**을 비교해본 후 **응답의 Access-Control-Allow-Origin**에 **요청의 Origin**이 포함되어 있지 않다면 그 응답을 사용하지 않고 버리게 되는 것이다. 즉 이때 CORS에러가 발생한다!

위의 경우에는 둘다 http://localhost:3000이기 때문에 유효하니 다른 출처의 리소스를 문제없이 가져오게 된다.

> 위의 요청에 대한 클라이언트, 서버의 CORS상황을 살펴보았을 때, 서버에서 **Access-Control-Allow-Origin** 헤더에 **허용할 출처를 기재**해서 클라이언트에 응답하면 해결할 수 있다는 결론을 얻을 수 있다.

### 👉🏻 인증된 요청시 CORS에러

**인증된 요청**은 클라이언트에서 서버에게 자격 인증 정보(Credential)를 실어 요청할때 사용되는 요청으로, 세션 ID가 저장되어있는 쿠키(Cookie) 혹은 Authorization 헤더에 설정하는 토큰 값을 실어 요청하는 것을 말한다.

즉, 클라이언트에서 일반적인 JSON 데이터 외에도 쿠키 같은 인증 정보를 포함해서 다른 출처의 서버로 전달할때 CORS의 세가지 요청중 하나인 인증된 요청으로 동작된다.

> **클라이언트 부분**

위의 인증된 요청시 CORS에러가 발생하였다면, 클라이언트에서는 **credentials 옵션**을 설정해주었는지 확인해야한다.
기본적으로 브라우저가 제공하는 요청 API 들은 별도의 옵션 없이 브라우저의 쿠키와 같은 인증과 관련된 데이터를 함부로 요청 데이터에 담지 않도록 되어있기 때문에 인증과 관련된 정보를 담을 수 있게 해주기 위해서는 **credentials 옵션**을 설정해 주어야 한다.
아래는 fetch, axios사용시 credentials 옵션을 설정해 주는 예시이다

> **fetch 예시**

```javascript
// fetch 메서드
fetch('${BACK_END_URL}/api/login', {
  method: 'POST',
  credentials: 'include', // credentials 옵션
  body: JSON.stringify({
    email: 1234,
    password: 1234,
  }),
});
```

> **axios 예시**

```javascript
// axios 라이브러리
axios.post('${BACK_END_URL}/api/login', {
  {email, password}
}, {
	withCredentials: true // credentials 옵션값을 공유하겠다는 설정
})
```

위의 코드에서 확인해 볼 수 있듯이 fetch를 사용하는 경우에는 `credentials: "include"` , axios를 사용하는 경우에는 `withCredentials: true` 를 통해
credentials 옵션값을 설정해 줄 수 있다.

그렇다면 서버에서는 어떠한 과정을 진행해주어야 할까?

> **서버 부분**

서버에서는 아래와 같은 4가지 사항을 고려해 주어야 한다.

1️⃣ 응답 헤더의 Access-Control-Allow-Credentials 항목을 true로 설정해야 한다.

2️⃣ 응답 헤더의 Access-Control-Allow-Origin 의 값에 와일드카드 문자("\*")는 사용할 수 없다.

3️⃣응답 헤더의 Access-Control-Allow-Methods 의 값에 와일드카드 문자("\*")는 사용할 수 없다.

4️⃣ 응답 헤더의 Access-Control-Allow-Headers 의 값에 와일드카드 문자("\*")는 사용할 수 없다.

### 👉🏻 HTTPS에서 HTTP로 리소스를 요청할 때 CORS에러

추가로 보안상의 이유로 HTTPS에서 HTTP로 리소스를 요청하는 경우에도 **CORS 에러**가 발생할 수 있다.

#### 해결법 1

요청을 보내는 주소를 HTTPS로 변경하여 해결 할 수 있다.

#### 해결법 2

요청을 "http://", "https://"로 시작하는 것이 아닌 "//" 으로 시작한다.

```javscript
<a herf="http://blabla/1234"></a>
```

예를 들어 위와 같은 요청을 아래와 같이 변경해준다

```javascript
<a herf="//blabla/1234"></a>
```

### ⭐️ 레퍼런스

> [CORS에러 관련](https://inpa.tistory.com/entry/WEB-%F0%9F%93%9A-CORS-%F0%9F%92%AF-%EC%A0%95%EB%A6%AC-%ED%95%B4%EA%B2%B0-%EB%B0%A9%EB%B2%95-%F0%9F%91%8F) <br/> [HTTPS에서 HTTP로 요청 관련 1](https://www.jeong-min.com/30-cors-fe/) <br/> [HTTPS에서 HTTP로 요청 관련 2](https://velog.io/@shin6949/HTTPS%EC%97%90%EC%84%9C-HTTP-%EC%9A%94%EC%B2%AD-%EB%B8%94%EB%9D%BD-%EC%97%90%EB%9F%AC-%ED%95%B4%EA%B2%B0%ED%95%98%EA%B8%B0)
