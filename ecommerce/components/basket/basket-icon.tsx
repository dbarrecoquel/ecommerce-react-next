"use client";
import Link from "next/link";

import { useBasket } from "@/contexts/basket.context";
import styles from "./basket-icon.module.css";


export default function BasketIcon(){

    const { count } = useBasket();


    return (
    <Link href="/basket" className={styles.wrapper} aria-label={`Panier — ${count} article${count !== 1 ? "s" : ""}`}>
      <span className={styles.icon}>🛒</span>
      {count > 0 && (
        <span className={styles.badge}>
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );

}