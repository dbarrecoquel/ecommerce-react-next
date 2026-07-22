"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth.context";
import { useCheckout } from "@/contexts/checkout.context";
import { ShippingMethod } from "@/models/shipping-method.model";
import styles from "./checkout-shipping.module.css";

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency", currency: "EUR", maximumFractionDigits: 2,
  }).format(price);
}

export default function CheckoutShipping() {
  const router = useRouter();
  const { getAuthHeaders } = useAuth();
  const { basket, shippingMethods, loading, saving, error, loadShippingMethods, submitShippingMethod } = useCheckout();

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
  loadShippingMethods(getAuthHeaders()).catch(() => {
    // Si erreur (400 = adresses manquantes), retour à l'étape adresses
    router.replace("/checkout/addresses");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // Pré-sélectionner la première méthode disponible
  useEffect(() => {
    if (shippingMethods.length > 0 && !selectedId) {
      setSelectedId(shippingMethods[0].id);
    }
  }, [shippingMethods, selectedId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) {
      setToast({ type: "error", message: "Veuillez sélectionner une méthode de livraison." });
      return;
    }
    try {
      await submitShippingMethod({ id: selectedId }, getAuthHeaders());
      router.push("/checkout/summary");
    } catch (err) {
      setToast({ type: "error", message: err instanceof Error ? err.message : "Erreur" });
    }
  };

  if (loading) return (
    <div className={styles.skeletons}>
      {[1, 2].map((i) => <div key={i} className={styles.skeleton} />)}
    </div>
  );

  if (error) return <p className={styles.errorMsg}>{error}</p>;

  const selected = shippingMethods.find((m) => m.id === selectedId) ?? null;

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

          <div className={styles.stepHeader}>
            <button
              type="button"
              className={styles.backBtn}
              onClick={() => router.push("/checkout/addresses")}
            >
              ← Adresses
            </button>
            <h1 className={styles.pageTitle}>Livraison</h1>
          </div>

          {shippingMethods.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>🚚</span>
              <p>Aucune méthode de livraison disponible pour votre adresse.</p>
            </div>
          ) : (
            <div className={styles.methods}>
              {shippingMethods.map((method) => (
                <button
                  type="button"
                  key={method.id}
                  onClick={() => setSelectedId(method.id)}
                  className={`${styles.methodCard} ${selectedId === method.id ? styles.selected : ""}`}
                >
                  <div className={styles.methodLeft}>
                    <div className={styles.radio}>
                      {selectedId === method.id && <div className={styles.radioDot} />}
                    </div>
                    <div className={styles.methodInfo}>
                      <span className={styles.methodName}>{method.name}</span>
                      {method.description && (
                        <span className={styles.methodDesc}>{method.description}</span>
                      )}
                      <span className={styles.methodDays}>
                        🕐 Livraison estimée : {method.estimatedDays} jour{method.estimatedDays > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  <span className={`${styles.methodCost} ${method.cost === 0 ? styles.free : ""}`}>
                    {method.cost === 0 ? "Gratuit" : formatPrice(method.cost)}
                  </span>
                </button>
              ))}
            </div>
          )}

          <button
            type="submit"
            className={styles.continueBtn}
            disabled={saving || !selectedId}
          >
            {saving ? <span className={styles.spinner} /> : "Continuer →"}
          </button>
        </form>

        {/* Récap */}
        {basket && (
          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>Récapitulatif</h2>
            <div className={styles.summaryItems}>
              {basket.items.map((item) => (
                <div key={item.id} className={styles.summaryItem}>
                  <span className={styles.summaryItemName}>
                    {item.product?.name ?? `Produit #${item.product?.sku}`}
                    <span className={styles.summaryItemQty}> × {item.quantity}</span>
                  </span>
                  <span>{formatPrice(item.unitPrice * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className={styles.summaryDivider} />
            {selected && (
              <div className={styles.summaryRow}>
                <span>Livraison ({selected.name})</span>
                <span className={selected.cost === 0 ? styles.free : ""}>
                  {selected.cost === 0 ? "Gratuit" : formatPrice(selected.cost)}
                </span>
              </div>
            )}
            <div className={styles.summaryDivider} />
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>{formatPrice(basket.total + (selected?.cost ?? 0))}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}