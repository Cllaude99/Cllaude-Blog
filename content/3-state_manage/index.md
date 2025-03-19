---
emoji: 🧸
title: '상태관리 하는 방법에는 어떠한 것이 있을까?'
date: '2025-03-19'
categories: featured-Dev
---

프로젝트의 상태관리 라이브러리를 정하기에 앞서 상태관리란 왜 필요한 것이고, 어떠한 상태관리 라이브러리들이 있는지, 해당 라이브러리의 장단점에는 어떠한 것이 있는지 등에 대해 알아보고
지금 진행하는 프로젝트에는 어떠한 특성을 가진 라이브러리가 적합할지 알아보고자 상태관리에 대해 조금더 자세하게 공부해보았다!
(물론 상태관리가 딱히 필요없는 프로젝트도 존재할 수 있다! 따라서 해당 프로젝트가 상태관리가 필요한지에 대해 생각해보는 것도 중요한것 같다!)

### 🧐 상태관리가 필요한 이유?

먼저 근본적으로 상태관리가 왜 필요한지에 대해 알아보자!
프런트엔드 개발자라면 한번쯤 들어보거나 사용해봤을 라이브러리로는 **리액트**가 있다.
나 역시 리액트 라이브러리를 사용하여 프로젝트를 진행중이다.

리액트 라이브러리가 뷰나 앵귤러와 비교했을 때 가장 큰 차이점은 **단방향 바인딩**이라고 할 수 있다.
리액트는 **단방향 바인딩**을 지원하기 때문에 부모에서 자식으로만 state를 props로 전달할 수 있고, 자식의 props를 부모에게 직접 전달할 수는 없다!

