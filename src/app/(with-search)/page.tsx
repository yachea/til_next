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
