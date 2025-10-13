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

### 1. http://localhost:3000 : index

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
- `/src/app/good/[id] 폴더` 생성

```tsx
import React from "react";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div>{id}번 상품</div>;
}

export default page;
```

### 5. Not Found Page

- 없는 라우터 경로에는 기본 파일 출력
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

## 4. React 19 - Server Component 의 이해

- 클라이언트 즉, 웹브라우저에서 js 번들로 실행되는 컴포넌트를 Client Component 라고 한다.
- 서버 즉, PC에서 미리 생성해 주는 컴포넌트를 Server Component 라고 한다.

### 4.1. 구분해 보자

- 기존의 React 는 html 을 미리 생성하지 않습니다. (웹브라우저가 HTML 생성함)
- Next 는 Server 에서 미리 html 을 만든다. (만들어진 HTML 출력시킨 후 다시 JS 번들을 전달함 > 기능 작동함(Hydration))
- Next는 프리랜더링 단계로 HTML 즉 내용을 미리 만들어서 보여주기 때문에 FCP 가 빠르다.

### 4.2. 컴포넌트 구별

- 서버에서 만들어진 컴포넌트를 Server Component 라고 함.
- 클라이언트에서 만들어진 컴포넌트를 Client Component 라고 함.

### 4.3. Server Component

- Next 에서 생성하는 모든 것은 Server Component
- 줄임말로 rsc 라고 칭함.(React Server Component)
- rsc 결과물을 rscpayload 로생성됨(문자열들의 모음)
- 서버에서 1번만 만들어지고 추후 새로 생성하지 않음.

### 4.4. Client Component

- 서버에서 1번 생성함.
- 클라이언트 즉, 웹브라우저에서도 또 1번 생성함.
- 실시간 html 을 생성하는 형태임.
- 컴포넌트의 상단에 `"use clinet"` 라는 글자를 적어주어야 작동됨.

### 4.5. 컴포넌트를 생성하는 기준(간략한 기준)

- Next 는 Server Componet 가 기준입니다.
- 만약 `use 훅`들을 사용해야 하는 경우는 "use client" 를 명시해야 함.
- 만약 `이벤트 핸들러` 들을 사용해야 하는 경우 "use client" 를 명시해야 함.
- 만약 웹브라우저에서만 실행되는 라이브러리라면 "use client" 를 명시해야 함.
- 원칙은 Client Component 에 Server Componet 를 import 하지 않도록 하자.
- Client Component 에 Server Componet 를 import 하면 Client Component 가 된다.
- Server Component 를 import 하지 말고 children 으로 전달하는 형식 추천.

### 4.6. 서버 컴포넌트 살펴보기

- `http://localhost:3000/` 라우터
- `/src/app/(with-search)/page.tsx`
- 아래 코드는 use 훅을 사용하였으므로 Client Component 이다.
- "use client" 라고 작성했다.

```tsx
"use client";
// module.css 가 기본임
import { useEffect } from "react";
import styles from "./page.module.css";
function page() {
  console.log("시작페이지");
  // 임시 비밀번호
  // 서버 컴포넌트라서 실제 build 시 외부 노출 안됨.
  // .env 에서 별도로 관리할 예정
  const supaky = "123456";
  console.log(supaky);
  useEffect(() => {
    console.log("컴포넌트가 웹브라우저에 보이면 실행하라.");
  }, []);
  return <div className={styles.page}>page</div>;
}

export default page;
```

### 4.7. 검색 컴포넌트 생성하기

- /src/app/components 폴더 생성 (X)
- /src/components 폴더 생성 (o)
- `/src/components/SearchBar.tsx` 파일 생성

### 4.8. 아래처럼은 권장하지 않음.

- /src/components/ServerTest.tsx

```tsx
import React from "react";

const ServerTest = () => {
  return <div>ServerTest</div>;
};

export default ServerTest;
```

