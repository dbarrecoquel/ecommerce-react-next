"use client";

import { useCatalog } from "@/contexts/category.context";
import styles from "./category-list.module.css";
import CategoryItem from "./category-item";

export default function CatalogList() {

    const {catalogs, loading, error} = useCatalog();

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

    if (!catalogs || catalogs.length === 0){
         return (
            <div className={styles.stateContainer}>
                <div className={styles.emptyBox}>
                <span className={styles.emptyIcon}>🔍</span>
                <p>Aucun catalog ne correspond à vos critères.</p>
                </div>
            </div>
         );
    }

    return (
        <div className={styles.grid}>
            {
                catalogs.map((catalog)=>  (
                    <CategoryItem key={catalog.id} category={catalog}></CategoryItem>
                ))
            }
        </div>
    )

}