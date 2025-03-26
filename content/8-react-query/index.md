---
emoji: 🤠
title: 'React Query를 사용한 이유'
date: '2025-03-27'
categories: featured-Dev
---

<img src="./react-query.webp" alt="react-query" />

지금까지 프로젝트를 하면서 react-query를 통해 서버 상태를 관리하곤 했다.
react-query를 사용한 이유는 데이터 캐시와 서버 상태를 선언적으로 사용하기 위해서였다.

> 하지만 처음부터 react-query를 사용한 것은 아니다.

개발과정에서 data-fetching작업이 있었는데 이럴때마다 반복되는 코드를 작성해야했고 이러한 불편함을 개선하기 위해 찾아보던 중 알게되었다.

기존의 data-fetching 작업은 아래와 같이 진행해주었다.

```javascript
import { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/data');
        if (!res.ok) throw new Error('Network response was not ok');
        const result = await res.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    ...
  )
}
```

> 아마 뭐가 불편하다는 거지? 라고 생각하는 사람도 있을 것이다.

하지만 데이터 요청이 늘어난다면 어떻게 될까? 또, 데이터 요청이 서로 연관되어 있다면 어떻게 될까? (즉 A라는 데이터 요청은 B데이터 요청으로부터 응답받은 데이터에 따라 진행될수도 안될수도 있음)

데이터 요청이 늘어난다면 useState를 통해 데이터, 데이터에 대한 에러 상태, 로딩 상태를 관리하는 코드가 반복적으로 작성되어야 한다.

또한 데이터 요청이 서로 연관되어 있다면 데이터 요청 간의 관계를 관리하는 코드도 추가되어야 하며 요청이 가지 않는 데이터에 대해 useState를 통해 데이터, 데이터에 대한 에러 상태, 로딩 상태를 관리하는 코드도 추가되어야 할 수도 있다.

나는 이러한 불편함을 해결하기 위해 react-query를 사용하게 되었다. (이 글에서는 react-query의 자세한 사용법에 대해서는 다루지 않겠다. react-query가 궁금하다면 [공식문서](https://tanstack.com/query/latest/docs/framework/react/overview)를 참고해보면 좋을 것 같다.)

그래도 react-query에 대해서 조금만 이야기하자면 react query는 데이터를 신선하거나 상한 상태로 구분해 관리하는 라이브러리이다.
캐시된 데이터가 신선한 상태라면 캐시된 데이터를 사용하고, 데이터가 상했다면 서버에 다시 요청해 신선한 데이터를 가져온다. (데이터 유통기한 정도로 이해하면 될듯하다.)

기본적으로 데이터를 "신선한(fresh)" 상태로 간주하는 시간인 staleTime은 0이며, 쿼리가 unmounted되고 사용되지 않을 때, 캐시에서 제거되기까지 유지되는 시간인 gcTime은 5분이다.

따라서 거의 변하지 않는 정적 데이터의 경우에는 staleTime을 높게 설정하여 데이터를 캐시하고, 데이터가 자주 변하는 경우에는 staleTime을 낮게 설정하여 데이터를 최신으로 유지할 수 있다.

<hr />

마지막으로 이전에 사용하던 v4 버전에서 방식과 현재(2025년 3월 27일 기준) v5 버전에서 사용하는 방식에 차이점이 있어 이를 간단하게 정리해보았다.

## hook 옵션 객체 형태로 변경

### 기존 사용 방식

```javascript
const { data } = useQuery(['queryKey'], getData);
const mutation = useMutation(setData);
```

### 변경 후 사용 방식

```javascript
const { data } = useQuery({ queryKey: ['queryKey'], queryFn: getData });
const mutation = useMutation({
  mutationKey: ['mutationKey'],
  mutationFn: setData,
});
```

## Suspense 트리거 옵션 변경

### 기존 사용 방식

```javascript
const { data } = useQuery(['queryKey'], getData, { suspense: true });

// or
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
});
```

기존에는 queryClient에 suspense: true 기본 옵션을 부여하던가, useQuery 훅에 별도의 옵션을 주어 suspense를 트리거할 수 있었지만 이제는 Suspense를 사용하기 위한 hook이 별도로 나왔다.

### 변경 후 사용 방식

```javascript
const { data } = useSuspenseQuery({ queryKey: ['queryKey'], queryFn: getData });
```

Suspense를 사용하기 위해 query hook에 옵션 대신 useSuspenseQuery 를 이용해서 데이터를 받아오면 된다.

## Suspense와 함께 사용하지 못하는 enabled 옵션

### 기존 사용 방식

```javascript
const { data } = useQuery(['queryKey'], getData, {
  suspense: true,
  enabled: false,
});
```

기존에는 useQuery에 suspense와 enabled 옵션을 동시에 부여해 특정 값에 의존적인 쿼리를 동기적으로 호출할 수 있었다.

### 변경 후 사용 방식

```javascript
// useQuery는 enabled 사용 가능
const { data } = useQuery({
  queryKey: ['queryKey'],
  queryFn: getData,
  enabled: false,
});

// useSuspenseQuery는 enabled 사용 불가
const { data } = useSuspenseQuery({ queryKey: ['queryKey'], queryFn: getData });
```

useQuery에는 enabled 옵션을 사용할 수 있지만 useSuspenseQuery에는 enabled 옵션을 사용할 수 없다.

## ErrorBoundary 트리거 옵션 변경

### 기존 사용 방식

```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      useErrorBoundary: true,
    },
  },
});
```

기존에는 suspense 옵션을 부여하거나, 별도로 useErrorBoundary 옵션을 부여하면 ErrorBoundary로 에러가 전파되었다.

### 변경 후 사용 방식

```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: true,
    },
    mutations: {
      throwOnError: true,
    },
  },
});
```

변경 후에는 queries와 mutations 각각 속성에 별도로 throwOnError 옵션을 부여해야 에러 전파가 가능해졌다.
