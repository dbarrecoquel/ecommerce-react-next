"use client";

import { ProductLineItem } from "@/models/basket.model";
import styles from "./basket-line-item.module.css";
import { formatPrice } from "@/hooks/utils";

interface BasketLineItemProps {
  item: ProductLineItem;
  onRemove: (id: number) => void;
  onQuantityChange: (id: number, qty: number) => void;
}



export default function BasketLineItem({ item, onRemove, onQuantityChange }: BasketLineItemProps) {
  return (
    <div className={styles.item}>
      <div className={styles.productInfo}>
        <div className={styles.imagePlaceholder}>🛍️</div>
        <div className={styles.details}>
          <p className={styles.name}>{item.product.name}</p>
          <p className={styles.sku}>Réf. #{item.product.sku}</p>
          <p className={styles.unitPrice}>{formatPrice(item.unitPrice)} / unité</p>
        </div>
      </div>

      <div className={styles.qtyWrapper}>
        <button
          className={styles.qtyBtn}
          onClick={() => onQuantityChange(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          −
        </button>
        <span className={styles.qty}>{item.quantity}</span>
        <button
          className={styles.qtyBtn}
          onClick={() => onQuantityChange(item.id, item.quantity + 1)}
        >
          +
        </button>
      </div>

      <div className={styles.lineTotal}>
        {formatPrice(item.unitPrice * item.quantity)}
      </div>

      <button
        className={styles.removeBtn}
        onClick={() => onRemove(item.id)}
        aria-label="Supprimer l'article"
      >
        ✕
      </button>
    </div>
  );
}