
import ProductSearchSection from "@/components/product/search-product-section";
import { ProductSearchParams } from "@/models/product.model";
import styles from "./page.module.css";
import SearchBar from "@/components/searchbar/searchbar";
interface ProductSearchItemProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
export default async function ProductSearchPage({searchParams}: ProductSearchItemProps){

    const sp = await searchParams;
    const params : ProductSearchParams = {
        page : sp.page ? Number(sp.page) : 0,
        sortBy : (sp.sortBy as "price") ?? undefined,
        direction : (sp.direction as "ASC" | "DESC") ?? undefined,
        search : typeof sp.search === "string" ? sp.search : undefined,
        minPrice : sp.minPrice ? Number(sp.minPrice) : undefined,
        maxPrice : sp.maxPrice ? Number(sp.maxPrice) : undefined,
        size : 10
    }
  return(<>
        <div className={styles.hero}>
            <h1 className={styles.heroTitle}>
            Trouvez votre <span className={styles.accent}>produit idéal</span>
            </h1>
            <p className={styles.heroSub}>
            Des milliers de produits au meilleur prix
            </p>
        </div>
        <div className={styles.searchSection}>
            <SearchBar initialParams={params} />
        </div>
        <div className={styles.listSection}>
            <ProductSearchSection params={params}></ProductSearchSection>
        </div>
    </>
  )
}