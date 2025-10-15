# Loading

- 라우터에 의한 page 출력시 시간이 오래 걸리는 경우 존재
- Dynamic Page 는 데이터연동이라서 로딩이 걸림.
- 비동기 페이지에서는 로딩이 걸림
- Next.js 에서는 page 에 로딩을 처리하는 loading.tsx 가 존재함.

## 1. 주의사항

- page 에만 적용됨.
- 컴포넌트에 적용되는 것은 아님 (`별도로 작성`필요 : 리액트의 Supense 를 활용)
- `loading.tsx` 라고 파일명 전해져 있음.
- Next.js 는 파일 컨벤션에서 소문자를 기준으로 함.

## 2. 적용해보기

- Dynamic page 가 아니라면 loading.tsx 작동안됨.
- `/src/app/(with-search)/search/page.tsx`
- `/src/app/(with-search)/search/loading.tsx` 파일 생성

```tsx
export default function Loading() {
  return <div>Loading...</div>;
}
```

## 3. 수업을 위해서 Delay 를 시킴

- 나중에는 제거함.
- `/src/util 폴더`생성
- `/src/util/delay.ts 파일`생성

```ts
import { resolve } from "path";

export async function delay(ms: number) {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve("");
    }, ms);
  });
}
```

## 4. Delay 적용하기

- `/src/app/(with-search)/search/page.tsx`

