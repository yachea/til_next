import { createReviewAction } from "@/actions/create-review-action";
import styles from "@/app/good/[id]/page.module.css";
import CateList from "@/components/CateList";
import ReviewForm from "@/components/ReviewForm";
import { GoodDataType } from "@/types/types";
import Image from "next/image";

// 제품 상세 정보 출력 컴포넌트 :  components 에 별도로 추출하길 권장
interface GoodDetailProps {
  id: string;
}
async function GoodDetail({ id }: GoodDetailProps) {
  // fetch 를 이용한 자료 출력
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
    {
      next: { tags: [`good-${id}`] },
    }
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

interface PageProps {
  params: Promise<{ id: string }>;
}

async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className={styles.container}>
      <GoodDetail id={id} />
      <ReviewForm />
      <CateList id={id} />
    </div>
  );
}

export default Page;
