# Server Action

- `form 태그의 action 에서 실행`함. (가장 많이 사용)
- 보안상 유리함. (웹브라우저 노출 위험 줄어든다)
- 코드가 명확함. (useState 류를 사용안함)

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

### 3.3. Next의 `Server Action` 으로 수정을 한다면

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

## 4. Server Action 적용해보기

- `/src/app/good/[id]/page.tsx` 업데이트

### 4.1. 서버 액션 실행 컴포넌트 예제

- use server 부분 파악
- formData 를 파악하는 법 파악

```tsx
function ReviewForm() {
  // Action 용 함수
  async function createReviewAction(formData: FormData) {
    "use server";
    // form 에 있는 값을 읽기
    //console.log(formData); // FormData { content: 'aaa', author: 'bbb' }
    // 혹시 데이터가 없으면 null 인데 아래처럼 처리가 옳은가?
    // const content = formData.get("content") as string;
    // const author = formData.get("author") as string;
    // 조금 더 안전한 코드. 앞에것이 맞으면 글자로 바꾼다라는 코드.
    // 아래가 null 도 담을 수 있고 as보다 좋다.
    const title = formData.get("title")?.toString();
    const price = formData.get("price")?.toString();
    const description = formData.get("description")?.toString();
    const image = formData.get("image")?.toString();
    const category = formData.get("category")?.toString();
    // 간단한 예외처리
    if (!title || !price || !description || !image || !category) {
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products`,
        {
          method: "POST",
          body: JSON.stringify({ title, price, description, image, category }),
        }
      );

      // 서버에서 출력됨
      console.log("상품 리뷰 등록 성공", response);
      const { id } = await response.json();
      console.log("상품 리뷰 등록 결과 id : ", id);
    } catch (error) {
      // 서버에서 에러 메시지 출력 (웹브라우저 아님)
      console.log(error);
    }
  }
  return (
    <section>
      <form action={createReviewAction}>
        <input
          required
          name="title"
          placeholder="제품명"
          defaultValue={"test product"}
        />
        <input required name="price" placeholder="가격" defaultValue={"13.5"} />
        <input
          required
          name="description"
          placeholder="제품설명"
          defaultValue={"product description"}
        />
        <input
          required
          name="image"
          placeholder="제품이미지"
          defaultValue={"https://i.pravatar.cc"}
        />
        <input
          required
          name="category"
          placeholder="제품카테고리"
          defaultValue={"jually"}
        />
        <button>작성하기</button>
      </form>
    </section>
  );
}
```

### 4.2. 실무적으로 actions 에 Server Action 들을 모아서 관리

- form 태그에서 action 으로 실행할 것들(Create 부분들)
- `/src/actions 폴더` 생성
- `/src/actions/create-review-action.ts 파일` 생성
- 관례상 `"use server"` 는 최상단에 배치함.

```ts
"use server";
// Action 용 함수
export async function createReviewAction(formData: FormData) {
  const title = formData.get("title")?.toString();
  const price = formData.get("price")?.toString();
  const description = formData.get("description")?.toString();
  const image = formData.get("image")?.toString();
  const category = formData.get("category")?.toString();
  // 간단한 예외처리
  if (!title || !price || !description || !image || !category) {
    return;
  }
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products`,
      {
        method: "POST",
        body: JSON.stringify({ title, price, description, image, category }),
      }
    );

    // 서버에서 출력됨
    console.log("상품 리뷰 등록 성공", response);
    const { id } = await response.json();
    console.log("상품 리뷰 등록 결과 id : ", id);
  } catch (error) {
    // 서버에서 에러 메시지 출력 (웹브라우저 아님)
    console.log(error);
  }
}
```

- 호출

```tsx
import { createReviewAction } from "@/actions/create-review-action";
import styles from "@/app/good/[id]/page.module.css";
import { GoodDataType } from "@/types/types";
import Image from "next/image";

// 제품 상세 정보 출력 컴포넌트 :  components 에 별도로 추출하길 권장
interface GoodDetailProps {
  id: string;
}
async function GoodDetail({ id }: GoodDetailProps) {
  // fetch 를 이용한 자료 출력
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`
  );

  const good: GoodDataType = await response.json();
  const { title, image, category, description, rating } = good;

  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      <div
        className={styles.image}
        style={{ backgroundImage: `url(${image})` }}
      >
        <Image src={image} alt={title} width={245} height={350} />
      </div>
      <div className={styles.category}>{category}</div>
      <div className={styles.rating}>
        Rating: {rating.rate} | {rating.count}
      </div>
      <div className={styles.description}>{description}</div>
    </div>
  );
}

