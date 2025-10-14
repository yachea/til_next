import goods from "@/mock/good.json";
import styles from "@/app/(with-search)/page.module.css";
import GoodItem from "@/components/GoodItem";
import { GoodDataType } from "@/types/types";

// Data Fetching : 데이터를 불러오면 Next.js 서버가 데이터를 보관 (Cache)
// 기본값은 데이터를 불러들이면 Cache 해서 업데이트 자료를 다시  호출 하지 않음.
// 백엔드 호출이 줄어드는 장점과 화면 출력이 빠름, HTML 미리 생성하므로 SEO 좋음.

// 1. 전체 제품 목록 가져오기
async function AllGoods() {
  // 아래의 fetch 함수는 js 내장 함수가 아니라 Next.js 의 내장함수
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
  // js 의 내장 fetch 가 아니고, Next.js 의 내장 fetch 입니다.
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?limit=3`
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
        <RecommendGoods />
      </section>
      <section>
        <h3>전체 상품</h3>
        <AllGoods />
      </section>
    </div>
  );
}

export default Home;