- import 로 Client Components 로 활용
- 서버 컴포넌트가 자동으로 클라이언트 컴포넌트로 변환

```tsx
"use client";
import React, { useState } from "react";
// import 로 불러들임
import ServerTest from "./ServerTest";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button>검색</button>
      <ServerTest />
    </div>
  );
};

export default SearchBar;
```

- children 으로 권장함 (서버 컴포넌트를 클라이언트 컴포넌트에 사용한다면)
- layout.tsx

```tsx
import SearchBar from "@/components/SearchBar";
import ServerTest from "@/components/ServerTest";

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div>
      <SearchBar>
        <ServerTest />
      </SearchBar>
      <div>{children}</div>
    </div>
  );
}

export default Layout;
```

### 4.9. 검색 컴포넌트 최종 코드

```tsx
"use client";
import React, { useState } from "react";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button>검색</button>
    </div>
  );
};

export default SearchBar;
```

## 5. Navipation 작성해 보기

- Global Navigation
- `/src/app/layout.tsx`

```tsx
import React from "react";
import "./globals.css";
import Link from "next/link";
interface RootLayoutProps {
  children: React.ReactNode;
}

function Rootlayout({ children }: RootLayoutProps) {
  return (
    <html>
      <body>
        <div className="wrap">
          <header>
            <Link href={"/"}>Home</Link> | <Link href={"/search"}>Search</Link>{" "}
            | <Link href={"/good/1"}>good</Link>
          </header>
          <main>{children}</main>
          <footer>하단</footer>
        </div>
      </body>
    </html>
  );
}

export default Rootlayout;
```

## 6. 동적 라우팅

- '/src/components/SearchBar.tsx` 업데이트

```tsx
"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const onchangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // 동적 라우팅
  const router = useRouter(); // "next/navigation";
  const handleSearch = () => {
    router.push(`/search?keyword=${search}`);
  };

  return (
    <div>
      <input type="text" value={search} onChange={(e) => onchangeSearch(e)} />
      <button onClick={handleSearch}>검색</button>
    </div>
  );
};

export default SearchBar;
```

## 7. css 타입 정의 만들기

### 7.1. 환경 셋팅

- css 에 대한 `타입 오류`가 발생한다면?
- 타입스크립트 프로젝트에서 css 또는 module.css 확장자의 타입 정의 필요시
- `/src/types 폴더` 생성
- `/src/types/css.d.ts 파일` 생성 (.d.ts 는 타입정의 내용 작성)

```ts
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.module.css" {
  const content: { [className: string]: string };
  export default content;
}
```

- tsconfig.json 설정

```json
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    "src/types/**/**.d.ts"
  ],
  "exclude": ["node_modules"]
```

### 7.2. 기본은 module.css 입니다.

- `/src/app/layout.module.css 파일` 생성

```css
.container {
  max-width: 600px;
  min-height: 100vh;
  margin: 0 auto;
  background-color: #fff;
  padding: 0px 15px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 30px 0px;
}
.container > header {
  height: 60px;
  font-weight: bold;
  font-size: 18px;
  line-height: 60px;
}
.container > main {
  padding-top: 10px;
}
.container > footer {
  padding: 100px 0;
  color: #000;
}
```

- `/src/components/SearchBar.module.css`

```css
.container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.container > input {
  flex: 1;
  border-radius: 5px;
  border: 1px solid rgb(220, 220, 220);
  padding: 5px;
}
.container > button {
  width: 80px;
  border-radius: 5px;
  border: none;
  background-color: rgb(37, 147, 255);
  color: #fff;
  cursor: pointer;
  padding: 10px;
}
```

## 8. Mock 데이터 연동

- `/src/mock 폴더` 생성
- `/src/mock/good.json 파일` 생성

