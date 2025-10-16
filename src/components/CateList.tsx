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