```tsx
import styles from "@/app/(with-search)/search/page.module.css";
import GoodItem from "@/components/GoodItem";
import { GoodDataType } from "@/types/types";
import { delay } from "@/util/delay";

interface PageProps {
  searchParams: Promise<{ keyword: string }>;
}

async function Page({ searchParams }: PageProps) {
  const { keyword } = await searchParams;
  // 일부러 시간을 지연시킴
  await delay(1500);

  // fetch 를 활용한 검색
  // js 내장 fetch 가 아니고 Next.js 의 fetch 활용
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/category/${keyword}`
  );
  const allGoods: GoodDataType[] = await response.json();
  return (
    <div className={styles.container}>
      <h4>
        <strong>{keyword}</strong> : 검색페이지
      </h4>
      <div>
        {allGoods.map((item) => (
          <GoodItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}

export default Page;
```

## 5. 주의사항

### 5.1. UX 적으로 문제가 될 수도 있습니다.

- 아래처럼 `Query String 은 loading.tsx 가 출력안됨.`
- http://localhost:3000/search?keyword=jewelery
- http://localhost:3000/search?keyword=aaa

### 5.2. 하위페이지에서도 적용됨.

- layout.tsx 처럼 하위의 라우터 페이지에 모두 출력이 됨.
- 모두 동일한 loading.tsx 를 보여주는 어색함.
- http://localhost:3000/search/now
- http://localhost:3000/search/go

### 5.3. async 가 반드시 존재해야 작동됨.

- page 가 비동기로서 async 가 적용되어야 작동함.

### 5.4. 컴포넌트에는 적용안됨.

- 리액트의 Suspense 활용을 권장함.

## 6. 컴포넌트에 Suspense 활용하기

- loading.tsx 제거

### 6.1. Suspense 적용하기

- `/src/app/(with-search)/search/page.tsx`

```tsx
import styles from "@/app/(with-search)/search/page.module.css";
import GoodItem from "@/components/GoodItem";
import { GoodDataType } from "@/types/types";
import { delay } from "@/util/delay";
import { Suspense } from "react";

// 실제로는 외부 컴포넌트로 추출하기를 권장 : components 폴더 / SearchResult.tsx
// 리액트 suspense 로 세밀하게 로딩 처리하기
interface SearchResultProps {
  keyword: string;
}

async function SearchResult({ keyword }: SearchResultProps) {
  // 일부러 시간을 지연시킴
  await delay(1500);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/category/${keyword}`
  );
  const allGoods: GoodDataType[] = await response.json();

  return (
    <div className={styles.container}>
      <h4>
        <strong>{keyword}</strong> : 검색페이지
      </h4>
      <div>
        {allGoods.map((item) => (
          <GoodItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}

interface PageProps {
  searchParams: Promise<{ keyword: string }>;
}

async function Page({ searchParams }: PageProps) {
  const { keyword } = await searchParams;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResult keyword={keyword} />;
    </Suspense>
  );
}

export default Page;
```

## 7. 스켈레톤 적용하기

- 최적화 중 Shift Layout 현상 제거
- 최적화 중 스켈레톤을 통해서 사용자를 조금 더 기다리게 유도

### 7.1. 메인페이지에 적용해 보기

- `src/app/(with-search)/page.tsx` 적용해보기

```tsx
import styles from "@/app/(with-search)/page.module.css";
import GoodItem from "@/components/GoodItem";
import { GoodDataType } from "@/types/types";
import { delay } from "@/util/delay";
import { Suspense } from "react";

// Dynamic Page 로 강제로 설정합니다. (권장하지 않음, 수업이라서)
export const dynamic = "force-dynamic";

// 1. 전체 제품 목록 가져오기
async function AllGoods() {
  // 수업을 위해서 강제로 delay 시킴
  await delay(1500);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?limit=10`,
    { next: { revalidate: 3600 } }
  );
  const allGoods: GoodDataType[] = await response.json();
  // console.log(allGoods);
  return (
    <div>
      {allGoods.map((item) => (
        <GoodItem key={item.id} {...item} />
      ))}
    </div>
  );
}

// 2. 추천 상품 목록
async function RecommendGoods() {
  // 수업을 위해서 강제로 delay 시킴
  await delay(1500);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?limit=3`,
    { cache: "force-cache" }
  );
  const allGoods: GoodDataType[] = await response.json();
  return (
    <div>
      {allGoods.map((item) => (
        <GoodItem key={item.id} {...item} />
      ))}
    </div>
  );
}

function Home() {
  return (
    <div className={styles.container}>
      <section>
        <h3>지금 추천하는 상품</h3>
        <Suspense fallback={<div>Loading...</div>}>
          <RecommendGoods />
        </Suspense>
      </section>
      <section>
        <h3>전체 상품</h3>
        <Suspense fallback={<div>Loading...</div>}>
          <AllGoods />
        </Suspense>
      </section>
    </div>
  );
}

export default Home;
```

### 7.2. 메인페이지에 스켈레톤 적용해 보기

- 스켈레톤 : 뼈대 (컴포넌트로 생성하자)
- `/src/components/skeleton` 폴더 생성
- `/src/components/skeleton/GoodItemSkeleton.tsx 파일` 생성

```tsx
import styles from "@/components/skeleton/GoodItemSkeleton.module.css";
const GoodItemSkeleton = () => {
  return (
    <div className={styles.container}>
      <div className={styles.image}></div>
      <div className={styles.box}>
        <div className={styles.title}></div>
        <div className={styles.category}></div>
        <br />
        <div className={styles.rating}></div>
      </div>
    </div>
  );
};

export default GoodItemSkeleton;
```

- `/src/components/skeleton/GoodItemSkeleton.module.css 파일` 생성

```css
.container {
  display: flex;
  gap: 15px;
  padding: 20px 10px;
  border-bottom: 1px solid rgb(220, 220, 220);
  color: #000;
  text-decoration: none;

  height: 155px;
}
.image {
  width: 80px;
  height: 115px;
  background-color: rgb(220, 220, 220);
}
.box {
  flex: 1;
}
.title {
  width: 50%;
  height: 25px;
  background-color: rgb(220, 220, 220);
  margin-bottom: 10px;
}
.category {
  width: 20%;
  height: 20px;
  background-color: rgb(220, 220, 220);
}
.rating {
  height: 21px;
  background-color: rgb(220, 220, 220);
}
```

- 실제로 적용해 보기
- `src/app/(with-search)/page.tsx` 적용

```tsx
import styles from "@/app/(with-search)/page.module.css";
import GoodItem from "@/components/GoodItem";
import GoodItemSkeleton from "@/components/skeleton/GoodItemSkeleton";
import { GoodDataType } from "@/types/types";
import { delay } from "@/util/delay";
import { Suspense } from "react";

// Dynamic Page 로 강제로 설정합니다. (권장하지 않음, 수업이라서)
export const dynamic = "force-dynamic";

// 1. 전체 제품 목록 가져오기
async function AllGoods() {
  // 수업을 위해서 강제로 delay 시킴
  await delay(1500);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?limit=10`,
    { next: { revalidate: 3600 } }
  );
  const allGoods: GoodDataType[] = await response.json();
  // console.log(allGoods);
  return (
    <div>
      {allGoods.map((item) => (
        <GoodItem key={item.id} {...item} />
      ))}
    </div>
  );
}

// 2. 추천 상품 목록
async function RecommendGoods() {
  // 수업을 위해서 강제로 delay 시킴
  await delay(1500);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?limit=3`,
    { cache: "force-cache" }
  );
  const allGoods: GoodDataType[] = await response.json();
  return (
    <div>
      {allGoods.map((item) => (
        <GoodItem key={item.id} {...item} />
      ))}
    </div>
  );
}

function Home() {
  return (
    <div className={styles.container}>
      <section>
        <h3>지금 추천하는 상품</h3>
        <Suspense
          fallback={
            <>
              <GoodItemSkeleton />
              <GoodItemSkeleton />
              <GoodItemSkeleton />
            </>
          }
        >
          <RecommendGoods />
        </Suspense>
      </section>
      <section>
        <h3>전체 상품</h3>
        <Suspense
          fallback={
            <>
              <GoodItemSkeleton />
              <GoodItemSkeleton />
              <GoodItemSkeleton />
              <GoodItemSkeleton />
              <GoodItemSkeleton />
            </>
          }
        >
          <AllGoods />
        </Suspense>
      </section>
    </div>
  );
}

export default Home;
```

### 7.3. 스켈레톤 리스트로 업데이트 해보자.

- `/src/components/skeleton/GoodItemListSkeleton.tsx 파일` 생성

```tsx
import GoodItemSkeleton from "./GoodItemSkeleton";

interface GoodItemListSkeletonProps {
  count: number;
}
const GoodItemListSkeleton = ({ count }: GoodItemListSkeletonProps) => {
  return new Array(count)
    .fill(0)
    .map((_, index) => <GoodItemSkeleton key={index} />);
};

export default GoodItemListSkeleton;
```

- 적용하기
- `src/app/(with-search)/page.tsx` 적용

```tsx
import styles from "@/app/(with-search)/page.module.css";
import GoodItem from "@/components/GoodItem";
import GoodItemListSkeleton from "@/components/skeleton/GoodItemListSkeleton";
import GoodItemSkeleton from "@/components/skeleton/GoodItemSkeleton";
import { GoodDataType } from "@/types/types";
import { delay } from "@/util/delay";
import { Suspense } from "react";

// Dynamic Page 로 강제로 설정합니다. (권장하지 않음, 수업이라서)
export const dynamic = "force-dynamic";

// 1. 전체 제품 목록 가져오기
async function AllGoods() {
  // 수업을 위해서 강제로 delay 시킴
  await delay(1500);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?limit=10`,
    { next: { revalidate: 3600 } }
  );
  const allGoods: GoodDataType[] = await response.json();
  // console.log(allGoods);
  return (
    <div>
      {allGoods.map((item) => (
        <GoodItem key={item.id} {...item} />
      ))}
    </div>
  );
}

// 2. 추천 상품 목록
async function RecommendGoods() {
  // 수업을 위해서 강제로 delay 시킴
  await delay(1500);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?limit=3`,
    { cache: "force-cache" }
  );
  const allGoods: GoodDataType[] = await response.json();
  return (
    <div>
      {allGoods.map((item) => (
        <GoodItem key={item.id} {...item} />
      ))}
    </div>
  );
}

function Home() {
  return (
    <div className={styles.container}>
      <section>
        <h3>지금 추천하는 상품</h3>
        <Suspense
          fallback={
            <>
              <GoodItemListSkeleton count={3} />
            </>
          }
        >
          <RecommendGoods />
        </Suspense>
      </section>
      <section>
        <h3>전체 상품</h3>
        <Suspense
          fallback={
            <>
              <GoodItemListSkeleton count={5} />
            </>
          }
        >
          <AllGoods />
        </Suspense>
      </section>
    </div>
  );
}

export default Home;
```

## 8. 라이브러리

- https://github.com/dvtng/react-loading-skeleton#readme
- https://www.davidhu.io/react-spinners/
