---
emoji: 🪄
title: 'TailwindCSS 어떻게 하면 더 잘 사용할 수 있을까?'
date: '2025-03-09'
categories: featured-Dev
---

## TailwindCSS 어떻게 하면 더 잘 사용할 수 있을까?

![](tailwindcss.webp)

해당 글은 tailwindcss를 사용하여 프로젝트를 진행하던 중 느꼈던 불편함과 해결 방법에 대해 정리한 글입니다.

[syncspot프로젝트](https://syncspot.kr/) 에서 tailwindcss를 사용하여 스타일링을 진행했습니다. 개발을 완료한 후 최종 서비스 출시를 앞두고 디자이너분과 함께 서비스의 전반적인 디자인을 수정하는 작업을 진행하였습니다.

이 과정에서 추가적인 디자인 수정 요청에 의해 특정 페이지의 몇몇 컴포넌트 (button, input 등)에 대한 디자인을 변경하는 과정이 있었습니다. (ex. 회원가입 페이지에서 버튼 색상 변경 등)

문제는 여기서 발생했습니다.

디자이너분의 요청 사항에 따라 특정 페이지에서 사용되는 button, input 등의 디자인을 변경해야 하는 경우가 있었는데 이 경우마다 해당하는 파일의 코드를 찾아 직접 수정해야 했습니다.
(즉 수정이 필요한 파일에 찾아가 직접 코드를 하나하나 수정해야 했습니다.)

많은 시간이 소요되기는 했지만, 서비스 출시를 앞두고 있던 상황이기에 1시간 정도에 걸쳐 작업을 완료하였습니다.

> 하지만, 출시 이후 리팩토링 과정에서 해당 부분이 계속 눈에 밟혔습니다.

분명 더 잘 쓰는 방법이 있을텐데... 이후 디자인 수정이 있을 경우에도 이렇게 해야 하나? 서비스가 지금보다 커지게 되면 다른 컴포넌트도 많아지고 이에 따라 자연스럽게 코드도 늘어나게 될텐데 이렇게 되면 더 힘들어 지지는 않을까? 특정 조건에 따라 다른 스타일을 어떻게 줄 수 있을까? 등에 대한 고민이 있었습니다.

> 이 과정에서 tailwindcss를 더 잘 사용해보고 싶다는 욕구가 들었고, 그 과정에서 찾아보고 적용한 내용들을 정리해보고자 합니다.

수정하기 쉬운 코드를 만들기 위해 구글링을 통해 찾아본 결과 `cva`, `clsx`, `twmerge`에 대해서 알게 되었고 이를 적용해 보았습니다.

## clsx

clsx는 조건부로 className을 처리할 수 있게 해주는 유틸리티 라이브러리입니다.

```tsx
import { clsx } from 'clsx';

clsx('w-full', true && 'h-full', { 'px-4': true, 'py-2': false }, [
  'flex',
  'items-center',
]);
// => 'w-full h-full px-4 flex items-center'
```

위와 같이 특정 조건에 따라 다른 스타일을 적용할 수 있습니다.

## tailwind-merge (twMerge)

tailwind-merge는 className 충돌을 방지해주는 라이브러리입니다. 다음과 같이 Tailwind CSS 클래스들이 중복될 때 마지막에 선언된 클래스를 우선으로 적용합니다.

```javascript
import { twMerge } from 'tailwind-merge';

twMerge('px-2 py-1 bg-red-600 p-3 bg-grey-800');
// => 'p-3 bg-grey-800'
```

## cva (Class Variance Authority)

cva는 컴포넌트의 variant(변형)를 쉽게 관리할 수 있게 해주는 라이브러리입니다. props에 따라 다른 스타일을 적용해야 할 때 유용합니다.

```javascript
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  // 기본 클래스
  'flex items-center justify-center rounded-md',
  {
    variants: {
      variant: {
        primary: 'bg-blue-500 text-white',
        secondary: 'bg-gray-200 text-gray-800',
      },
      size: {
        sm: 'text-sm px-2 py-1',
        lg: 'text-lg px-4 py-2',
      },
    },

    defaultVariants: {
      variant: 'primary',
      size: 'sm',
    },
  }
);
```

이를 통해 최종적으로 `clsx`를 통해 조건부 스타일링을 적용하고, `cva`를 사용하여 컴포넌트의 variant로 상황에 맞는 디자인을 입힌 후, 예외가 되는 상황에서는 `twMerge`를 사용하여 뒤에 오는 스타일을 우선하여 적용하면 되겠다고 생각했습니다.

따라서 위의 clsx, cva, twMerge를 사용하여 공통 버튼 컴포넌트를 다음과 같이 구현했습니다.

먼저 `cva`를 사용하여 버튼의 기본 스타일과 variants를 정의했습니다:

```javascript
import { ButtonHTMLAttributes } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { mergeClassNames } from '../../../utils/mergeClassNames';

export const ButtonVariants = cva(
  `
  flex items-center justify-center  
  w-[26.25rem] h-[3.4375rem] py-[1.125rem] px-[12.3125rem]
  rounded-default text-white-default truncate
  disabled:cursor-not-allowed
  disabled:bg-disabled
  disabled:border-disabled
  disabled:text-white-default
  `,
  {
    variants: {
      buttonType: {
        primary: 'bg-primary hover:bg-secondary',
        secondary: 'bg-gray-normal hover:bg-gray-400',
        quit: 'bg-gray-normal enabled:bg-red-normal',
      },
      fontSize: {
        default: 'text-content lg:text-menu',
      },
    },
    defaultVariants: {
      buttonType: 'primary',
      fontSize: 'default',
    },
  }
);

interface IButtonProps
  extends VariantProps<typeof ButtonVariants>,
    ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export default function Button({
  buttonType,
  fontSize,
  className,
  children,
  onClick,
  isLoading,
  disabled,
}: IButtonProps) {
  return (
    <button
      className={mergeClassNames(
        ButtonVariants({ buttonType, fontSize, className })
      )}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? '잠시만 기다려 주세요...' : children}
    </button>
  );
}
```

위와 같이 variants를 통해 primary, secondary, quit 타입의 버튼을 정의할 수 있도록 하였습니다.

> 이후 클래스 병합을 위해 유틸리티 함수를 만들었습니다.

`clsx`와 `tailwind-merge`를 확장하여 프로젝트의 커스텀 클래스들을 처리할 수 있는 유틸리티 함수를 만들었습니다.

초기에는 아래의 코드와 같이 `mergeClassNames.ts` 파일을 만들었습니다.

`mergeClassNames.ts`

```javascript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function mergeClassNames(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

위처럼 clsx와 twMerge를 사용하여 입력으로 받은 inputs문자열에 대해 조건부 스타일링 처리를 완료한 후, 충돌을 방지하기 위해 뒤에 오는 스타일을 우선시 하도록 하는 twMerge를 사용하였습니다.

> 이 과정에서 또 다른 문제를 마주쳤습니다.

text-white-default 와 text-content는 각각 색상과 폰트를 의미하는 클래스명 입니다. 따라서 해당 클래스명들을 적용할 경우, 1rem 크기(text-content)의 하얀색 글씨가 나올 것이라고 예상하였습니다.

하지만 실제로는 1rem 크기의 하얀색 글씨가 아닌 1rem 크기의 검정 글씨(기본 색상)가 나왔습니다. 화면에 적용된 css를 확인해보기 위해 크롬의 개발자 도구를 확인해보니 text-white-default 부분이 사라진 것을 확인하였습니다.

즉, 같은 prefix를 가진 text-whiet-default와 text-content가 충돌했고, 병합 과정에서 뒤에 오는 text-content가 채택되게 된 상황이었습니다.

이를 해결하기 위해 근본적으로 twMerge를 사용하는 방법에 대해 찾아보던 중 [twMerge](https://github.com/dcastil/tailwind-merge/blob/v2.4.0/docs/configuration.md)의 깃허브 글을 통해 해결 방법을 확인할 수 있었고 아래와 같이 customTwMerge를 만들어 적용하였습니다. (twmerge를 사용해야 하는 이유, 사용안해야하는 이유에 대해 알고 싶다면 [여기](https://github.com/dcastil/tailwind-merge/blob/v2.4.0/docs/configuration.md) 를 참고하면 좋을 것 같습니다.)

이를 참고하여 아래와 같이 `mergeClassName.ts` 파일을 수정하였습니다.

수정된 `mergeClassName.ts`

```javascript
import { extendTailwindMerge } from 'tailwind-merge';

export const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'logo',
            'title',
            'subtitle',
            'menu',
            'menu-selected',
            'content',
            'content-bold',
            'description',
          ],
        },
      ],
      'bg-color': [
        {
          background: [
            'primary',
            'secondary',
            'tertiary',
            'disabled',
            'error-light',
            'error-normal',
            'overlay',
          ],
        },
      ],
      'text-color': [
        {
          text: [
            'primary',
            'secondary',
            'tertiary',
            'error-light',
            'error-normal',
            'white-default',
            'black-default',
          ],
        },
      ],
      'border-color': [
        {
          border: [
            'primary',
            'secondary',
            'tertiary',
            'disabled',
            'error-light',
            'error-normal',
            'gray-light',
            'gray-normal',
            'gray-dark',
          ],
        },
      ],
      fill: [
        {
          fill: [
            'primary',
            'secondary',
            'tertiary',
            'disabled',
            'error-light',
            'error-normal',
          ],
        },
      ],
      rounded: [
        {
          rounded: ['default', 'login'],
        },
      ],
      shadow: [
        {
          shadow: ['default', 'focus'],
        },
      ],
      animate: [
        {
          animate: [
            'slideDown',
            'slideUp',
            'slideInRight',
            'slideOutRight',
            'fadeIn',
            'fadeOut',
          ],
        },
      ],
    },
  },
});
```

위와 같이 기본적으로 테일윈드에서 제공하는 스타일이 아닌 사용자가 커스텀해서 사용하는 클래스명에 대해서는 extendTailwindMerge를 사용하여 prefix에 따른 충돌을 방지하도록 하였습니다. (이후에도 커스텀 스타일이 추가되는 경우 customTwMerge의 extend-classGroups에 커스텀 스타일을 추가하면 됩니다.)

이러한 구현을 통해 최종적으로 처음에 겪었던 디자인 수정 작업의 어려움을 크게 개선할 수 있었습니다. 특정 페이지의 버튼 스타일을 변경해야 할 경우, 이제는 해당 컴포넌트에서 variant의 스타일만 변경하면 되어 작업 시간이 크게 단축되었습니다. 예외적인 스타일이 있다고 하더라도 twMerge에 의해 뒤에 오는 클래스명이 우선시 되기 때문에 예외적인 스타일링 처리에 대해 더욱 잘 처리할 수 있게 되었습니다.
