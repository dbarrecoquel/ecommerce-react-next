import { Category, SubCategory, SubCategoryDetails } from "@/models/category.model";
import { ProductSearchParams } from "@/models/product.model";

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
export async function fetchSubCategoryDetails(
  parentCategoryId: number,
  id: number,
  params: ProductSearchParams = { page: 0, size: 10 }
): Promise<SubCategoryDetails> {
  const q = new URLSearchParams();
  if (params.page !== undefined) q.set("page", String(params.page));
  if (params.size !== undefined) q.set("size", String(params.size));
  if (params.search) q.set("search", params.search);
  if (params.minPrice !== undefined) q.set("minPrice", String(params.minPrice));
  if (params.maxPrice !== undefined) q.set("maxPrice", String(params.maxPrice));
  if (params.sortBy) q.set("sortBy", params.sortBy);
  if (params.direction) q.set("direction", params.direction);

  const res = await fetch(`${API_BASE}/categories/${parentCategoryId}/${id}?${q.toString()}`);
  if (!res.ok) throw new Error("Erreur lors du chargement du détail de la catégorie");
  return res.json();
}