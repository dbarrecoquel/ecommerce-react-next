"use client";

import { createContext, useContext, useState,useCallback, ReactNode } from "react";
import { Address } from "@/models/address.model";
import { getAddresses } from "@/lib/api-user";

interface AddressContextValue {
    addresses : Address[];
    loading : boolean;
    error : string | null;
    loadAddresses : (authHeaders : Record<string,string>) => Promise<void>;
}

const AddressContext = createContext<AddressContextValue | undefined>(undefined);

export function AddressProvider({children} : {children : ReactNode}){

    const [addresses, setAdresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadAddresses = useCallback(async (authHeaders : Record<string, string>) => {
        setLoading(true);
        setError(null);
        try{
            const data = await getAddresses(authHeaders);
            setAdresses(data);
        }
        catch (e){
            setError(e instanceof Error ? e.message : "Erreur inconnue");
        }
        finally{
            setLoading(false);
        }
    }, [])

    return (
        <AddressContext.Provider value={{ addresses, loading, error, loadAddresses}}>
            {children}
        </AddressContext.Provider>
    )

}
export function useAddress(){
    const ctx = useContext(AddressContext);
    if (!ctx) throw new Error("useAddress must be used withing AddressProvider");
    return ctx;
}