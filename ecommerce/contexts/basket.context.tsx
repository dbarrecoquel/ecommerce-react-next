"use client";
import {createContext , useContext, useState, useCallback, useEffect, ReactNode} from "react";
import { fetchBasket, fetchBasketCount } from "@/lib/api-basket";
import { BasketResponse } from "@/models/basket.model";

interface BasketContextValue {

    count : number;
    basket : BasketResponse | null;
    loading : boolean;
    refreshCount: () => Promise<void>;
    loadBasket: () => Promise<void>;
}

const BasketContext = createContext<BasketContextValue | undefined>(undefined);

export function BasketProvider({children} : {children : ReactNode}) {

    const [count, setCount] = useState(0);
    const [basket, setBasket] = useState<BasketResponse | null>(null);
    const [loading, setLoading] = useState(false);

    const refreshCount = useCallback(async () => {
        const n = await fetchBasketCount();
        setCount(n);
    },[]);

    const loadBasket = useCallback(async ()=> {

        setLoading(true);
        try {
            const data = await fetchBasket();
            setBasket(data);
            setCount(data.itemCount);

        }
        catch(err){
            setBasket(null);
        }
        finally {
            setLoading(false);
        }

    },[])

    useEffect(() => {
        refreshCount();
    }, [refreshCount]);

    return (
        <BasketContext.Provider value={{count,basket,loading, loadBasket, refreshCount}}>
            {children}
        </BasketContext.Provider>
    )
}
export function useBasket(){
    const ctx = useContext(BasketContext);
    if (!ctx) throw new Error("useBasket mus be used within BasketProvider");
    return ctx;
}