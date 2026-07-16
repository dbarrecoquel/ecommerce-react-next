"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth.context";
import { useAddress } from "@/contexts/address.context";
import { createAddress, updateAdress } from '@/lib/api-user';
import { Address } from "@/models/address.model";
import AddressForm from "./address-form";
import styles from "./address-list.module.css";

const TYPE_LABEL: Record<string, string> = {
  SHIPPING: "Livraison",
  BILLING: "Facturation",
};

export default function AddressList() {
  const { getAuthHeaders } = useAuth();
  const { addresses, loading, error, loadAddresses } = useAddress();
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<Address | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    loadAddresses(getAuthHeaders());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleAdd = async (data: Omit<Address, "id">) => {
    try {
      await createAddress(data, getAuthHeaders());
      await loadAddresses(getAuthHeaders());
      setShowAdd(false);
      setToast({ type: "success", message: "Adresse ajoutée." });
    } catch (e) {
      setToast({ type: "error", message: e instanceof Error ? e.message : "Erreur" });
    }
  };

  const handleEdit = async (data: Omit<Address, "id">) => {
    if (!editTarget) return;
    try {
      await updateAdress(editTarget.id, { ...data, id: editTarget.id }, getAuthHeaders());
      await loadAddresses(getAuthHeaders());
      setEditTarget(null);
      setToast({ type: "success", message: "Adresse mise à jour." });
    } catch (e) {
      setToast({ type: "error", message: e instanceof Error ? e.message : "Erreur" });
    }
  };

  if (loading) return (
    <div className={styles.skeletons}>
      {[1, 2].map((i) => <div key={i} className={styles.skeleton} />)}
    </div>
  );

  if (error) return <p className={styles.errorMsg}>{error}</p>;

  return (
    <>
      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          <span>{toast.type === "success" ? "✅" : "❌"}</span>
          <span>{toast.message}</span>
          <button className={styles.toastClose} onClick={() => setToast(null)}>✕</button>
        </div>
      )}

      <div className={styles.header}>
        <h1 className={styles.title}>Mes adresses</h1>
        <button className={styles.addBtn} onClick={() => setShowAdd(true)}>
          + Ajouter une adresse
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>📍</span>
          <p>Aucune adresse enregistrée.</p>
          <button className={styles.addBtn} onClick={() => setShowAdd(true)}>
            Ajouter ma première adresse
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {addresses.map((addr) => (
            <div key={addr.id} className={`${styles.card} ${addr.isDefault ? styles.cardDefault : ""}`}>
              <div className={styles.cardTop}>
                <div className={styles.cardLabels}>
                  <span className={styles.label}>{addr.label}</span>
                  <span className={`${styles.typeBadge} ${styles[addr.addressType.toLowerCase()]}`}>
                    {TYPE_LABEL[addr.addressType]}
                  </span>
                  {addr.isDefault && <span className={styles.defaultBadge}>Par défaut</span>}
                </div>
                <button className={styles.editBtn} onClick={() => setEditTarget(addr)}>
                  ✏️ Modifier
                </button>
              </div>
              <div className={styles.cardBody}>
                <p>{addr.street}</p>
                {addr.complement && <p className={styles.complement}>{addr.complement}</p>}
                <p>{addr.postalCode} {addr.city}</p>
                <p>{addr.country}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <AddressForm
          title="Ajouter une adresse"
          onSubmit={handleAdd}
          onCancel={() => setShowAdd(false)}
        />
      )}

      {editTarget && (
        <AddressForm
          title="Modifier l'adresse"
          initial={editTarget}
          onSubmit={handleEdit}
          onCancel={() => setEditTarget(null)}
        />
      )}
    </>
  );
}