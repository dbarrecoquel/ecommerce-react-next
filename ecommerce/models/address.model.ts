export interface Address{
    label : string;
    street : string;
    complement : string;
    postalCode : string;
    city : string;
    country : string;
    addressType : "SHIPPING" | "BILLING";
    isDefault : boolean;
}