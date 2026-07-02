"use client";

import { useSubCategory } from "@/contexts/subcategory.context";
import styles from "./category-list.module.css";
import CategoryItem from "./category-item";

export default function SubCategoryList() {

    const {subCategory, loading, error} = useSubCategory();

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

    if (!subCategory?.subCategories || subCategory.subCategories.length === 0){
         return (
            <div className={styles.stateContainer}>
                <div className={styles.emptyBox}>
                <span className={styles.emptyIcon}>🔍</span>
                <p>Aucune category ne correspond à vos critères.</p>
                </div>
            </div>
         );
    }

    return (
        <div className={styles.grid}>
            {
                subCategory?.subCategories.map((category)=>  (
                    <CategoryItem key={category.id} category={category}></CategoryItem>
                ))
            }
        </div>
    )

}