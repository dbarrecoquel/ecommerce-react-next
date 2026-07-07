"use client";

import { useRouter } from "next/navigation";
import styles from "./pagination.module.css";

interface PaginatedData {
  page: number;
  totalPages: number;
  last: boolean;
}

interface PaginationProps {
  data: PaginatedData | null;
  basePath: string;
  extraParams?: Record<string, string | number | undefined>;
  onPageChange?: (page: number) => void; // ← callback optionnel
}
export default function Pagination({ data, basePath, extraParams = {}, onPageChange }: PaginationProps) {
  const router = useRouter();

  if (!data || data.totalPages <= 1) return null;

  const currentPage = data.page ?? 0;
  const totalPages = data.totalPages;

  const goToPage = (p: number) => {
    const q = new URLSearchParams();
    q.set("page", String(p));
    Object.entries(extraParams).forEach(([key, val]) => {
      if (key === "page" || key === "size") return;
      if (val !== undefined && val !== "") q.set(key, String(val));
    });
    router.push(`${basePath}?${q.toString()}`);
    onPageChange?.(p); // ← déclenche le rechargement
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <div className={styles.container}>
      <button
        className={styles.btn}
        disabled={currentPage === 0}
        onClick={() => goToPage(currentPage - 1)}
      >
        ← Précédent
      </button>
      <div className={styles.pages}>
        {pages.map((p) => (
          <button
            key={p}
            className={`${styles.pageBtn} ${p === currentPage ? styles.active : ""}`}
            onClick={() => goToPage(p)}
          >
            {p + 1}
          </button>
        ))}
      </div>
      <button
        className={styles.btn}
        disabled={data.last}
        onClick={() => goToPage(currentPage + 1)}
      >
        Suivant →
      </button>
    </div>
  );
}