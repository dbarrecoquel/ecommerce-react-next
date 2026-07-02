import { useProductSearch } from "@/contexts/products.context";
import styles from "./product-list.module.css";
import ProductListItem from "./product-list-item";

export default function ProductsSearch(){

    const {products, loading, error} = useProductSearch();
    
    if (loading){
        
        return (
            <div className={styles.stateContainer}>
                <div className={styles.skeletonGrid}>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className={styles.skeleton} />
                    ))}

                </div>
            </div>
        )
    }
    if (error){
        
        return (
            <div className={styles.stateContainer}>
                <div className={styles.errorBox}>
                <span className={styles.errorIcon}></span>
                <p>{error}</p>
                </div>
            </div>
        );

    }
    if (!products?.content || products.content.length === 0){
         return (
            <div className={styles.stateContainer}>
                <div className={styles.emptyBox}>
                <span className={styles.emptyIcon}>🔍</span>
                <p>Aucun produit ne correspond à vos critères.</p>
                </div>
            </div>
         );
    }
    return (
        <div>
        <div className={styles.grid}>
            {
                products?.content.map((product)=>  (
                    <ProductListItem key={product.id} product={product}></ProductListItem>
                ))
            }
        </div>
        </div>
    )

}