export interface Product {

    id : number;
    name : string;
    sku : string;
    description : string;
    price : number;

}

export interface ProductList{

    size : number;
    last : boolean;
    totalPages : number;
    page : number;
    content : Product[];
    totalElements : number;

}
export interface ProductSearchParams{
    page? : number;
    sortBy? : "price";
    direction? : "ASC" | "DESC";
    search? : string;
    minPrice? : number;
    maxPrice? : number;
    size? : number;

}