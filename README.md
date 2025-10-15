# Server Action

## 1. 일반적인 API 작업 과정 시나리오

- 1 단계 : 웹브라우저에서 BE 서버로 호출하는 비동기 함수
- 2 단계 : BE 에서 DB로 자료를 처리해서 돌려줌.
- 3 단계 : BE 에서 처리 완료 후 웹브라우저로 자료를 리턴함.
- 4 단계 : FE 에서 화면을 출력함.

## 2. Next.js 의 `Server Action` 의 작업 과정 시나리오

- 1 단계 : 웹브라우저에서 BE 서버로 호출하는 비동기 함수
- 2 단계 : Next 서버가 DB에 자료 처리 후 돌려줌.
- 3 단계 : FE 에서 화면을 출력함.

## 3. 수업용

### 3.1. html 이라면

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <form action="/login.do" method="get">
      <input type="text" name="haha" placeholder="리뷰내용" />
      <input type="text" name="kiki" placeholder="작성자" />
      <button type="submit">작성하기</button>
    </form>
  </body>
</html>
```

### 3.2. 만약 React 또는 클라이언트 컴포넌트라면

- http://localhost:3000/test
- `/src/app/test` 폴더 생성
- `/src/app/test/page.tsx` 파일 생성

```tsx
"use client";
import { FormEvent, useState } from "react";

function page() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 새로고침 방지
    // Form 의 데이터를 읽어보자
    const formData: FormData = new FormData(e.currentTarget);
    const haha = formData.get("haha") as string;
    const kiki = formData.get("kiki") as string;
    if (!haha.trim()) {
      return;
    }
    if (!kiki.trim()) {
      return;
    }
    const response = fetch(`/login.do?kiki=${kiki}&haha=${haha}`);
  };
  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input type="text" name="haha" placeholder="리뷰내용" />
        <input type="text" name="kiki" placeholder="작성자" />
        <button>작성하기</button>
      </form>
    </div>
  );
}

export default page;
```

### 3.3. Next의 Action 으로 수정을 한다면

```tsx
function page() {
  const handleSubmit = (formData: FormData) => {
    // 일반적으로 아래의 내용을 actions 폴더의 외부 파일로 추출해서 배치한다.
    "use server";
    // Form 의 데이터를 읽어보자
    const haha = formData.get("haha") as string;
    const kiki = formData.get("kiki") as string;
    if (!haha.trim()) {
      return;
    }
    if (!kiki.trim()) {
      return;
    }
    const response = fetch(`/login.do?kiki=${kiki}&haha=${haha}`);
  };
  return (
    <div>
      <form action={handleSubmit}>
        <input type="text" name="haha" placeholder="리뷰내용" />
        <input type="text" name="kiki" placeholder="작성자" />
        <button>작성하기</button>
      </form>
    </div>
  );
}

export default page;
```

## 4. Action 적용해보기

- `/src/app/good/[id]/page.tsx` 업데이트
