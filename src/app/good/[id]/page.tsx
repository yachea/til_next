import styles from "@/app/good/[id]/page.module.css";
import { GoodDataType } from "@/types/types";
import Image from "next/image";

// 약속된 Next 함수임 (미리 페이지를 Static 이고, SSR 페이지이다.)
export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

async function page({ params }: PageProps) {
  const { id } = await params;
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

export default page;
