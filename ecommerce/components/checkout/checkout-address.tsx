"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth.context";
import { useCheckout } from "@/contexts/checkout.context";
import { Address } from "@/models/address.model";
import AddressSelector from "./address-selector";
import AddressForm from "@/components/profile/address/address-form";
import styles from "./checkout-address.module.css";

type NewAddressTarget = "SHIPPING" | "BILLING" | null;
type ToastState = { type: "success" | "error"; message: string } | null;

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency", currency: "EUR", maximumFractionDigits: 2,
  }).format(price);
}

export default function CheckoutAddress() {
  const router = useRouter();
  const { getAuthHeaders } = useAuth();
  const { basket, addresses, loading, saving, error, loadCheckout, submitAddresses, addAddress } = useCheckout();

  const [shippingId, setShippingId] = useState<number | null>(null);
  const [billingId, setBillingId] = useState<number | null>(null);
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [newAddressTarget, setNewAddressTarget] = useState<NewAddressTarget>(null);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    loadCheckout(getAuthHeaders());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pré-sélectionner les adresses déjà sauvegardées sur le panier
  useEffect(() => {
    if (!basket) return;
    if (basket.shippingAddressId) setShippingId(basket.shippingAddressId);
    if (basket.billingAddressId) setBillingId(basket.billingAddressId);
  }, [basket]);

  // Auto-fermeture toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleAddNewAddress = async (data: Omit<Address, "id">) => {
    try {
      const created = await addAddress(data, getAuthHeaders());
      // Sélectionner automatiquement la nouvelle adresse
      if (newAddressTarget === "SHIPPING") setShippingId(created.id);
      if (newAddressTarget === "BILLING") setBillingId(created.id);
      if (sameAsBilling && newAddressTarget === "SHIPPING") setBillingId(created.id);
      setNewAddressTarget(null);
      setToast({ type: "success", message: "Adresse ajoutée et sélectionnée." });
    } catch (e) {
      setToast({ type: "error", message: e instanceof Error ? e.message : "Erreur" });
    }
  };
  const shippingAddresses = addresses.filter((a) => a.addressType === "SHIPPING");
  const billingAddresses = addresses.filter((a) => a.addressType === "BILLING");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveBillingId = sameAsBilling ? shippingId : billingId;
    if (!shippingId || !effectiveBillingId) {
      setToast({ type: "error", message: "Veuillez sélectionner toutes les adresses." });
      return;
    }
    try {
      await submitAddresses(
        { shippingAddressId: shippingId, billingAddressId: effectiveBillingId },
        getAuthHeaders()
      );
      router.push("/checkout/summary");
    } catch (e) {
      setToast({ type: "error", message: e instanceof Error ? e.message : "Erreur" });
    }
  };

  if (loading) return (
    <div className={styles.skeletons}>
      {[1, 2, 3].map((i) => <div key={i} className={styles.skeleton} />)}
    </div>
  );

  if (error) return <p className={styles.errorMsg}>{error}</p>;

  return (
    <>
      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          <span>{toast.type === "success" ? "✅" : "❌"}</span>
          <span className={styles.toastMessage}>{toast.message}</span>
          <button className={styles.toastClose} onClick={() => setToast(null)}>✕</button>
        </div>
      )}

      <div className={styles.layout}>
        <form onSubmit={handleSubmit} className={styles.formSection}>
          <h1 className={styles.pageTitle}>Adresses de livraison</h1>

          {/* Adresse de livraison */}
          <AddressSelector
            title="Adresse de livraison"
            addresses={shippingAddresses}
            selectedId={shippingId}
            onSelect={setShippingId}
            onAddNew={() => setNewAddressTarget("SHIPPING")}
          />

          {/* Même adresse pour facturation */}
          <label className={styles.sameLabel}>
            <input
              type="checkbox"
              checked={sameAsBilling}
              onChange={(e) => setSameAsBilling(e.target.checked)}
              className={styles.checkbox}
            />
            Utiliser la même adresse pour la facturation
          </label>

          {/* Adresse de facturation */}
          {!sameAsBilling && (
            <AddressSelector
              title="Adresse de facturation"
              addresses={billingAddresses}
              selectedId={billingId}
              onSelect={setBillingId}
              onAddNew={() => setNewAddressTarget("BILLING")}
            />
          )}

          <button
            type="submit"
            className={styles.continueBtn}
            disabled={saving || !shippingId || (!sameAsBilling && !billingId)}
          >
            {saving ? <span className={styles.spinner} /> : "Continuer →"}
          </button>
        </form>

        {/* Récap commande */}
        {basket && (
          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>Récapitulatif</h2>
            <div className={styles.summaryItems}>
              {basket.items.map((item) => (
                <div key={item.id} className={styles.summaryItem}>
                  <span className={styles.summaryItemName}>
                    {item.product?.name}
                    <span className={styles.summaryItemQty}> × {item.quantity}</span>
                  </span>
                  <span>{formatPrice(item.unitPrice * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className={styles.summaryDivider} />
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>{formatPrice(basket.total)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Modal création adresse */}
      {newAddressTarget && (
        <AddressForm
          title={newAddressTarget === "SHIPPING"
            ? "Nouvelle adresse de livraison"
            : "Nouvelle adresse de facturation"}
          initial={{ addressType: newAddressTarget === "SHIPPING" ? "SHIPPING" : "BILLING" }}
          onSubmit={handleAddNewAddress}
          onCancel={() => setNewAddressTarget(null)}
        />
      )}
    </>
  );
}