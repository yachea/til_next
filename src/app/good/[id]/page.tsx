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
