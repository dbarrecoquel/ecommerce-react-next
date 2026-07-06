import SubCategorySection from "@/components/category/sub-category-section";
import styles from "./page.module.css";
import Header from "@/components/header/header";
export default async function SubCat({params} : {params : Promise<{parentCategoryId : string}>}) {
     const { parentCategoryId } = await params;

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
      <Header></Header>
      <div className={styles.listSection}>
        <SubCategorySection parentCategoryId={parentCategoryId}/>
      </div>
    </>
  );
}