// 입력폼 components 추출
function ReviewForm() {
  return (
    <section>
      <form action={createReviewAction}>
        <input
          required
          name="title"
          placeholder="제품명"
          defaultValue={"test product"}
        />
        <input required name="price" placeholder="가격" defaultValue={"13.5"} />
        <input
          required
          name="description"
          placeholder="제품설명"
          defaultValue={"product description"}
        />
        <input
          required
          name="image"
          placeholder="제품이미지"
          defaultValue={"https://i.pravatar.cc"}
        />
        <input
          required
          name="category"
          placeholder="제품카테고리"
          defaultValue={"jually"}
        />
        <button>작성하기</button>
      </form>
    </section>
  );
}

interface PageProps {
  params: Promise<{ id: string }>;
}

async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className={styles.container}>
      <GoodDetail id={id} />
      <ReviewForm />
    </div>
  );
}

export default Page;
```

### 4.3. 컴포넌트로 추출

- `/src/components/ReviewForm.tsx 파일` 생성

```tsx
import style from "@/components/ReviewForm.module.css";
import { createReviewAction } from "@/actions/create-review-action";
export default function ReviewForm() {
  return (
    <div className={style.add_container}>
      <h3>리뷰 추가하기 </h3>
      <form action={createReviewAction} className={style.form_container}>
        <input type="hidden" name="id" value={500} readOnly />
        <div className={style.input_container}>
          <input
            type="text"
            name="title"
            placeholder="상품명"
            required
            defaultValue={"test product"}
          />
          <input
            type="text"
            name="price"
            placeholder="가격"
            required
            defaultValue={"13.5"}
          />
        </div>
        <textarea
          name="description"
          placeholder="설명"
          required
          defaultValue={"lorem..."}
        />
        <div className={style.input_container}>
          <input
            type="text"
            name="image"
            placeholder="이미지"
            required
            defaultValue={"https://i.pravatar.cc"}
          />
          <input
            type="text"
            name="category"
            placeholder="카테고리"
            required
            defaultValue={"category"}
          />
        </div>
        <button type="submit">작성하기</button>
      </form>
    </div>
  );
}
```

- `/src/components/ReviewForm.module.css 파일` 생성

```css
.add_container {
  display: flex;
  flex-direction: column;
}
.form_container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.form_container textarea {
  width: 100%;
  height: 100px;
  resize: vertical;
}
.input_container {
  display: flex;
  gap: 5px;
}
.input_container input {
  padding: 10px;
  border: 1px solid rgb(220, 220, 220);
  border-radius: 5px;
  width: 50%;
}
.form_container button {
  padding: 10px;
  border: 1px solid rgb(220, 220, 220);
  border-radius: 5px;
  background-color: rgb(37, 147, 255);
  color: #fff;
  cursor: pointer;
}
```

## 5. 카테고리에 해당하는 상품 출력하기

- `/src/components/CateList.tsx 파일` 생성

```tsx
import style from "@/components/CateList.module.css";
import { GoodDataType } from "@/types/types";
import GoodItem from "@/components/GoodItem";

