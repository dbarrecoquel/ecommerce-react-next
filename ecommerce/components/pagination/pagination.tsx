"use client";

import { useRouter } from "next/navigation";
import { useProductSearch } from "@/contexts/products.context";
import styles from "./pagination.module.css";

export default function Pagination(){

    const router = useRouter();

    const {products, loadProducts, searchParams} = useProductSearch();

    if (!products || products.totalPages <= 1) return null;

    const currentPage = products.page ?? 0;
    const totalPages = products.totalPages;

    const goToPage = (p : number) => {

        const newParams = {...searchParams, page : p};
        const q = new URLSearchParams();

        q.set("page", String(p));
        if (newParams.search) q.set("search", newParams.search);
        if (newParams.minPrice) q.set("minPrice", String(newParams.minPrice));
        if (newParams.maxPrice) q.set("maxPrice", String(newParams.maxPrice));
        if (newParams.sortBy) q.set("sortBy", newParams.sortBy);
        if (newParams.direction) q.set("direction", newParams.direction);
        if (newParams.size) q.set("size", String(newParams.size));

        router.push(`/products?${q.toString()}`);
        loadProducts(newParams);
        window.scrollTo({top:0, behavior : "smooth"});

    }

    const pages = Array.from({length : totalPages}, (_,i) => i);

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
        disabled={products.last}
        onClick={() => goToPage(currentPage + 1)}
      >
        Suivant →
      </button>
    </div>
  );

}
