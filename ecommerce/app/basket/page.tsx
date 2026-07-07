"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useBasket } from "@/contexts/basket.context";
import { clearBasket, removeLineItem, updateQuantity } from "@/lib/api-basket";
import BasketLineItem from "@/components/basket/basket-line-item";
import styles from "./page.module.css";
import { formatPrice } from "@/hooks/utils";



type ToastState = { type: "success" | "error"; message: string } | null;

export default function BasketPage() {
  const { basket, loading, loadBasket, refreshCount } = useBasket();
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    loadBasket();
  }, [loadBasket]);

  // Auto-fermeture du toast après 3s
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleRemove = async (id: number) => {
    try {
      const res = await removeLineItem(id);
      setToast({ type: "success", message: res.message });
      await loadBasket();
      await refreshCount();
    } catch (e) {
      setToast({ type: "error", message: e instanceof Error ? e.message : "Erreur lors de la suppression" });
    }
  };

  const handleQuantityChange = async (id: number, qty: number) => {
    if (qty < 1) return;
    try {
      const res = await updateQuantity({ lineItemId: id, quantity: qty });
      setToast({ type: "success", message: res.message });
      await loadBasket();
      await refreshCount();
    } catch (e) {
      setToast({ type: "error", message: e instanceof Error ? e.message : "Erreur lors de la modification" });
    }
  };

  const handleClearBasket = async () => {
    try{
        const res = await clearBasket();
        setToast({type : "success", message : res.message})
        await loadBasket();
        await refreshCount();
    }
    catch (e){

      setToast({ type: "error", message: e instanceof Error ? e.message : "Erreur lors de la suppression" });
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSkeleton} />
      </div>
    );
  }

  return (
    <>
      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          <span>{toast.type === "success" ? "✅" : "❌"}</span>
          <span className={styles.toastMessage}>{toast.message}</span>
          <button className={styles.toastClose} onClick={() => setToast(null)}>✕</button>
        </div>
      )}

      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Mon panier</h1>
          <Link href="/products" className={styles.backBtn}>← Continuer mes achats</Link>
         
        </div>
        {!basket || basket.items.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🛒</span>
            <p>Votre panier est vide.</p>
            <Link href="/products" className={styles.shopBtn}>Découvrir nos produits</Link>
          </div>
        ) : (
          <div className={styles.layout}>
            <div className={styles.itemsCard}>
              <p className={styles.itemCount}>
                {basket.itemCount} article{basket.itemCount > 1 ? "s" : ""}
                 <button className={styles.checkoutBtn} onClick={() => handleClearBasket()}>
                    Vider le panier
                </button>
              </p>
              {basket.items.map((item) => (
                <BasketLineItem
                  key={item.id}
                  item={item}
                  onRemove={handleRemove}
                  onQuantityChange={handleQuantityChange}
                />
              ))}
            </div>

            <div className={styles.summaryCard}>
              <h2 className={styles.summaryTitle}>Récapitulatif</h2>
              <div className={styles.summaryRow}>
                <span>Sous-total</span>
                <span>{formatPrice(basket.total)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Livraison</span>
                <span className={styles.free}>Gratuite</span>
              </div>
              <div className={styles.summaryDivider} />
              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <span>Total</span>
                <span>{formatPrice(basket.total)}</span>
              </div>
              <button className={styles.checkoutBtn}>
                Passer la commande →
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}