export default async function CateList({ id }: { id: string }) {
  // 제품의 id 를 이용해서 제품 정보를 읽어옴.
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
  const good: GoodDataType = await res.json();
  // 제품 정보 중에 카테고리만 추출
  const { category } = good;

  // 추출한 카테고리 글자로 카테고리에 해당하는 제품만 추출

  const resCate = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/category/${category}`
  );
  const goods: GoodDataType[] = await resCate.json();

  return (
    <div className={style.cate_container}>
      <h3>
        <strong>{category}</strong> 상품 목록
      </h3>
      <div>
        {goods.map((item) => (
          <GoodItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}
```

- `/src/components/CateList.module.css 파일` 생성

```css
.cate_container {
  display: flex;
  flex-direction: column;
}
.cate_container strong {
  color: hotpink;
}
```

## 6. 새로고침 없이 리뷰 출력하기

- `/src/actions/create-review-action.ts` 업데이트

```ts
"use server";

import { revalidatePath } from "next/cache";

// Action 용 함수
export async function createReviewAction(formData: FormData) {
  const title = formData.get("title")?.toString();
  const price = formData.get("price")?.toString();
  const description = formData.get("description")?.toString();
  const image = formData.get("image")?.toString();
  const category = formData.get("category")?.toString();
  // 간단한 예외처리
  if (!title || !price || !description || !image || !category) {
    return;
  }
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products`,
      {
        method: "POST",
        body: JSON.stringify({ title, price, description, image, category }),
      }
    );

    // 서버에서 출력됨
    console.log("상품 리뷰 등록 성공", response);
    const { id } = await response.json();
    console.log("상품 리뷰 등록 결과 id : ", id);
    // 리뷰가 등록되었으면 리랜더링으로 출력을 시켜야 함.
    // - 서버에서 호출해야 한다.
    // - 지금까지 가지고 있던 cache 무효화해야 한다.
    // - /src/app/good/[id]/page.tsx
    revalidatePath(`/good/${id}`);
  } catch (error) {
    // 서버에서 에러 메시지 출력 (웹브라우저 아님)
    console.log(error);
  }
}
```

### 6.1. 특정 주소만 재호출하는 방식

```ts
revalidatePath(`/good/${id}`);
```

### 6.2. 특정 주소의 모든 Dynamic Page 를 재호출하는 방식

```ts
revalidatePath(`/good/${id}`, "page");
```

### 6.3. 특정 레이아웃(layout.tsx)을 적용한 모든 Page 를 재호출하는 방식

```ts
revalidatePath(`/(with-search)`, "layout");
```

- 모든 데이터를 재호출하는 방식

```ts
revalidatePath(`/`, "layout");
```

### 6.4. 특정 태그 값을 기준으로 데이터 캐시 재호출하는 방식

```ts
revalidateTag("특정태그");
```

- 기존 방식

```ts
// [id]/page.tsx
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
  {
    cache: "force-cache",
  }
);
```

```ts
// create-review-action.ts
revalidatePath(`/good/${id}`);
```

- 아래는 태그를 적 용하는 예

```ts
// [id]/page.tsx
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
  {
    next: { tags: [`good-${id}`] },
  }
);
```

```ts
// create-review-action.ts
revalidateTag(`good-${id}`);
```

## 7. 클라이언트 컴포넌트에서 Server Action 호출하기

- 어렵습니다. 그러나 필수입니다.
- Server Action 은 자료를 등록하는 form 태그에 action 입니다.
- 연속으로 등록을 방지해야 합니다.
- 로딩 상태를 설정하거나 에러를 핸들링 할 필요가 있다.
- 이런 문제는 Client Component 로 만들어서 해결함.

### 7.1. 적용해보기

- Server Action 의 매개변수 수정

```ts
// create-review-action.ts
"use server";

import { delay } from "@/util/delay";
import { revalidatePath, revalidateTag } from "next/cache";