![](https://velog.velcdn.com/images/cllaude/post/f5106dd0-c4ac-482c-beb0-ee3166da0835/image.png)

위 그림을 보면 알 수 있듯이 자식에서 부모의 상태를 바꾸려면 해당 상태를 컨트롤하는 함수를 props로 넘겨주어야 한다.

하지만 이것이 반복되다 보면 엄청난 **props drilling**이 발생하게 된다는 문제가 있고, 프로젝트의 규모가 커질수록 **props의 뎁스가 증가**하게 되며, 이는 **불필요한 리렌더링**을 유발할 수도 있다는 문제점이 존재한다. (**props drilling**이 많아질 경우 prop의 출처를 찾기 어렵다)

물론 컴포넌트의 재활용성이라든가, 의존성 분리 등의 측면에서 props는 잘 다루면 좋은 도구가 될 수 있다. 다만 컴포넌트의 역할에 치우쳐진 데이터가 아닌, **프로젝트 전반적으로 사용되는 데이터**의 경우 글로벌로 두고 공유하는 과정이 필요하다고 생각이 되었고, 나는 이 과정에서 상태관리의 필요성에 대해 느꼈다!

### 🔍 상태 관리 라이브러리 종류

위에서 살펴본 상태관리의 필요성에 따라 나는 상태관리에 관한 몇 가지 라이브러리들을 찾아보았고, Redux, Recoil, MobX, Zustand, Jotai를 찾을 수 있었다.

위의 상태관리 라이브러리들은 또 다시 **flux 방식**, **proxy 방식**, **atomic 방식**으로 나눌 수 있다. 그렇다면 각각의 방식이 어떻게 이루어지는 것이고 어떠한 장점이 있는지 한 번 알아보자!

### 🔥 flux 방식

먼저 flux 방식이다.

이 유형은 Flux 아키텍처 모델을 기반으로 하는 중앙 집중식으로 상태를 관리하며
데이터는 **단방향**으로 이동된다는 특징이 있다.
![](https://velog.velcdn.com/images/cllaude/post/4c63c434-0849-4939-9b4a-7142b0796d0d/image.png)

![](https://velog.velcdn.com/images/cllaude/post/b2cf98d8-ef59-494e-9f4b-be154fb6d563/image.png)

위와 같이 Action이 발생하면, Dispatcher에서 이를 해석한 후 Store에 저장된 정보를 갱신하고, 그 결과가 다시 View로 전달된다.

이 방식은 상태를 한 곳에 모아 관리하고 싶을 때 적합하며, 상태를 중앙 집중화하기 때문에 상태 업데이트가 많거나 복잡할 경우 성능 문제가 발생할 수 있다는 특징이 있다.

이 방식에 해당되는 라이브러리로는 **Redux**, **Zustand**가 있다.

### 🔥 proxy 방식

다음으로 proxy 방식이다

이 방식은 직접 객체를 다루지 않고, 프록시를 통해 작업을 수행한다는 특징이 있다.
이러한 이유로 proxy방식은 중첩된 객체의 상태 관리에 유용하다.
일반적으로 중첩된 객체의 상태를 관리하려면 상태를 복사하고, 속성을 수정하고, 수정한 상태를 다시 덮어쓰는 과정이 필요하지만 해당방식은 프록시를 통해 상태를 직접 변경할 수 있기에 중첩 객체 상태 관리가 훨씬 수월하다는 특징이 있다.

이 방식의 예로는 **MobX**가 있다.

### 🔥 atomic 방식

이 방식은 상태를 Atom 으로 나눈다는 것이 특징이다
Atom이란 업데이트 가능하고 구독 가능한 상태의 단위이며, 이들은 서로 다른 부분에서 독립적으로 사용된다.
이러한 이유로 상태 관리의 모듈화가 쉽고, 코드의 재사용성이 높아진다는 특징이 있지만, 상태가 단순하고 재사용의 필요성이 낮을 경우, 오히려 더 복잡해질 수 있다는 점도 존재한다.

이 방식의 예로는 **Recoil**, **Jotai** 가 존재한다

### 🤔 어떠한 라이브러리가 적합할까..?

일단 나는 위 방식을 보고 **Zustand**와 **Jotai**를 골라서 조금 더 알아보기로 하였다!
(redux의 경우, 단기간에 진행해야하는 프로젝트 특성상 다시 배워서 한다는 점이 꺼려졌고, recoil의 경우 Jotai에 비해 보일러플레이트(key값을 넣어주어야함)가 미세하게 존재한다는 것과 Jotai에 비해 활발하게 업데이트가 이루어지지 않는다는 점에서 위 2개의 라이브러리를 선택하였다)
(공부할겸 겸사겸사 안사용해봤던 라이브러리에 대해 알아보고 직접사용해보고 싶었던 이유도 있다 😁)

### 👉🏻 Zustand & Jotai 비교

#### 1️⃣ Zustand

![](https://velog.velcdn.com/images/cllaude/post/a9f7f75e-10c5-42d3-85b3-9131d9fdf4a6/image.png)

먼저 **Zustand**에 대해서 알아보자!

> **Zustand**는 보일러 플레이트가 최소화된 상태관리 라이브러리이며, Store 형태임에도 굉장히 간단하게 상태관리 구성이 가능하다는 특징이 있다.

**Zustand**의 장점으로는 아래와 같다 💪

- store 구현 방식으로 인해 보일러플레이트 코드가 매우 줄어든다.

- Provider로 감쌀 필요가 없고, context 방식보다 리렌더링이 줄어든다.

<br/>

#### 다음은 Zustand를 사용하여 간단한 To-Do를 만들어본 코드이다.

> [공식문서](https://zustand-demo.pmnd.rs/)에 되게 자세하게 나와있어서 참고해보면 좋을 것 같다

`Zustand_Store.js`

```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useMovieListStore = create(
  persist(
    (set, get) => ({
      MovieList: [],
      // 새로운 영화를 추가하는 함수
      setMovieList: (newMovie) =>
        set({ MovieList: [...get().MovieList, newMovie] }),
      // 봤던 영화들에 추가해주는 함수
      onClickAddWatched: (id) =>
        set({
          MovieList: get().MovieList.map((movie) =>
            movie.id !== id ? movie : { ...movie, watched: true }
          ),
        }),
      // 영화목록에서 해당 id값에 해당하는 영화를 삭제하는 함수
      onClickDeleteMovie: (id) =>
        set({
          MovieList: get().MovieList.filter((movie) => movie.id !== id),
        }),
      // 좋아하는 영화들에 추가해주는 함수
      onClickAddLike: (id) =>
        set({
          MovieList: get().MovieList.map((movie) =>
            movie.id !== id ? movie : { ...movie, like: true }
          ),
        }),
      // 봤던 영화목록에서 제거하는 함수
      onClickRemoveWatched: (id) =>
        set({
          MovieList: get().MovieList.map((movie) =>
            movie.id !== id ? movie : { ...movie, watched: false }
          ),
        }),
      // 👎를 클릭할때 트리거되는 함수로 좋아하는 영화목록에서 제거하는 함수
      onClickUnLike: (id) =>
        set({
          MovieList: get().MovieList.map((movie) =>
            movie.id !== id ? movie : { ...movie, like: false }
          ),
        }),
    }),
    {
      name: 'MovieList', // name of the item in the storage (must be unique)
    }
  )
);
```

`HomeZustand.jsx`

```javascript
import Buttton from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { formSchema } from '@/constants/formSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { MOVIE_TYPE } from '@/constants/movieType';
import ZustandMovieList from '@/components/ZustandMovieList';
import { useMovieListStore } from '@/stores/Zustand_Store';

// Zustand 사용 버전
export default function HomeZustand() {
  const setMovieList = useMovieListStore((state) => state.setMovieList);
  const [formLoading, setLoading] = useState(false); // form 처리완료를 확인하는 변수
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(formSchema),
  });

  /**
   * form유효성 검사를 위한 함수
   * @param data // form안에 적은 항목들을 받아오는 객체
   */
  const onValid = (data) => {
    // 처리중인 상태
    setLoading(true);

    // 새로운 영화를 추가하는 과정
    setMovieList({
      id: Date.now(),
      watched: false,
      like: false,
      movieName: data.movieName,
    });

    // 영화제목 입력칸 초기화
    setValue('movieName', '');

    // 처리완료된 상태
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen mx-auto text-white bg-black">
      <div className="flex flex-col w-screen max-w-3xl gap-4 p-5 my-5">
        <h1 className="title">내가 보고싶은 영화들</h1>
        <form onSubmit={handleSubmit(onValid)} className="flex flex-col gap-3">
          <input
            {...register('movieName')}
            placeholder="영화 제목"
            className="w-2/5 text-white bg-transparent border-none rounded-md ring-1 ring-white focus:ring-2 focus:ring-white"
          />
          {errors.movieName && (
            <ErrorMessage errorMessage={errors.movieName.message} />
          )}
          <Buttton text="Add Movie" pending={formLoading} />
        </form>
        <ZustandMovieList type={MOVIE_TYPE.WANNA_WATCH} />

        <h1 className="title">내가 봤던 영화들</h1>
        <ZustandMovieList type={MOVIE_TYPE.WATCHED} />

        <h1 className="title">내가 좋아하는 영화들</h1>
        <ZustandMovieList type={MOVIE_TYPE.LIKE} />
      </div>
    </div>
  );
}
```

`ZustandMovieList.jsx`

```javascript
import PropTypes from 'prop-types';
import { MOVIE_TYPE } from '@/constants/movieType';
import { useEffect, useState } from 'react';
import { useMovieListStore } from '@/stores/Zustand_Store';

ZustandMovieList.propTypes = {
  type: PropTypes.string,
};

export default function ZustandMovieList({ type }) {
  const movieList = useMovieListStore((state) => state.MovieList);
  const {
    onClickAddWatched,
    onClickDeleteMovie,
    onClickAddLike,
    onClickRemoveWatched,
    onClickUnLike,
  } = useMovieListStore();
  const [movies, setMovies] = useState(null);

  // type에 따라 moives변수를 초기화하는 과정
  useEffect(() => {
    setMovies(getMovieByType(type));
  }, [type, movieList]);

  // type에 따라 알맞는 atom을 반환해주는 과정
  const getMovieByType = (type) => {
    switch (type) {
      case MOVIE_TYPE.WANNA_WATCH:
        return movieList.filter((movie) => !movie.watched && !movie.like);
      case MOVIE_TYPE.WATCHED:
        return movieList.filter((movie) => movie.watched && !movie.like);
      case MOVIE_TYPE.LIKE:
        return movieList.filter((movie) => movie.like);
    }
  };

  return (
    <ul>
      {movies?.map((movie) => (
        <li key={movie.id} className="flex">
          <h4 className="mr-4">{movie.movieName}</h4>
          {type === MOVIE_TYPE.WANNA_WATCH ? (
            <>
              <button
                onClick={() => onClickAddWatched(movie.id)}
                className="mr-2"
              >
                ✅
              </button>
              <button onClick={() => onClickDeleteMovie(movie.id)}>🗑️</button>
            </>
          ) : type === MOVIE_TYPE.WATCHED ? (
            <>
              <button onClick={() => onClickAddLike(movie.id)} className="mr-2">
                👍
              </button>
              <button onClick={() => onClickRemoveWatched(movie.id)}>❌</button>
            </>
          ) : (
            <button onClick={() => onClickUnLike(movie.id)} className="mr-2">
              👎
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
```

#### 2️⃣ Jotai

![](https://velog.velcdn.com/images/cllaude/post/2a251ce9-72c1-4171-919e-c32ccb4941f8/image.png)

다음으로 **Jotai**에 대해 알아보자!

> **Jotai** 는 Context의 re-rendering 문제를 해결하기 위해 만들어진 React 특화 상태관리 라이브러리로 Recoil 에서 영감을 받아, atomic 한 상태관리 방식으로 구성되었다. (**bottom-up 방식**)

**Jotai**의 장점으로는 아래와 같다 💪

- 기본적으로 re-rendering 문제를 줄여주고, selectAtom, splitAtom 과 같은 re-rendering 을 줄이기 위한 유틸들도 지원한다.

- 보일러 플레이트 코드가 redux에 비하면 현저하게 줄어든다.

- 앞으로 React 의 주요 feature일 Suspense(Concurrent mode)를 적용하는데에 적합하게 설계되었다.

<br/>

#### 다음은 Jotai를 사용하여 간단한 To-Do를 만들어본 코드이다.

> [공식문서](https://jotai.org/)에 되게 자세하게 나와있어서 참고해보면 좋을 것 같다

`Jotai_Atom.js`

```javascript
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// 영화 목록 상태 + localstorage저장을 위해 atomWithStorage사용함
export const MyMovieList = atomWithStorage('MovieList', []);

// 보고싶은 영화 atom
export const WANNA_WATHCH_LIST = atom((get) =>
  get(MyMovieList).filter((movie) => !movie.watched && !movie.like)
);

// 봤던 영화 atom
export const WATCHED_LIST = atom((get) =>
  get(MyMovieList).filter((movie) => movie.watched && !movie.like)
);

// 좋아하는 영화 atom
export const LIKE_LIST = atom((get) =>
  get(MyMovieList).filter((movie) => movie.like)
);
```

`HomeJotai.jsx`

```javascript
import Buttton from '@/components/Button';
import ErrorMessage from '@/components/ErrorMessage';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { formSchema } from '@/constants/formSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSetAtom } from 'jotai';
import { MyMovieList } from '../stores/Jotai_Atom';
import JotaiMovieList from '@/components/JotailMovieList';
import { MOVIE_TYPE } from '@/constants/movieType';

// Jotai 사용 버전
export default function HomeJotai() {
  const setMovieList = useSetAtom(MyMovieList); // Jotai atom에 저장된 영화 목록을 수정하는 함수

  const [formLoading, setLoading] = useState(false); // form 처리완료를 확인하는 변수
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(formSchema),
  });

  /**
   * form유효성 검사를 위한 함수
   * @param data // form안에 적은 항목들을 받아오는 객체
   */
  const onValid = (data) => {
    // 처리중인 상태
    setLoading(true);

    // Jotai atom에 해당 영화제목을 등록하는 과정
    setMovieList((prev) => {
      const newMovie = {
        id: Date.now(),
        watched: false,
        like: false,
        movieName: data.movieName,
      };
      return [...prev, newMovie];
    });

    // 영화제목 입력칸 초기화
    setValue('movieName', '');

    // 처리완료된 상태
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen mx-auto text-white bg-black">
      <div className="flex flex-col w-screen max-w-3xl gap-4 p-5 my-5">
        <h1 className="title">내가 보고싶은 영화들</h1>
        <form onSubmit={handleSubmit(onValid)} className="flex flex-col gap-3">
          <input
            {...register('movieName')}
            placeholder="영화 제목"
            className="w-2/5 text-white bg-transparent border-none rounded-md ring-1 ring-white focus:ring-2 focus:ring-white"
          />
          {errors.movieName && (
            <ErrorMessage errorMessage={errors.movieName.message} />
          )}
          <Buttton text="Add Movie" pending={formLoading} />
        </form>
        <JotaiMovieList type={MOVIE_TYPE.WANNA_WATCH} />

        <h1 className="title">내가 봤던 영화들</h1>
        <JotaiMovieList type={MOVIE_TYPE.WATCHED} />

        <h1 className="title">내가 좋아하는 영화들</h1>
        <JotaiMovieList type={MOVIE_TYPE.LIKE} />
      </div>
    </div>
  );
}
```

`JotailMovieList.jsx`

```javascript
import PropTypes from 'prop-types';
import { MOVIE_TYPE } from '@/constants/movieType';
import { useEffect, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
  LIKE_LIST,
  MyMovieList,
  WANNA_WATHCH_LIST,
  WATCHED_LIST,
} from '../stores/Jotai_Atom';

JotaiMovieList.propTypes = {
  type: PropTypes.string,
};

export default function JotaiMovieList({ type }) {
  const [movieList, setMovieList] = useAtom(MyMovieList);
  const wannaWatchList = useAtomValue(WANNA_WATHCH_LIST); // 보고싶은 영화 목록
  const watchedList = useAtomValue(WATCHED_LIST); // 봤던 영화 목록
  const likeList = useAtomValue(LIKE_LIST); // 좋아하는 영화목록

  const [movies, setMovies] = useState(null);

  // type에 따라 moives변수를 초기화하는 과정
  useEffect(() => {
    setMovies(getMovieByType(type));
  }, [type, movieList]);

  // type에 따라 알맞는 atom을 반환해주는 과정
  const getMovieByType = (type) => {
    switch (type) {
      case MOVIE_TYPE.WANNA_WATCH:
        return wannaWatchList;
      case MOVIE_TYPE.WATCHED:
        return watchedList;
      case MOVIE_TYPE.LIKE:
        return likeList;
    }
  };

  // 봤던 영화들에 추가해주는 함수
  const onClickAddWatched = (id) => {
    setMovieList((prev) =>
      prev.map((movie) =>
        movie.id !== id ? movie : { ...movie, watched: true }
      )
    );
  };

  // 영화목록에서 해당 id값에 해당하는 영화를 삭제하는 함수
  const onClickDeleteMovie = (id) => {
    setMovieList((prev) => prev.filter((movie) => movie.id !== id));
  };

  // 좋아하는 영화들에 추가해주는 함수
  const onClickAddLike = (id) => {
    setMovieList((prev) =>
      prev.map((movie) => (movie.id !== id ? movie : { ...movie, like: true }))
    );
  };

  // 봤던 영화목록에서 제거하는 함수
  const onClickRemoveWatched = (id) => {
    setMovieList((prev) =>
      prev.map((movie) =>
        movie.id !== id ? movie : { ...movie, watched: false }
      )
    );
  };

  // 👎를 클릭할때 트리거되는 함수로 좋아하는 영화목록에서 제거하는 함수
  const onClickUnLike = (id) => {
    setMovieList((prev) =>
      prev.map((movie) => (movie.id !== id ? movie : { ...movie, like: false }))
    );
  };

  return (
    <ul>
      {movies?.map((movie) => (
        <li key={movie.id} className="flex">
          <h4 className="mr-4">{movie.movieName}</h4>
          {type === MOVIE_TYPE.WANNA_WATCH ? (
            <>
              <button
                onClick={() => onClickAddWatched(movie.id)}
                className="mr-2"
              >
                ✅
              </button>
              <button onClick={() => onClickDeleteMovie(movie.id)}>🗑️</button>
            </>
          ) : type === MOVIE_TYPE.WATCHED ? (
            <>
              <button onClick={() => onClickAddLike(movie.id)} className="mr-2">
                👍
              </button>
              <button onClick={() => onClickRemoveWatched(movie.id)}>❌</button>
            </>
          ) : (
            <button onClick={() => onClickUnLike(movie.id)} className="mr-2">
              👎
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
```

**Zustand** 와 **Jotai**를 사용하여 간단한 To-Do형식을 만들어 보았고, 모두 기본적으로 localStorage에 저장되도록 하였다.

### ✅ 결론

사용하면서 느껴본 차이점으로는
**Zustand**의 경우 하나의 store 안에 여러 상태들이 담기는 반면,
**Jotai**는 각각의 상태가 atom 형태로 흩어져 있다는 특징이 있었다.

우리의 프로젝트의 경우 상태가 단순하고 재사용의 필요성이 낮을 것으로 판단하였고, 이에 따라 **Jotai**보다는 **Zustand**가 적합할 것 같아서 **Zustand**를 선택하게 되었다.

### ✅ 회고

상태관리 라이브러리에 대해 알아본 좋은 시간이었던 것 같다.
단순히 어떤 상태관리 라이브러리를 써야지가 아니라, 현재 하고있는 프로젝트에 상태관리가 필요한지, 어떠한 상태관리 라이브러리 들이 있으며 각각의 특징이 무엇인지에 대해서 알아보고, 진행하고 있는 프로젝트에 맞는 라이브러리를 고르는 과정이 의미있었다!
또한 이 과정에서 앞으로도 어떠한 작업을 할때에 왜 그렇게 행동하였는지에 대해 고민하고, 그렇게 진행한 이유에 대해 말할 수 있는 사람이 되었으면 좋겠다고 생각하였다 :)

### 레퍼런스

> [Flux Overview](https://haruair.github.io/flux/docs/overview.html)
> [Zustand & Jotai 비교](https://programming119.tistory.com/263)
