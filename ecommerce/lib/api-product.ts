import { ProductList, ProductSearchParams } from "@/models/product.model";

const API_BASE = "http://localhost:8082/api";



export async function fetchProducts(params : ProductSearchParams) : Promise<ProductList> {

    const query = new URLSearchParams();

    if (params.page) query.set("page",String(params.page));
    if (params.search) query.set("search", params.search);
    if (params.direction) query.set("direction",params.direction);
    if (params.sortBy) query.set("sortBy", params.sortBy);
    if (params.minPrice) query.set("minPrice", String(params.minPrice));
    if (params.maxPrice) query.set("maxPrice", String(params.maxPrice));

    const res = await fetch (`${API_BASE}/products?${query.toString()}`, {cache : "no-store"});
    if (!res.ok) throw new Error("Erreur lors du chargement des produits");
    return res.json();
    
}

export async function fetchProductById(id : number){
    const res = await fetch (`${API_BASE}/products/${id}`, {cache : "no-store"});
    if (!res.ok) throw new Error("Erreur lors du chargement du produit");
    return res.json();
}