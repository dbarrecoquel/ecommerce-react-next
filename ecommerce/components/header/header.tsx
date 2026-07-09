"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useAuth } from "@/contexts/auth.context";
import HeaderSearchInput from "./header-search-input";
import BasketIcon from "../basket/basket-icon";
import styles from "./header.module.css";

export default function Header() {
  const { isAuthenticated, user, signOut } = useAuth();

  // Déconnexion automatique si le serveur retourne 401
  useEffect(() => {
    const handler = () => signOut();
    window.addEventListener("auth:expired", handler);
    return () => window.removeEventListener("auth:expired", handler);
  }, [signOut]);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>🏡</span>
          <span className={styles.logoText}>Ecommerce</span>
        </Link>

        <div className={styles.center}>
          <HeaderSearchInput />
        </div>

        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>Accueil</Link>
          <Link href="/products" className={styles.navLink}>Produits</Link>

          {isAuthenticated ? (
            <>
              <Link href="/profile" className={styles.navLink}>
                👤 {user?.firstName}
              </Link>
              <button onClick={signOut} className={styles.signOutBtn}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.navLink}>Se connecter</Link>
              <Link href="/register" className={styles.navLinkPrimary}>S'enregistrer</Link>
            </>
          )}

          <BasketIcon />
        </nav>
      </div>
    </header>
  );
}