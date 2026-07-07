import { Product } from "./product.model";

export interface AddToBasketRequest{

    productId : number;
    quantity : number;


}

export interface MessageResponse{

    message : string;
}

export interface BasketItemCount{

    count : number;
}

export interface BasketResponse {
    basketId : number;
    items : ProductLineItem[];
    total : number;
    itemCount : number;
    billingAddressId : number;
    shippingAddressId : number;
}

export interface ProductLineItem {
    id : number;
    basketId : number;
    quantity : number;
    unitPrice : number;
    product : Product;
}
export interface UpdateQuantityRequest {
    lineItemId : number;
    quantity : number;
}