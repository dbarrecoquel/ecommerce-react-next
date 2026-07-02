"use client";
import { createContext , useContext, useState, useCallback, ReactNode } from "react";
import { Category } from "@/models/category.model";
import { fetchCatalogs } from "@/lib/api-category";

interface CatalogContextValue {

    catalogs : Category[] | null;
    loading : boolean;
    error : string | null;
    loadCatalog : () => Promise<void>;
}

const CatalogContext = createContext<CatalogContextValue | undefined>(undefined);

export function CatalogProvider({children} : {children : ReactNode}){

    const [catalogs, setCatalogs] = useState<Category[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadCatalog = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const data = await fetchCatalogs();
            setCatalogs(data);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Erreur inconnue")
        }
        finally{
            setLoading(false);
        }

    }, []);

    return (
        <CatalogContext.Provider value={{catalogs, loading, error, loadCatalog}}>
            {children}
        </CatalogContext.Provider>
    )
}

export function useCatalog(){
    const ctx = useContext(CatalogContext);
    if (!ctx) throw new Error("useCatalog must be within CatalogProvider");
    return ctx;
}