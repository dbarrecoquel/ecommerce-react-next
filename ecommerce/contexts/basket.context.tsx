"use client";
import {createContext , useContext, useState, useCallback, useEffect, ReactNode} from "react";
import { fetchBasketCount } from "@/lib/api-basket";

interface BasketContextValue {

    count : number;
    refreshCount: () => Promise<void>;
}

const BasketContext = createContext<BasketContextValue | undefined>(undefined);

export function BasketProvider({children} : {children : ReactNode}) {

    const [count, setCount] = useState(0);

    const refreshCount = useCallback(async () => {
        const n = await fetchBasketCount();
        setCount(n);
    },[]);

    useEffect(() => {
        refreshCount();
    }, [refreshCount]);

    return (
        <BasketContext.Provider value={{count, refreshCount}}>
            {children}
        </BasketContext.Provider>
    )
}
export function useBasket(){
    const ctx = useContext(BasketContext);
    if (!ctx) throw new Error("useBasket mus be used within BasketProvider");
    return ctx;
}