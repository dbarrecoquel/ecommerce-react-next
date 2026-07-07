"use client";
import { fetchProducts } from "@/lib/api-product";
import { ProductList, ProductSearchParams } from "@/models/product.model";
import { createContext , useContext, useState, useCallback, ReactNode } from "react";


interface ProductsSearchValue{

    products : ProductList | null;
    loading : boolean;
    error : string | null;
    searchParams : ProductSearchParams;
    loadProducts : (params : ProductSearchParams) => Promise<void>;
    setSearchParams : (params : ProductSearchParams) => void;
}

const ProductsSearchContext = createContext<ProductsSearchValue | undefined>(undefined);

export function ProductsSearchProvider({children} : {children : ReactNode}){

    const [products, setProducts] = useState<ProductList | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useState<ProductSearchParams>({ page: 0, size: 10 });

    const loadProducts = useCallback(async (params ?: ProductSearchParams) => {
        const effectiveParams = params ?? searchParams;
        setSearchParams(effectiveParams);
        setLoading(true);
        setError("");

        try {
            const data = await fetchProducts(effectiveParams);
            setProducts(data);
        }
        catch(err){
            setError(err instanceof Error ? err.message : "Erreur inconnue");
        }
        finally{
            setLoading(false);
        }

    },[])

    return (
        <ProductsSearchContext.Provider value={{products,loading,error,searchParams,loadProducts,setSearchParams}}>
            {children}
        </ProductsSearchContext.Provider>
    )
}

export function useProductSearch(){
    const ctx = useContext(ProductsSearchContext);
    if (!ctx) throw new Error("useProductSearch must be used withing ProductSearchProvider");
    return ctx;
}