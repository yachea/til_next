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
