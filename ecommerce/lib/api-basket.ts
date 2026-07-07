import { AddToBasketRequest, BasketItemCount, BasketResponse, MessageResponse, UpdateQuantityRequest } from "@/models/basket.model";

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
export async function fetchBasket() : Promise<BasketResponse> {

    const res = await fetch(`${API_BASE}/basket`, {
        cache : "no-store",
        credentials: "include",
    });
    if (!res.ok) throw new Error("cannot handle basket");
    const data : BasketResponse = await res.json();
    return data;

}

export async function updateQuantity(request : UpdateQuantityRequest) : Promise<MessageResponse>{

       const res = await fetch(`${API_BASE}/basket/update/${request.lineItemId}`, {
        method : "POST",
        headers : {
            "Content-Type" : "application/json",

        },
        credentials : "include",
        body : JSON.stringify({quantity : request.quantity})
    })
    if (!res.ok) throw new Error("Erreur lors de la modification de quantité");
    return res.json();

}

export async function removeLineItem(lineItemId : number) : Promise<MessageResponse>{
    const res = await fetch(`${API_BASE}/basket/remove/${lineItemId}`, {
        method : "DELETE",
        headers : {
            "Content-Type" : "application/json",

        },
        credentials : "include",
    })
    if (!res.ok) throw new Error("Erreur lors de la suppression");
    return res.json();
}
export async function clearBasket() : Promise<MessageResponse>{
    const res = await fetch(`${API_BASE}/basket/clear`, {
        method : "DELETE",
        headers : {
            "Content-Type" : "application/json",

        },
        credentials : "include",
    })
    if (!res.ok) throw new Error("Erreur lors de la suppression");
    return res.json();
}