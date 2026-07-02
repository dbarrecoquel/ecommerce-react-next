import SubCategoryDetails from "@/components/category/category-details";
import styles from "./page.module.css";

export default async function SubCatDetails({params} : {params : Promise<{parentCategoryId : number, id : number}>}) {
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
        <SubCategoryDetails parentCategoryId={parentCategoryId} id={id}/>
      </div>
    </>
  );
}