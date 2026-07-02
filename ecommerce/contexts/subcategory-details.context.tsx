"use client";
import { createContext , useContext, useState, useCallback, ReactNode } from "react";
import { SubCategoryDetails } from "@/models/category.model";
import { fetchSubCategoryDetails } from "@/lib/api-category";

interface SubCategoryDetailsValue{

    subCategoryDetails : SubCategoryDetails | null;
    loading : boolean;
    error : string | null;
    loadSubCategoryDetails : (parentCategoryId : number, id : number) => Promise<void>; 
}

const SubCategoryDetailsContext = createContext<SubCategoryDetailsValue | undefined>(undefined);

export function SubCategoryDetailsProvider({children }: {children : ReactNode}){

    const [subCategoryDetails, setSubCategoryDetails] = useState<SubCategoryDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadSubCategoryDetails = useCallback(async (parentCategoryId : number, id : number) => {
        setLoading(true);
        setError("");

        try{
            const data = await fetchSubCategoryDetails(parentCategoryId, id);
            setSubCategoryDetails(data);
        }
        catch(err){
            setError(err instanceof Error ? err.message : "Erreur inconnue");
        }
        finally{
            setLoading(false);
        }

    }, [])

    return (
        <SubCategoryDetailsContext.Provider value={{subCategoryDetails, loading, error, loadSubCategoryDetails}}>
            {children}
        </SubCategoryDetailsContext.Provider>
    )
}

export function useSubCategoryDetails(){
    const ctx = useContext(SubCategoryDetailsContext);
    if (!ctx) throw new Error("useSubCategoryDetails must be used withing subCategoryDetailsProvider");
    return ctx;
}