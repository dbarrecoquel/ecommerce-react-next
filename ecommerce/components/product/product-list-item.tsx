import { Product } from "@/models/product.model";
import styles from "./product-list-item.module.css";
import Link from "next/link";
interface ProductItemProps {
    product: Product;
}
function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(price);
}
export default function ProductListItem({product} : ProductItemProps){

    const urlPath = `/products/${product.id}`;
    return (
 <      Link href={`${urlPath}`} className={styles.card}>
            <div className={styles.imagePlaceholder}>
                <div className={styles.imageIcon}></div>
            </div>
            <div className={styles.body}>
                <h3 className={styles.title}>{product.name}</h3>
                <div className={styles.footer}>
                    <span className={styles.price}>{formatPrice(product.price)}</span>
                </div>
            </div>
        </Link>

    )

}