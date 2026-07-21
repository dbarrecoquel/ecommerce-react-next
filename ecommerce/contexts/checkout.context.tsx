"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { BasketResponse } from "@/models/basket.model";
import { Address } from "@/models/address.model";
import {
  getCheckoutAddresses,
  setCheckoutAddresses,
  getProfileAddresses,
  createCheckoutAddress,
  CheckoutAddressesRequest,
} from "@/lib/api-checkout";

interface CheckoutContextValue {
  basket: BasketResponse | null;
  addresses: Address[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  loadCheckout: (authHeaders: Record<string, string>) => Promise<void>;
  submitAddresses: (req: CheckoutAddressesRequest, authHeaders: Record<string, string>) => Promise<void>;
  addAddress: (address: Omit<Address, "id">, authHeaders: Record<string, string>) => Promise<Address>;
}

const CheckoutContext = createContext<CheckoutContextValue | undefined>(undefined);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [basket, setBasket] = useState<BasketResponse | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCheckout = useCallback(async (authHeaders: Record<string, string>) => {
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
      setError(e instanceof Error ? e.message : "Erreur inconnue");
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
      basket, addresses, loading, saving, error,
      loadCheckout, submitAddresses, addAddress,
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