```json
[
  {
    "id": 1,
    "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
    "price": 109.95,
    "description": "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
    "category": "men's clothing",
    "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
    "rating": { "rate": 3.9, "count": 120 }
  },
  {
    "id": 2,
    "title": "Mens Casual Premium Slim Fit T-Shirts ",
    "price": 22.3,
    "description": "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.",
    "category": "men's clothing",
    "image": "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png",
    "rating": { "rate": 4.1, "count": 259 }
  },
  {
    "id": 3,
    "title": "Mens Cotton Jacket",
    "price": 55.99,
    "description": "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.",
    "category": "men's clothing",
    "image": "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png",
    "rating": { "rate": 4.7, "count": 500 }
  },
  {
    "id": 4,
    "title": "Mens Casual Slim Fit",
    "price": 15.99,
    "description": "The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed below on the product description.",
    "category": "men's clothing",
    "image": "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_t.png",
    "rating": { "rate": 2.1, "count": 430 }
  },
  {
    "id": 5,
    "title": "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
    "price": 695,
    "description": "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl. Wear facing inward to be bestowed with love and abundance, or outward for protection.",
    "category": "jewelery",
    "image": "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_t.png",
    "rating": { "rate": 4.6, "count": 400 }
  },
  {
    "id": 6,
    "title": "Solid Gold Petite Micropave ",
    "price": 168,
    "description": "Satisfaction Guaranteed. Return or exchange any order within 30 days.Designed and sold by Hafeez Center in the United States. Satisfaction Guaranteed. Return or exchange any order within 30 days.",
    "category": "jewelery",
    "image": "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_t.png",
    "rating": { "rate": 3.9, "count": 70 }
  },
  {
    "id": 7,
    "title": "White Gold Plated Princess",
    "price": 9.99,
    "description": "Classic Created Wedding Engagement Solitaire Diamond Promise Ring for Her. Gifts to spoil your love more for Engagement, Wedding, Anniversary, Valentine's Day...",
    "category": "jewelery",
    "image": "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_t.png",
    "rating": { "rate": 3, "count": 400 }
  },
  {
    "id": 8,
    "title": "Pierced Owl Rose Gold Plated Stainless Steel Double",
    "price": 10.99,
    "description": "Rose Gold Plated Double Flared Tunnel Plug Earrings. Made of 316L Stainless Steel",
    "category": "jewelery",
    "image": "https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_t.png",
    "rating": { "rate": 1.9, "count": 100 }
  },
  {
    "id": 9,
    "title": "WD 2TB Elements Portable External Hard Drive - USB 3.0 ",
    "price": 64,
    "description": "USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows 10, Windows 8.1, Windows 7; Reformatting may be required for other operating systems; Compatibility may vary depending on user’s hardware configuration and operating system",
    "category": "electronics",
    "image": "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_t.png",
    "rating": { "rate": 3.3, "count": 203 }
  },
  {
    "id": 10,
    "title": "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s",
    "price": 109,
    "description": "Easy upgrade for faster boot up, shutdown, application load and response (As compared to 5400 RPM SATA 2.5” hard drive; Based on published specifications and internal benchmarking tests using PCMark vantage scores) Boosts burst write performance, making it ideal for typical PC workloads The perfect balance of performance and reliability Read/write speeds of up to 535MB/s/450MB/s (Based on internal testing; Performance may vary depending upon drive capacity, host device, OS and application.)",
    "category": "electronics",
    "image": "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_t.png",
    "rating": { "rate": 2.9, "count": 470 }
  },
  {
    "id": 11,
    "title": "Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5",
    "price": 109,
    "description": "3D NAND flash are applied to deliver high transfer speeds Remarkable transfer speeds that enable faster bootup and improved overall system performance. The advanced SLC Cache Technology allows performance boost and longer lifespan 7mm slim design suitable for Ultrabooks and Ultra-slim notebooks. Supports TRIM command, Garbage Collection technology, RAID, and ECC (Error Checking & Correction) to provide the optimized performance and enhanced reliability.",
    "category": "electronics",
    "image": "https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_t.png",
    "rating": { "rate": 4.8, "count": 319 }
  },
  {
    "id": 12,
    "title": "WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive",
    "price": 114,
    "description": "Expand your PS4 gaming experience, Play anywhere Fast and easy, setup Sleek design with high capacity, 3-year manufacturer's limited warranty",
    "category": "electronics",
    "image": "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_t.png",
    "rating": { "rate": 4.8, "count": 400 }
  },
  {
    "id": 13,
    "title": "Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin",
    "price": 599,
    "description": "21. 5 inches Full HD (1920 x 1080) widescreen IPS display And Radeon free Sync technology. No compatibility for VESA Mount Refresh Rate: 75Hz - Using HDMI port Zero-frame design | ultra-thin | 4ms response time | IPS panel Aspect ratio - 16: 9. Color Supported - 16. 7 million colors. Brightness - 250 nit Tilt angle -5 degree to 15 degree. Horizontal viewing angle-178 degree. Vertical viewing angle-178 degree 75 hertz",
    "category": "electronics",
    "image": "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_t.png",
    "rating": { "rate": 2.9, "count": 250 }
  },
  {
    "id": 14,
    "title": "Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor (LC49HG90DMNXZA) – Super Ultrawide Screen QLED ",
    "price": 999.99,
    "description": "49 INCH SUPER ULTRAWIDE 32:9 CURVED GAMING MONITOR with dual 27 inch screen side by side QUANTUM DOT (QLED) TECHNOLOGY, HDR support and factory calibration provides stunningly realistic and accurate color and contrast 144HZ HIGH REFRESH RATE and 1ms ultra fast response time work to eliminate motion blur, ghosting, and reduce input lag",
    "category": "electronics",
    "image": "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_t.png",
    "rating": { "rate": 2.2, "count": 140 }
  },
  {
    "id": 15,
    "title": "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats",
    "price": 56.99,
    "description": "Note:The Jackets is US standard size, Please choose size as your usual wear Material: 100% Polyester; Detachable Liner Fabric: Warm Fleece. Detachable Functional Liner: Skin Friendly, Lightweigt and Warm.Stand Collar Liner jacket, keep you warm in cold weather. Zippered Pockets: 2 Zippered Hand Pockets, 2 Zippered Pockets on Chest (enough to keep cards or keys)and 1 Hidden Pocket Inside.Zippered Hand Pockets and Hidden Pocket keep your things secure. Humanized Design: Adjustable and Detachable Hood and Adjustable cuff to prevent the wind and water,for a comfortable fit. 3 in 1 Detachable Design provide more convenience, you can separate the coat and inner as needed, or wear it together. It is suitable for different season and help you adapt to different climates",
    "category": "women's clothing",
    "image": "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_t.png",
    "rating": { "rate": 2.6, "count": 235 }
  },
  {
    "id": 16,
    "title": "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket",
    "price": 29.95,
    "description": "100% POLYURETHANE(shell) 100% POLYESTER(lining) 75% POLYESTER 25% COTTON (SWEATER), Faux leather material for style and comfort / 2 pockets of front, 2-For-One Hooded denim style faux leather jacket, Button detail on waist / Detail stitching at sides, HAND WASH ONLY / DO NOT BLEACH / LINE DRY / DO NOT IRON",
    "category": "women's clothing",
    "image": "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_t.png",
    "rating": { "rate": 2.9, "count": 340 }
  },
  {
    "id": 17,
    "title": "Rain Jacket Women Windbreaker Striped Climbing Raincoats",
    "price": 39.99,
    "description": "Lightweight perfet for trip or casual wear---Long sleeve with hooded, adjustable drawstring waist design. Button and zipper front closure raincoat, fully stripes Lined and The Raincoat has 2 side pockets are a good size to hold all kinds of things, it covers the hips, and the hood is generous but doesn't overdo it.Attached Cotton Lined Hood with Adjustable Drawstrings give it a real styled look.",
    "category": "women's clothing",
    "image": "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2t.png",
    "rating": { "rate": 3.8, "count": 679 }
  },
  {
    "id": 18,
    "title": "MBJ Women's Solid Short Sleeve Boat Neck V ",
    "price": 9.85,
    "description": "95% RAYON 5% SPANDEX, Made in USA or Imported, Do Not Bleach, Lightweight fabric with great stretch for comfort, Ribbed on sleeves and neckline / Double stitching on bottom hem",
    "category": "women's clothing",
    "image": "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_t.png",
    "rating": { "rate": 4.7, "count": 130 }
  },
  {
    "id": 19,
    "title": "Opna Women's Short Sleeve Moisture",
    "price": 7.95,
    "description": "100% Polyester, Machine wash, 100% cationic polyester interlock, Machine Wash & Pre Shrunk for a Great Fit, Lightweight, roomy and highly breathable with moisture wicking fabric which helps to keep moisture away, Soft Lightweight Fabric with comfortable V-neck collar and a slimmer fit, delivers a sleek, more feminine silhouette and Added Comfort",
    "category": "women's clothing",
    "image": "https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_t.png",
    "rating": { "rate": 4.5, "count": 146 }
  },
  {
    "id": 20,
    "title": "DANVOUY Womens T Shirt Casual Cotton Short",
    "price": 12.99,
    "description": "95%Cotton,5%Spandex, Features: Casual, Short Sleeve, Letter Print,V-Neck,Fashion Tees, The fabric is soft and has some stretch., Occasion: Casual/Office/Beach/School/Home/Street. Season: Spring,Summer,Autumn,Winter.",
    "category": "women's clothing",
    "image": "https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_t.png",
    "rating": { "rate": 3.6, "count": 145 }
  }
]
```

