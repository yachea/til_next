# Route Cache

- Next 서버에서 빌드 타임에 특정 페이지의 렌더링 결과를 캐싱하는 기능
- Next 에 Page 종류는 Static Page 와 Dynamic Page

## 1. 빌드시 동적 페이지로 설정되는 기준

- Dynamic Page 로 빌드되는 경우의 기분
- 특정 페이지가 접속 요청을 받을 때마다 변화가 생기는 경우
- 특정 페이지가 접속 요청을 받을 때마다 데이터가 달라지는 경우
- 서버 컴포넌트인 경우
  - 캐시되지 않은 Data Fetching 을 사용할 경우
  - 동적함수 (쿠키, 헤더, 쿼리스트링 등...)을 사용한 컴포넌트가 있을 때

## 2. 빌드시 정적페이지로 설정되는 기준

- Static Page 로 설정되는 기준
- Dynamic Page 가 아니라면 모두 Static Page 로 설정됨.

## 3. 빌드 오류 해결하기

```bash
npm run build
```

### 3.1. useSearchParams() 문제해결

- 사용자가 어떤 데이터를 입력할지 알 수 없는 경우
- `/src/app/(with-search)/layout.tsx`

```tsx
import SearchBar from "@/components/SearchBar";
import { Suspense } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchBar />
      </Suspense>
      <div>{children}</div>
    </div>
  );
}

export default Layout;
```

## 4. Static 페이지로 구성해 보기

- `/src/app/good/[id]/page.tsx`
- 아래 함수를 이용하면 SSR 페이지를 미리 생성해줌.
- 빌드 시에 페이지를 미리 생성함. ()
-

```tsx
import styles from "@/app/good/[id]/page.module.css";
import { GoodDataType } from "@/types/types";
import Image from "next/image";

// 약속된 Next 함수임 (미리 페이지를 Static 이고, SSR 페이지이다.)
export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}
```

## 5. 라우터 페이지는 Static 으로 만들 수 있으면 만들어주자.

- `동적함수 없고, 데이터 캐시를 적용하면 Static 으로 빌드됨.`
- 동적함수 있으면 Dynamic 으로 빌드됨.
- 데이터 캐시 없으면 Dynamic 으로 빌드됨.
- 동적함수 없고, 캐시 없으면 Dynamic 으로 빌드됨.

## 6. 강제로 페이지의 유형을 설정하는 옵션

- 권장하지는 않음

```tsx
export const dynamic = "auto"; // 기본값, 아무것도 강제하지 않음.
export const dynamic = "force=dynamic"; // 강제로 Dynamic 페이지로 설정
export const dynamic = "force=static"; // 강제로  Static 페이지로 설정
export const dynamic = "error"; // 강제로  Static 페이지로 설정하고 빌드 오류발생시킴
```
