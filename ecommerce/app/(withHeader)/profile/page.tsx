"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth.context";
import ProfileForm from "@/components/profile/profile-form";
import styles from "./page.module.css";

export default function ProfilePage() {
  const { isAuthenticated, hydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // On attend que le localStorage soit lu avant de juger
    if (!hydrated) return;
    if (!isAuthenticated) router.replace("/login");
  }, [hydrated, isAuthenticated, router]);

  // Tant que la rehydratation n'est pas terminée, on ne rend rien
  if (!hydrated) return null;
  if (!isAuthenticated) return null;

  return (
    <div className={styles.page}>
      <ProfileForm />
    </div>
  );
}