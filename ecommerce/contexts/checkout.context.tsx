"use client";

import { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";
import { BasketResponse } from "@/models/basket.model";
import { Address } from "@/models/address.model";
import {
  getCheckoutAddresses,
  setCheckoutAddresses,
  getProfileAddresses,
  createCheckoutAddress,
  CheckoutAddressesRequest,
  CheckoutShippingMethodRequest,
  getShippingMethods,
  setCheckoutShippingMethod,
} from "@/lib/api-checkout";
import { ShippingMethod } from "@/models/shipping-method.model";

interface CheckoutContextValue {
  basket: BasketResponse | null;
  addresses: Address[];
  shippingMethods: ShippingMethod[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  loadCheckout: (authHeaders: Record<string, string>) => Promise<void>;
  loadShippingMethods: (authHeaders: Record<string, string>) => Promise<void>;
  submitAddresses: (req: CheckoutAddressesRequest, authHeaders: Record<string, string>) => Promise<void>;
  submitShippingMethod: (req: CheckoutShippingMethodRequest, authHeaders: Record<string, string>) => Promise<void>;
  addAddress: (address: Omit<Address, "id">, authHeaders: Record<string, string>) => Promise<Address>;
}

const CheckoutContext = createContext<CheckoutContextValue | undefined>(undefined);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [basket, setBasket] = useState<BasketResponse | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkoutLoaded = useRef(false);
  const shippingLoaded = useRef(false);

  const loadCheckout = useCallback(async (authHeaders: Record<string, string>) => {
    if (checkoutLoaded.current) return;
    checkoutLoaded.current = true;
    setLoading(true);
    setError(null);
    try {
      const [basketData, addressesData] = await Promise.all([
        getCheckoutAddresses(authHeaders),
        getProfileAddresses(authHeaders),
      ]);
      setBasket(basketData);
      setAddresses(addressesData);
    } catch (e) {
      checkoutLoaded.current = false;
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadShippingMethods = useCallback(async (authHeaders: Record<string, string>) => {
    if (shippingLoaded.current) return;
    shippingLoaded.current = true;
    setLoading(true);
    setError(null);
    try {
      const [basketData, methodsData] = await Promise.all([
        getCheckoutAddresses(authHeaders),
        getShippingMethods(authHeaders),
      ]);
      setBasket(basketData);
      setShippingMethods(methodsData);
    } catch (e) {
      shippingLoaded.current = false;
      setError(e instanceof Error ? e.message : "Erreur inconnue");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitAddresses = useCallback(async (
    req: CheckoutAddressesRequest,
    authHeaders: Record<string, string>
  ) => {
    setSaving(true);
    try {
      await setCheckoutAddresses(req, authHeaders);
      setBasket((prev) => prev ? {
        ...prev,
        shippingAddressId: req.shippingAddressId,
        billingAddressId: req.billingAddressId,
      } : prev);
      // Reset le flag shipping pour forcer le rechargement à l'étape suivante
      shippingLoaded.current = false;
    } finally {
      setSaving(false);
    }
  }, []);

  const submitShippingMethod = useCallback(async (
    req: CheckoutShippingMethodRequest,
    authHeaders: Record<string, string>
  ) => {
    setSaving(true);
    try {
      await setCheckoutShippingMethod(req, authHeaders);
    } finally {
      setSaving(false);
    }
  }, []);

  const addAddress = useCallback(async (
    address: Omit<Address, "id">,
    authHeaders: Record<string, string>
  ) => {
    const created = await createCheckoutAddress(address, authHeaders);
    setAddresses((prev) => [...prev, created]);
    return created;
  }, []);

  return (
    <CheckoutContext.Provider value={{
      basket, addresses, shippingMethods, loading, saving, error,
      loadCheckout, loadShippingMethods, submitAddresses, submitShippingMethod, addAddress,
    }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used within CheckoutProvider");
  return ctx;
}