- 제품 데이터에 대한 타입정의
- `/src/types/types.ts` 파일 생성

```ts
export interface GoodDataType {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}
```

## 9. 외부 이미지 파일 연동

- `next.config.ts` 외부 연동 설정

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  // 외부 사이트 이미지 활용 적용
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fakestoreapi.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
```

## 10. 데이터 출력해 보기

- `/src/app/(with-search)/page.tsx` 업데이트

```tsx
import goods from "@/mock/good.json";
import styles from "@/app/(with-search)/page.module.css";

function Home() {
  return (
    <div className={styles.container}>
      <section>
        <h3>지금 추천하는 상품</h3>
        {goods.map((item) => (
          <div key={item.id}>{item.title}</div>
        ))}
      </section>
      <section>
        <h3>전체 상품</h3>
        {goods.map((item) => (
          <div key={item.id}>{item.title}</div>
        ))}
      </section>
    </div>
  );
}

export default Home;
```

- `/src/app/(with-search)/page.module.css` 업데이트

```css
.container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.container h3 {
  margin-bottom: 0;
}
```

## 11. 제품 리스트 컴포넌트 (서버 컴포넌트? 클라이언트 컴포넌트?)

- `/src/components/GoodItem.tsx 파일` 생성

```tsx
import { GoodDataType } from "@/types/types";
import styles from "@/components/GoodItem.module.css";
import Image from "next/image";
import Link from "next/link";

