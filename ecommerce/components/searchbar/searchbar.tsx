"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ProductSearchParams } from "@/models/product.model";
import { useProductSearch } from "@/contexts/products.context";
import { useDebounce } from "@/hooks/use-debounce";
import styles from "./searchbar.module.css";
interface SearchBarProps {
    initialParams : ProductSearchParams;
}

export default function SearchBar({initialParams}: SearchBarProps){

    const router = useRouter();
    const pathName = usePathname();
    const { loadProducts } = useProductSearch();

    const [search, setSearch] = useState(initialParams.search ?? "");
    const [minPrice, setMinPrice] = useState<number | "">(initialParams.minPrice ?? "");
    const [maxPrice, setMaxPrice] = useState<number | "">(initialParams.maxPrice ?? "");
    const [sortBy, setSortBy] = useState<"price" | "">(initialParams.sortBy ?? "");
    const [direction, setDirection] = useState<"ASC" | "DESC" | "">(initialParams.direction ?? "");

    const debouncedSearch = useDebounce(search, 400);
    const debounceMinPrice = useDebounce(minPrice, 400);
    const debounceMaxPrice = useDebounce(maxPrice, 400);

    const isFirstSearch = useRef(true);
    const isFirstMinPrice = useRef(true);
    const isFirstMaxPrice = useRef(true);

  // Ref sur pathname pour que triggerSearch lise toujours la valeur courante
  // même quand il est appelé depuis une closure (useEffect debounce)
    const pathnameRef = useRef(pathName);

    useEffect(() => { pathnameRef.current = pathName; }, [pathName]);

     const triggerSearch = useCallback((overrides: Partial<ProductSearchParams> = {}) => {
    if (pathnameRef.current !== "/products") return;

    const params: ProductSearchParams = {
      page: 0,
      size: 10,
      search: search || undefined,
      minPrice: minPrice !== "" ? minPrice : undefined,
      maxPrice: maxPrice !== "" ? maxPrice : undefined,
      sortBy: sortBy || undefined,
      direction : direction || undefined, 
      ...overrides,
    };

    const q = new URLSearchParams();
    if (params.search) q.set("search", params.search);
    if (params.minPrice !== undefined) q.set("minPrice", String(params.minPrice));
    if (params.maxPrice !== undefined) q.set("maxPrice", String(params.maxPrice));
    if (params.sortBy) q.set("sortBy", params.sortBy);
    if (params.direction) q.set("direction", params.direction);

    const qs = q.toString();
    router.replace(qs ? `/products?${qs}` : "/products", { scroll: false });
    loadProducts(params);
  }, [search, minPrice, maxPrice, sortBy,direction, loadProducts, router]);

  useEffect(() => {
    if (isFirstSearch.current) { isFirstSearch.current = false; return; }
    triggerSearch({ search: debouncedSearch || undefined });
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isFirstMinPrice.current) { isFirstMinPrice.current = false; return; }
    triggerSearch({ minPrice: debounceMinPrice !== "" ? debounceMinPrice : undefined });
  }, [debounceMinPrice]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isFirstMaxPrice.current) { isFirstMaxPrice.current = false; return; }
    triggerSearch({ maxPrice: debounceMaxPrice !== "" ? debounceMaxPrice : undefined });
  }, [debounceMaxPrice]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleReset = () => {
    setSearch("");
    setMinPrice(""); setMaxPrice(""); setSortBy("");
    setDirection("");
    loadProducts({ page: 0, size: 10 });
    router.replace("/products", { scroll: false });
  };

  const activeCount = [search, minPrice, maxPrice, sortBy, direction].filter(
    (v) => v !== "" && v !== undefined
  ).length;

  return (
    <div className={styles.container}>
      <div className={styles.searchRow}>
        <div className={styles.inputWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Rechercher par nom..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.mainInput}
          />
        </div>



        <select
          className={styles.select}
          value={sortBy}
          onChange={(e) => {
            const val = e.target.value as "price" | "";
            setSortBy(val);
            triggerSearch({ sortBy: val || undefined });
          }}
        >
          <option value="">Trier par</option>
          <option value="price">Prix</option>
        </select>

         <select
          className={styles.select}
          value={direction}
          onChange={(e) => {
            const val = e.target.value as "ASC" | "DESC" | "";
            setDirection(val);
            triggerSearch({ direction: val || undefined });
          }}
        >
          <option value="">Trier par</option>
          <option value="ASC">Ordre croissant</option>
          <option value="DESC">Ordre décroissant</option>
        </select>
      </div>
          
      <div className={styles.priceRow}>
        <div className={styles.priceGroup}>
          <label className={styles.label}>Prix min (€)</label>
          <input
            type="number"
            placeholder="0"
            min={0}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : "")}
            className={styles.priceInput}
          />
        </div>
        <span className={styles.priceSep}>—</span>
        <div className={styles.priceGroup}>
          <label className={styles.label}>Prix max (€)</label>
          <input
            type="number"
            placeholder="Illimité"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : "")}
            className={styles.priceInput}
          />
        </div>

        {activeCount > 0 && (
          <div className={styles.actions}>
            <button onClick={handleReset} className={styles.resetBtn}>
              Réinitialiser <span className={styles.badge}>{activeCount}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}