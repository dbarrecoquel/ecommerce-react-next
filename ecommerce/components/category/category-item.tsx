import Link from "next/link";
import { Category } from "@/models/category.model";
import styles from "./category-item.module.css";
interface CategoryItemProps {
    category: Category;
}

export default function CategoryItem({category} : CategoryItemProps) {
    const urlPath = category.parentCategoryId ? `${category.parentCategoryId}/${category.id}` : `${category.id}`;
    return (
        <Link href={`/categories/${urlPath}`} className={styles.card}>
            <div className={styles.imagePlaceholder}>
            </div>
            <div className={styles.body}>
                <h3 className={styles.title}>{category.name}</h3>
            </div>
            
        </Link>
    )
} 