const GoodItem = ({ id, title, image, category, rating }: GoodDataType) => {
  return (
    <Link href={`/good/${id}`} className={styles.container}>
      <Image src={image} alt={title} width={80} height={115} />
      <div>
        <div className={styles.title}>{title}</div>
        <div className={styles.category}>{category}</div>
        <br />
        <div className={styles.rating}>
          Rating: {rating.rate} | {rating.count}
        </div>
      </div>
    </Link>
  );
};

export default GoodItem;
```

- `/src/components/GoodItem.module.css 파일` 생성

```css
.container {
  display: flex;
  gap: 15px;
  padding: 20px 10px;
  border-bottom: 1px solid rgb(220, 220, 220);
  color: #000;
  text-decoration: none;
}
.container > img {
  width: 80px;
}
.title {
  font-weight: bold;
}
.category {
  color: rgb(224, 4, 155);
}
.rating {
  color: rgb(128, 128, 128);
}
```

## 12. 제품 컴포넌트 활용하기

- `/src/app/(with-search)/page.tsx ` 업데이트

```tsx
import goods from "@/mock/good.json";
import styles from "@/app/(with-search)/page.module.css";
import GoodItem from "@/components/GoodItem";
function Home() {
  return (
    <div className={styles.container}>
      <section>
        <h3>지금 추천하는 상품</h3>
        {goods.map((item) => (
          <GoodItem key={item.id} {...item} />
        ))}
      </section>
      <section>
        <h3>전체 상품</h3>
        {goods.map((item) => (
          <GoodItem key={item.id} {...item} />
        ))}
      </section>
    </div>
  );
}

