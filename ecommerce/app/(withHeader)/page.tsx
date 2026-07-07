import styles from "../page.module.css";
import CatalogSection from "@/components/category/category-section";

export default function Home() {
  return (
    <>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Trouvez votre <span className={styles.accent}>produit idéal</span>
        </h1>
        <p className={styles.heroSub}>
          Des milliers d'annonces produit au meilleur prix
        </p>
      </div>

      <div className={styles.listSection}>
        <CatalogSection />
      </div>
    </>
  );
}