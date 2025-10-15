# Error

- Next.js 에서 에러를 처리하는 `error.tsx` 가 존재함.
- 파일명이 고정되어 있음.
- 각 페이지 라우터 별로 error.tsx 를 생성가능함.

## 1. 파일 생성

- `/src/app/(with-search)/error.tsx 파일` 생성

## 2. 주의사항

- 반드시 서버 뿐만 아니라 클라링언트 측 에러에도 처리하도록 한다.
- `"use client"` 를 반드시 작성해 주자.

```tsx
"use client";

function error() {
  return <div>에러가 발생했습니다.</div>;
}

export default error;
```

## 3. 자동으로 에러 메시지를 출력하는 경우

```tsx
"use client";

function error({ error }: { error: Error }) {
  return <div>{error.message}에러가 발생했습니다.</div>;
}

export default error;
```

## 4. 에러가 발생하면 다시 실행하도록 함수도 전달해줌.

- reset 함수 : 용도가 제한 되어져 있음.
- 서버를 다시 실행하는 것이 아님.
- 오로지 리랜더링만 실행함. (백엔드 데이터 호출 없음)
- 에러 상태만 초기화하고 컴포넌트를 리랜더링만 함.
- `추천하지 않음.`

```tsx
"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error;
  reset: () => void;
}
function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.log(error.message);
  }, []);
  return (
    <div>
      <h3>{error.message} 에러가 발생했습니다.</h3>
      <button onClick={reset}>다시 시도</button>
    </div>
  );
}

export default Error;
```

## 5. 강제로 새로고침을 권장함.

- 웹브라우저를 새로고침하도록 하여 데이터 호출부터 다시시작
- `window.location.reload()` 권장함.

```tsx
"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error;
  reset: () => void;
}
function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.log(error.message);
  }, []);
  return (
    <div>
      <h3>{error.message} 에러가 발생했습니다.</h3>
      {/* <button onClick={reset}>다시 시도</button> */}
      <button onClick={() => window.location.reload()}>다시 시도</button>
    </div>
  );
}

export default Error;
```

## 6. router.refresh() 활용해 보기

- 웹브라우저 강제 새로고침은 state가 초기화 될 소지 있음.
- Next 서버에게 현재 페이지에 필요로 한 `서버 컴포넌트들을 다시 실행하도록 함.`
- 비동기로 작동됨.( await 은 안된다.)
- reset() 을 통해 에러상태를 초기화하고 다시 컴포넌트를 리랜더링 해준다.

```tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ErrorProps {
  error: Error;
  reset: () => void;
}
function Error({ error, reset }: ErrorProps) {
  const router = useRouter(); // next/navigation

  useEffect(() => {
    console.log(error.message);
  }, []);
  return (
    <div>
      <h3>{error.message} 에러가 발생했습니다.</h3>
      {/* <button onClick={reset}>다시 시도</button> */}
      {/* <button onClick={() => window.location.reload()}>다시 시도</button> */}
      <button
        onClick={() => {
          router.refresh(); // 서버  컴포넌트 다시 실행
          reset(); // 에러 초기화, 리랜더링
        }}
      >
        다시 시도
      </button>
    </div>
  );
}

export default Error;
```

## 7. startTransition 활용해 보기

- React 18버전 후반에 추가된 기능
- 콜백함수를 인자로 콜백함수 안쪽에 UI 작업을 다시 동시에 처리해줌.

```tsx
"use client";

import { useRouter } from "next/navigation";
import { startTransition, useEffect } from "react";

interface ErrorProps {
  error: Error;
  reset: () => void;
}
function Error({ error, reset }: ErrorProps) {
  const router = useRouter(); // next/navigation

  useEffect(() => {
    console.log(error.message);
  }, []);
  return (
    <div>
      <h3>{error.message} 에러가 발생했습니다.</h3>
      {/* <button onClick={reset}>다시 시도</button> */}
      {/* <button onClick={() => window.location.reload()}>다시 시도</button> */}
      <button
        onClick={() => {
          startTransition(() => {
            router.refresh(); // 서버  컴포넌트 다시 실행
            reset(); // 에러 초기화, 리랜더링
          });
        }}
      >
        다시 시도
      </button>
    </div>
  );
}

export default Error;
```
