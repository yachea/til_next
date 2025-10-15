import styles from "@/components/skeleton/GoodItemSkeleton.module.css";
const GoodItemSkeleton = () => {
  return (
    <div className={styles.container}>
      <div className={styles.image}></div>
      <div className={styles.box}>
        <div className={styles.title}></div>
        <div className={styles.category}></div>
        <br />
        <div className={styles.rating}></div>
      </div>
    </div>
  );
};

export default GoodItemSkeleton;
