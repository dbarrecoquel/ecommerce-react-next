"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth.context";
import ProfileSidebar from "@/components/profile/profile-sidebar";
import styles from "./layout.module.css";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, hydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) router.replace("/login");
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated || !isAuthenticated) return null;

  return (
    <main className="main-content">
      <div className={styles.container}>
        <ProfileSidebar />
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </main>
  );
}