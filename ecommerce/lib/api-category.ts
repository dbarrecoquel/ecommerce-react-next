import { Category, SubCategory, SubCategoryDetails } from "@/models/category.model";

const API_BASE = "http://localhost:8082/api";

export async function fetchCatalogs() : Promise<Category[]> {

    const res = await fetch (`${API_BASE}/categories`, {cache : "no-store"});
    if (!res.ok) throw new Error("Erreur lors du chargement des categories");
    return res.json();
    
}

export async function fetchSubCategories(id : number) : Promise<SubCategory> {

    const res = await fetch (`${API_BASE}/categories/${id}`);
    if (!res.ok) throw new Error("Erreur lors du chargement des sous categories");
    return res.json();

}

export async function fetchSubCategoryDetails(parentCategoryId : number, id : number) : Promise<SubCategoryDetails> {
    const res = await fetch (`${API_BASE}/categories/${parentCategoryId}/${id}`);
    if (!res.ok) throw new Error("Erreur lors du chargement du details de la categorie");
    return res.json();
}