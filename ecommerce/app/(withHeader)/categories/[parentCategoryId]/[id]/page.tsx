import styles from "./page.module.css";
import CategoryDetailsSection from "@/components/category/category-details-section";

export default async function SubCatDetails({
  params,
}: {
  params: Promise<{ parentCategoryId: number; id: number }>;
}) {
  const { parentCategoryId, id } = await params;

  return (
    <>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Trouvez votre <span className={styles.accent}>produit idéal</span>
        </h1>
        <p className={styles.heroSub}>
          Des milliers de produits au meilleur prix
        </p>
      </div>

      <div className={styles.listSection}>
        <CategoryDetailsSection parentCategoryId={parentCategoryId} id={id} />
      </div>
    </>
  );
}