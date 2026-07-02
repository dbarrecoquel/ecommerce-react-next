"use client";
import { createContext , useContext, useState, useCallback, ReactNode } from "react";
import { SubCategory } from "@/models/category.model";
import { fetchSubCategories } from "@/lib/api-category";

interface SubCategoryContextValue {

    subCategory : SubCategory | null;
    loading : boolean;
    error : string | null;
    loadSubCategory : (id : number) => Promise<void>;
}
const SubCategoryContext = createContext<SubCategoryContextValue | undefined>(undefined);

export function SubCategoryProvider({children }: {children : ReactNode}){

    const [subCategory, setSubCategory] = useState<SubCategory | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadSubCategory = useCallback(async (id : number) => {

        setLoading(true);
        setError("");

        try {
            const data = await fetchSubCategories(id);
            setSubCategory(data);
        }
        catch(err){
            setError(err  instanceof Error ? err.message : "Erreur inconnue");
        }
        finally {
            setLoading(false);
        }

    }, [])

    return (
        <SubCategoryContext.Provider value={{subCategory, loading, error, loadSubCategory}}>
            {children}
        </SubCategoryContext.Provider>
    )

}

export function useSubCategory(){
    const ctx = useContext(SubCategoryContext);
    if (!ctx) throw new Error("useSubCategory must be within SubCategoryProvider");
    return ctx;
}