# Next.js

## 1. 프로젝트 생성

## 1. 프로젝트 생성

```bash
npx create-next-app@latest .
```

## 2. 프로젝트 생성시 옵션 선택

- Would you like to use TypeScript? `Yes`
- Which linter would you like to use? » `ESLint`
- Would you like to use Tailwind CSS? `No`
- Would you like your code inside a `src/` directory? `Yes`
- Would you like to use App Router? (recommended) `Yes`
- Would you like to use Turbopack? (recommended) `No`
- Would you like to customize the import alias (`@/*` by default)? `Yes`

## 3. 프로젝트 실행하기

- `npm run dev` : 개발 모드 실행
- `npm run build` : 배포 빌드 모드 실행
- `npm run start` : Production 모드 실행

## 4. 프로젝트 최종 빌드시 `서버가 반드시 필요`함.

- React 는 그냥 빌드 파일을 주면 됨. (웹브라우저에서 실행됨)
- Next 는 반드시 별도의 서버가 필요함. (서버에서 실행됨)
- Next 는 일반적으로 Vercel, AWS등 에 배포함.
- 참고사항 : AWS 는 깡통 PC 를 제공함.

## 5. 기본 파일 구조

- `public 폴더` : 이미지 및 폰트 등의 리소스를 배치함. (static 파일들)

- `/src/app 폴더` :

  - `App Router` 버전으로 진행시 `app 폴더`가 존재함.
  - Next 는 반드시 `app 이라는 폴더`가 있어야 함.

- `/src/app/page.tsx` :

  - app 폴더에 page.tsx 가 화면에 보여줄 html 파일
  - index.html 의 역할을 함.
  - `http://localhost:3000` 라우터 경로에서 보여짐.

- `/src/app/globals.css` :
  - 앱 전체의 기본 css 역할

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  outline-style: none;
}
a {
  color: black;
  text-decoration: none;
}
ul,
li {
  list-style: none;
}
html {
  font-size: 16px;
  overflow-x: hidden;
}
body {
  color: black;
}
```

- `/src/app/layout.tsx` :

  - html 의 기본 구조용
  - 공통으로 적용될 내용을 작성하고, 공통으로 적용할 구조를 작성함.
  - `글로벌 레이아웃` 이라고 함.
  - 추후 별도로 각 페이지마다 `layout.tsx` 를 추가할 수 있음.

- `/src/app/page.module.css` :

  - Next 는 기본적으로 module css 가 기본 형식

- `/next.config.ts` :
  - Next 앱의 설정을 관리함
  - 추후 이미지 등등의 외부 리소스를 실시간 활용시 보안인증 등 설정

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
};

export default nextConfig;
```

## App Router 버전의 라우터의 이해

### 1. http://localhost:3000

- /src/app/page.tsx

```tsx
// module.css 가 기본임
import styles from "./page.module.css";
function page() {
  return <div className={styles.page}>page</div>;
}

export default page;
```

### 2. http://localhost:3000/search

- `/src/app/search 폴더 생성`
- `/src/app/search/page.tsx` 파일 생성

```tsx
function page() {
  return <div>검색페이지</div>;
}

export default page;
```

### 3. http://localhost:3000/search?keyword=iu

- URI 쿼리스트링 방식

```tsx
async function page({
  searchParams,
}: {
  searchParams: Promise<{ keyword: string }>;
}) {
  const { keyword } = await searchParams;

  return <div> {keyword} : 검색페이지</div>;
}

export default page;
```

### 4. http://localhost:3000/good/1

- URI Params 처리
- `/src/app/good 폴더 생성
- `/src/app/good/page.tsx` 파일 생성
- `/src/app/good/[id] 폴더 생성

```tsx
import React from "react";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div>{id}번 상품</div>;
}

export default page;
```

### 5. Not Found Page

- `/src/app/not-found.tsx`

```tsx
function NotFound() {
  return <div>not-found</div>;
}

export default NotFound;
```

## layout.tsx 의 이해

### 1. 글로벌 레이아웃

- `/src/app/layout.tsx`

### 2. 페이지별 레이아웃

- `/src/app/페이지/layout.tsx`
- `/src/app/search/layout.tsx` 파일 생성

```tsx
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div>여기는 검색 레이아웃입니다.</div>
      {children}
    </div>
  );
}

export default layout;
```

- `/src/app/good/layout.tsx` 파일 생성

```tsx
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      제품소개
      {children}
    </div>
  );
}

export default Layout;
```

## 3. Layout Group : 레이아웃 그룹

- http://localhost:3000 에는 `검색창 출력`
- http://localhost:3000/search 에는 `검색창 출력`
- http://localhost:3000/good 에는 `검색창 없음`

### 3.1. Layout Group 을 이용한 검색창 있는 layout 생성

- `/src/app/(with-search)` 폴더 생성
- `/src/app/(with-search)/layout.tsx` 파일 생성

```tsx
interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div>
      <div>검색창</div>
      <div>{children}</div>
    </div>
  );
}

export default Layout;
```

### 3.3. Layout Group 적용

- 적용하고 싶은 라우터 경로 폴더 및 page.tsx 를 (with-search)로 이동해줌.
- search 폴더 이동해줌.
- /app/page.tsx 이동해줌.
- /app/page.module.css 이동해줌.
