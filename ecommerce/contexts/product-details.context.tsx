"use client";
import { createContext , useContext, useState, useCallback, ReactNode } from "react";
import { Product } from "@/models/product.model";
import { fetchProductById } from "@/lib/api-product";

interface ProductContextValue {

    product : Product | null;
    loading : boolean;
    error : string | null;
    loadProduct : (id : number) => Promise<void>;
}

const ProductContext = createContext<ProductContextValue | undefined>(undefined);


export function ProductDetailsProvider({children }: {children : ReactNode}){

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadProduct = useCallback(async (id : number) => {
        setError("");
        setLoading(true);
        try {
            const data = await fetchProductById(id);
            setProduct(data);
        }
        catch (err){
            setError(err instanceof Error ? err.message : "Erreur inconnue");
        }
        finally{
            setLoading(false);
        }


    }, []);

    return(
        <ProductContext.Provider value={{ product, loading, error, loadProduct}}>
            {children}
        </ProductContext.Provider>
    );

}

export function useProduct(){
    const ctx = useContext(ProductContext);
    if (!ctx) throw new Error("useProduct must be used within ProductDetailsProvider");
    return ctx;
}
