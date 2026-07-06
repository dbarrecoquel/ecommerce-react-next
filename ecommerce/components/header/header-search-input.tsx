"use client";

import {useState, useRef, useEffect} from "react";
import {useRouter, usePathname} from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import styles from "./header-search-input.module.css";

export default function HeaderSearchInput(){

    const router = useRouter();
    const pathName = usePathname();
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 400);
    const isFirst = useRef(true);
    //sync l'input depuis l'url quand on arrive sur /products

    useEffect(() => {
        if (pathName === "/products"){
            const params = new URLSearchParams(window.location.search);
            setSearch(params.get("search") ?? "");
        }
        else 
            setSearch("");
    }, [pathName]);

    //declancher la navigation apres le debounce
    useEffect(() => {
        if (isFirst.current){
            isFirst.current = false;
            return;
        }
        if (!debouncedSearch.trim()){
            //si on vide le champ depuis /products, on reset les filtres
            if (pathName === "/products") router.replace("/products", {scroll : false});
            return;
        }
        const q = new URLSearchParams();
        q.set("search", debouncedSearch.trim());
        router.push(`/products?${q.toString()}`);

    }, [debouncedSearch]);// eslint-disable-line react-hooks/exhaustive-deps

    const handleKeyDown = (e : React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape") setSearch("");
    };

    return (
        <div className={styles.wrapper}>
            <span className={styles.icon}>🔍</span>
            <input
                type="text"
                placeholder="Rechercher un produit..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                className={styles.input}
            />
            {search && (
                <button
                className={styles.clearBtn}
                onClick={() => setSearch("")}
                aria-label="Effacer la recherche"
                >
                ✕
                </button>
            )}

        </div>
    )



}