export default Home;
```

## 13. 검색 컴포넌트 업데이트

- /src/components/SearchBar.tsx 업데이트

```tsx
"use client";
import styles from "@/components/SearchBar.module.css";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const onchangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // 동적 라우팅
  const router = useRouter(); // "next/navigation";
  const handleSearch = () => {
    if (!search.trim()) {
      return;
    }
    router.push(`/search?keyword=${search}`);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        value={search}
        onChange={(e) => onchangeSearch(e)}
        onKeyDown={(e) => handleKeyDown(e)}
      />
      <button onClick={handleSearch}>검색</button>
    </div>
  );
};

export default SearchBar;
```

## 14. 제품 상세 페이지 업데이트

- `/src/app/good/[id]/page.tsx` 업데이트

```tsx
import { GoodDataType } from "@/types/types";
import styles from "@/app/good/[id]/page.module.css";
import { mock } from "node:test";
import Image from "next/image";

const mockData: GoodDataType = {
  id: 1,
  title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
  price: 109.95,
  description:
    "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
  category: "men's clothing",
  image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
  rating: { rate: 3.9, count: 120 },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

async function page({ params }: PageProps) {
  const { id } = await params;
  const { title, image, category, description, rating } = mockData;
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

export default page;
```

- `/src/app/good/[id]/page.module.css 파일` 생성

```css
.container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.title {
  font-size: 20px;
  font-weight: bold;
}
.image {
  position: relative;
  display: flex;
  justify-content: center;
  padding: 20px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.image > img {
  position: relative;
  max-height: 350px;
  height: 100%;
  border-radius: 5px;
}
.image::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
}
.category {
  text-transform: uppercase;
  font-weight: bold;
  color: rgb(224, 4, 155);
}
.rating {
  color: rgb(128, 128, 128);
}
.description {
  color: #000;
  padding: 20px;
  background-color: rgb(245, 245, 245);
  line-height: 1.5;
}
```

## 15. 검색 결과 페이지

- `/src/app/(with-search)/search/page.tsx` 업데이트

```tsx
import styles from "@/app/(with-search)/search/page.module.css";
import GoodItem from "@/components/GoodItem";
import goods from "@/mock/good.json";

interface PageProps {
  searchParams: Promise<{ keyword: string }>;
}

async function page({ searchParams }: PageProps) {
  const { keyword } = await searchParams;

  return (
    <div className={styles.container}>
      <h4>
        <strong>{keyword}</strong> : 검색페이지
      </h4>
      <div>
        {goods.map((item) => (
          <GoodItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}

export default page;
```

- `/src/app/(with-search)/search/page.module.css 파일` 생성

```css
.container {
  display: flex;
  flex-direction: column;
}
.container > h4 > strong {
  color: #e007ad;
  font-size: 20px;
  text-decoration: underline;
}
```

## 16. 특정 라우터의 특정 not-found 생성

- `/src/app/(with-search)/search/not-found.tsx 파일` 생성

```tsx
export default function Notfound() {
  return <div>쿼리가 잘못된 경로입니다.</div>;
}
```
