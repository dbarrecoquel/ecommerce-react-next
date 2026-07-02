import { Product } from "./product.model";

export interface Category {
    id : number;
    name : string;
    parentCategoryId : null;
}

export interface SubCategory {
    category : Category;
    subCategories : Category[];
    breadcrumb : Category[];
}

export interface SubCategoryDetails {

    content : Product[];
    empty : boolean;
    first : boolean;
    totalElements : number;
    totalPages : number;
    number : number;
}