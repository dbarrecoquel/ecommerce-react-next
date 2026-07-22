import { fetchWithAuth } from "@/lib/api";
import { BasketResponse } from "@/models/basket.model";
import { Address } from "@/models/address.model";
import { ShippingMethod } from "@/models/shipping-method.model";

const API_BASE = "http://localhost:8082/api";

export interface CheckoutAddressesRequest {
  shippingAddressId: number;
  billingAddressId: number;
}
export interface CheckoutShippingMethodRequest{
    id : number;
}

export async function getCheckoutAddresses(
  authHeaders: Record<string, string>
): Promise<BasketResponse> {
  const res = await fetchWithAuth(`${API_BASE}/checkout/addresses`, authHeaders);
  if (!res.ok) throw new Error("Impossible de charger le checkout");
  return res.json();
}

export async function setCheckoutAddresses(
  request: CheckoutAddressesRequest,
  authHeaders: Record<string, string>
): Promise<void> {
  const res = await fetchWithAuth(`${API_BASE}/checkout/addresses`, authHeaders, {
    method: "POST",
    body: JSON.stringify(request),
  });
  if (!res.ok) throw new Error("Erreur lors de la sélection des adresses");
}

export async function createCheckoutAddress(
  address: Omit<Address, "id">,
  authHeaders: Record<string, string>
): Promise<Address> {
  const res = await fetchWithAuth(`${API_BASE}/profile/addresses`, authHeaders, {
    method: "POST",
    body: JSON.stringify(address),
  });
  if (!res.ok) throw new Error("Erreur lors de la création de l'adresse");
  return res.json();
}

export async function getProfileAddresses(
  authHeaders: Record<string, string>
): Promise<Address[]> {
  const res = await fetchWithAuth(`${API_BASE}/profile/addresses`, authHeaders);
  if (!res.ok) throw new Error("Impossible de charger les adresses");
  return res.json();
}
export async function getShippingMethods(
  authHeaders: Record<string, string>
): Promise<ShippingMethod[]> {
  const res = await fetchWithAuth(`${API_BASE}/checkout/shipping-methods`, authHeaders);
  if (!res.ok) throw new Error("Impossible de charger le checkout");
  return res.json();
}
export async function setCheckoutShippingMethod(
  request: CheckoutShippingMethodRequest,
  authHeaders: Record<string, string>
): Promise<void> {
  const res = await fetchWithAuth(`${API_BASE}/checkout/shipping-methods`, authHeaders, {
    method: "POST",
    body: JSON.stringify(request),
  });
  if (!res.ok) throw new Error("Erreur lors de la sélection des shipping methods");
}