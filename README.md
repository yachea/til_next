# SEO 적용하기

- 메타데이터 설정을 통해 진행함.

## 1. /src/app/layout.tsx 에 설정 : 정적 SEO

```tsx
// SEO 설정
export const metadata: Metadata = {
  title: "내가 만드는 쇼핑몰",
  description: "쇼핑몰 만드는 것에 대한 소개글 입니다.",
};
```

## 2. /src/app/(with-search)/layout.tsx 에 설정 : 정적 SEO

```tsx
// SEO 적용
export const metadata: Metadata = {
  title: "상품 홍보 페이지",
  description: "상품 홍보 페이지입니다.",
  openGraph: {
    title: "상품 홍보 페이지",
    description: "상품 홍보 페이지입니다.",
    images: [{ url: "/thumbnail.png" }],
  },
};
```

## 3. `/src/app/(with-search)/search/page.tsx` : 동적 SEO

```tsx
//SEO
export const generateMetadata = async ({
  searchParams,
}: {
  searchParams: Promise<{ keyword: string }>;
}) => {
  const { keyword } = await searchParams;
  return {
    title: `상품 ${keyword} 검색 페이지`,
    description: `상품 ${keyword} 검색 페이지입니다.`,
    openGraph: {
      title: `상품 ${keyword} 검색 페이지`,
      description: `상품 ${keyword} 검색 페이지입니다.`,
      images: [{ url: "/thumbnail.png" }],
    },
  };
};
```

## 4. `/src/app/good/[id]/page.tsx` : 동적 SEO

```tsx
// SEO
export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`
    );
    const good: GoodDataType = await res.json();
    const { title, description, image } = good;
    return {
      title: `상품 ${title} 상세 페이지`,
      description: `상품 설명 - ${description}`,
      openGraph: {
        title: `상품 ${title} 상세 페이지`,
        description: `상품 설명 - ${description}`,
        images: [{ url: image }],
      },
    };
  } catch (error) {
    console.log(error);
  }
};
```
