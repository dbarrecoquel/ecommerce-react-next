"use client";
import { useProduct } from "@/contexts/product-details.context";
import { use, useEffect, useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import SearchBar from "@/components/searchbar/searchbar";
import QuantityInput from "@/components/quantity/quantity";
import Header from "@/components/header/header";
function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(price);
}
export default  function ProductDetailsPage({ params }: { params: Promise<{ id: string }>}){

    const {id} = use(params);
    const {product, loading, error, loadProduct} = useProduct();
    const [qty, setQty] = useState(1);
    useEffect(() => {
        loadProduct(Number(id));
    }, [id, loadProduct]);

    if (loading){
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSkeleton} />
            </div>
            );
    }

    if (error) {
        return (
        <div className={styles.errorContainer}>
            <span>⚠️</span>
            <p>{error}</p>
            <Link href="/" className={styles.backLink}>← Retour sur la page d'acceuil</Link>
        </div>
        );
    }
    if (!product) return null;

     return (
      <>
    <Header></Header>
    <div className={styles.container}>
      <Link href="/" className={styles.backBtn}>← Retour sur la page d'acceuil</Link>

      <div className={styles.card}>
        <div className={styles.imageBanner}>
        </div>

        <div className={styles.content}>
          <div className={styles.topRow}>
            <div>
              <h1 className={styles.title}>{product.name}</h1>
            </div>
            <div className={styles.priceBox}>
              <span className={styles.price}>{formatPrice(product.price)}</span>
            </div>
          </div>

         

          <div className={styles.description}>
            <h2 className={styles.sectionTitle}>Description</h2>
            <p className={styles.descriptionText}>{product.description}</p>
          </div>

          <div className={styles.buyRow}>
            <div className={styles.qtyGroup}>
              <label className={styles.qtyLabel}>Quantité</label>
              <QuantityInput min={1} max={99} initial={1} onChange={setQty} />
            </div>
            <div className={styles.totalGroup}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalPrice}>
                {formatPrice(product.price * qty)}
              </span>
            </div>
            <button className={styles.addToCartBtn}>
              🛒 Ajouter au panier
            </button>
          </div>

          <div className={styles.metaRow}>
            <span className={styles.metaItem}>Réf. #{product.sku}</span>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}