// Action 용 함수
// useActionState 활용시 : Action 의 상태도 전달을 하는 형태로 적용필요
export async function createReviewAction(_: any, formData: FormData) {
  const title = formData.get("title")?.toString();
  const price = formData.get("price")?.toString();
  const description = formData.get("description")?.toString();
  const image = formData.get("image")?.toString();
  const category = formData.get("category")?.toString();

  // 간단한 예외처리
  if (!title || !price || !description || !image || !category) {
    // 업데이트 함.
    // 아래는 호출한 곳으로 전달하고 싶은 내용객체를 생성함.
    return { status: false, message: "각 항목을 채워주세요." };
  }
  try {
    // 테스트를 위한 시간 늘리기
    delay(10000); // 10 초를 걸어줌. (피드백 필요)

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products`,
      {
        method: "POST",
        body: JSON.stringify({ title, price, description, image, category }),
      }
    );

    // 서버에서 출력됨
    console.log("상품 리뷰 등록 성공", response);
    const { id } = await response.json();
    console.log("상품 리뷰 등록 결과 id : ", id);
    // 리뷰가 등록되었으면 리랜더링으로 출력을 시켜야 함.
    // - 서버에서 호출해야 한다.
    // - 지금까지 가지고 있던 cache 무효화해야 한다.
    // - /src/app/good/[id]/page.tsx
    revalidateTag(`good-${id}`);
    // 기존과는 다르게 호출한 곳에 전달함.
    return { status: true, message: "등록에 성공했습니다." };
  } catch (error) {
    // 서버에서 에러 메시지 출력 (웹브라우저 아님)
    console.log(error);
    return { status: false, message: "리뷰 등록에 실패했습니다." };
  }
}
```

- 컴포넌트에 useActionState 활용

```tsx
"use client";
import style from "@/components/ReviewForm.module.css";
import { createReviewAction } from "@/actions/create-review-action";
import { useActionState, useEffect } from "react";

export default function ReviewForm() {
  // 리액트 19버전에서 추가됨 : Server Action 의 매개변수 변화
  // state : 리턴값
  // formAction : 연결한 Server Action
  // isPending : 네트워크에서 진행중인 상태
  const [state, formAction, isPending] = useActionState(
    createReviewAction,
    null
  );

  // state 가 바뀔때 마다 체크함
  useEffect(() => {
    if (state && !state.message) {
      alert(state.message);
    }
  }, [state]);

  // 서버 액션이 진행중 ...
  if (isPending) {
    // return <div>서버 액션 진행중 ...</div>;
  }
  // 서버 액션의 결과가 status 가 false 라면
  if (state?.status === false) {
    return <div>{state.message}</div>;
  }

  return (
    <div className={style.add_container}>
      <h3>리뷰 추가하기 </h3>
      <form action={formAction} className={style.form_container}>
        <input type="hidden" name="id" value={500} readOnly />
        <div className={style.input_container}>
          <input
            disabled={isPending}
            type="text"
            name="title"
            placeholder="상품명"
            required
            defaultValue={"test product"}
          />
          <input
            disabled={isPending}
            type="text"
            name="price"
            placeholder="가격"
            required
            defaultValue={"13.5"}
          />
        </div>
        <textarea
          disabled={isPending}
          name="description"
          placeholder="설명"
          required
          defaultValue={"lorem..."}
        />
        <div className={style.input_container}>
          <input
            disabled={isPending}
            type="text"
            name="image"
            placeholder="이미지"
            required
            defaultValue={"https://i.pravatar.cc"}
          />
          <input
            disabled={isPending}
            type="text"
            name="category"
            placeholder="카테고리"
            required
            defaultValue={"category"}
          />
        </div>
        <button disabled={isPending} type="submit">
          {isPending ? "등록중..." : "작성하기"}
        </button>
      </form>
    </div>
  );
}
```

## 8. Server Action 복습해 보기

### 8.1. Server Action 만들기

- `/src/actions/deleteActions.ts 파일` 생성

```ts
"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function deleteAction(_: any, formData: FormData) {
  //   const goodId = formData.get("goodid") as string;
  const goodId = formData.get("goodid")?.toString();
  if (!goodId) {
    return { status: false, message: `해당하는 ${goodId}가 없습니다.` };
  }
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${goodId}`,
      { method: "DELETE" }
    );
    const { id } = await response.json();
    revalidatePath(`/good/${id}`);
    revalidateTag(`good-${id}`);
    return {
      status: true,
      message: `${id} 삭제에 성공하였습니다.`,
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      messsage: `해당하는 ${id}가 삭제에 실패했습니다. 다시 시도해주세요.`,
    };
  }
}
```

- `/src/components/DeleteBt.tsx 파일` 생성
- https://www.devdic.com/javascript/reference/dom/method:2766/requestSubmit()

```tsx
"use client";
import styles from "@/components/DeleteBt.module.css";
import { deleteAction } from "@/actions/deleteActions";
import { GoodDataType } from "@/types/types";
import { useActionState, useEffect, useRef } from "react";

export const DeleteBt = ({ id }: GoodDataType) => {
  const [state, formAction, isPending] = useActionState(deleteAction, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state && !state.status) {
      alert(state.message);
    }
  }, [state]);

  return (
    <>
      <form action={formAction} className={styles.container} ref={formRef}>
        <input type="hidden" name="goodid" value={id} readOnly hidden />
        {isPending ? (
          <div className={styles.delete_btn}>Deleting...</div>
        ) : (
          <div
            className={styles.delete_btn}
            onClick={() => formRef.current?.requestSubmit()}
          >
            Delete
          </div>
        )}
      </form>
    </>
  );
};
```

- `/src/components/DeleteBt.module.css 파일` 생성

```css
.container {
  position: relative;
}
.delete_btn {
  position: absolute;
  right: 0;
  top: -50px;
  cursor: pointer;
  border: 1px solid rgb(220, 220, 220);
  padding: 5px 10px;
  border-radius: 5px;
}
```
