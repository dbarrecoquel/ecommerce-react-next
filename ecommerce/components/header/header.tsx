import Link from "next/link";
import HeaderSearchInput from "./header-search-input";
import styles from "./header.module.css";
import BasketIcon from "../basket/basket-icon";

export default function Header() {
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
          <BasketIcon />
        </nav>
      </div>
    </header>
  );
}