import { AddToBasketRequest, BasketItemCount, MessageResponse } from "@/models/basket.model";

const API_BASE = "http://localhost:8082/api";

export async function fetchBasketCount() : Promise<number> {

    try {
        const res = await fetch(`${API_BASE}/basket/count`, {
            cache : "no-store",
            credentials: "include",
        });
        if (!res.ok) return 0;
        const data : BasketItemCount = await res.json();
        return data.count ?? 0;
    }
    catch {
        return 0;
    }

}

export async function addToBasket(request : AddToBasketRequest) : Promise<MessageResponse>{
    const res = await fetch(`${API_BASE}/basket/add`, {
        method : "POST",
        headers : {
            "Content-Type" : "application/json",

        },
        credentials : "include",
        body : JSON.stringify(request)
    })
    if (!res.ok) throw new Error("Erreur lors de l'ajout au panier");
    return res.json();
}