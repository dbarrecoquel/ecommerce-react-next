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

export interface ProductSearchParams {
  page?: number;
  size?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price";
  direction?: "ASC" | "DESC";
  [key: string]: string | number | undefined;
}