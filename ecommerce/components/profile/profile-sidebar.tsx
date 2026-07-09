"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./profile-sidebar.module.css";

const NAV_ITEMS = [
  { href: "/profile", label: "Mon profil", icon: "👤" },
  { href: "/profile/update-password", label: "Mot de passe", icon: "🔒" },
];

export default function ProfileSidebar() {
  const pathname = usePathname();

  return (
    <nav className={styles.sidebar}>
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`${styles.item} ${pathname === item.href ? styles.active : ""}`}
        >
          <span className={styles.icon}>{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}