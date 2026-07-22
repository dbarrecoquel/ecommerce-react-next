export interface ShippingMethod{
    id : number;
    name : string;
    description : string;
    destinationCountry : string;
    cost : number;
    estimatedDays : number;
    enabled : boolean;
    createdAt : string;
    updatedAt : string;
}