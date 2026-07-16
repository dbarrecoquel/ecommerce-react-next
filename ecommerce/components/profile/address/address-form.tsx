"use client";

import { useState } from "react";
import { Address } from "@/models/address.model";
import styles from "./address-form.module.css";

interface AddressFormProps {
  initial?: Partial<Address>;
  onSubmit: (data: Omit<Address, "id">) => Promise<void>;
  onCancel: () => void;
  title: string;
}

const EMPTY: Omit<Address, "id"> = {
  label: "",
  street: "",
  complement: "",
  postalCode: "",
  city: "",
  country: "France",
  addressType: "SHIPPING",
  isDefault: false,
};

type FieldErrors = Partial<Record<keyof Omit<Address, "id">, string>>;

function validate(form: Omit<Address, "id">): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.label.trim()) errors.label = "Libellé requis.";
  if (!form.street.trim()) errors.street = "Adresse requise.";
  if (!form.postalCode.trim()) errors.postalCode = "Code postal requis.";
  if (!form.city.trim()) errors.city = "Ville requise.";
  if (!form.country.trim()) errors.country = "Pays requis.";
  return errors;
}

export default function AddressForm({ initial, onSubmit, onCancel, title }: AddressFormProps) {
  const [form, setForm] = useState<Omit<Address, "id">>({ ...EMPTY, ...initial });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);

  const set = (field: keyof Omit<Address, "id">) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate(form);
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
    setSaving(true);
    try {
      await onSubmit(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button className={styles.closeBtn} onClick={onCancel} aria-label="Fermer">✕</button>
        </div>

        <form onSubmit={handleSubmit} noValidate className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="label">Libellé</label>
            <input id="label" type="text" placeholder="Ex : Domicile, Bureau..."
              value={form.label} onChange={set("label")}
              className={`${styles.input} ${fieldErrors.label ? styles.inputError : ""}`} />
            {fieldErrors.label && <p className={styles.error}>{fieldErrors.label}</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="street">Adresse</label>
            <input id="street" type="text" placeholder="12 rue de la Paix"
              value={form.street} onChange={set("street")}
              className={`${styles.input} ${fieldErrors.street ? styles.inputError : ""}`} />
            {fieldErrors.street && <p className={styles.error}>{fieldErrors.street}</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="complement">Complément</label>
            <input id="complement" type="text" placeholder="Bât. A, Apt. 3..."
              value={form.complement} onChange={set("complement")}
              className={styles.input} />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="postalCode">Code postal</label>
              <input id="postalCode" type="text" placeholder="75001"
                value={form.postalCode} onChange={set("postalCode")}
                className={`${styles.input} ${fieldErrors.postalCode ? styles.inputError : ""}`} />
              {fieldErrors.postalCode && <p className={styles.error}>{fieldErrors.postalCode}</p>}
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="city">Ville</label>
              <input id="city" type="text" placeholder="Paris"
                value={form.city} onChange={set("city")}
                className={`${styles.input} ${fieldErrors.city ? styles.inputError : ""}`} />
              {fieldErrors.city && <p className={styles.error}>{fieldErrors.city}</p>}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="country">Pays</label>
              <input id="country" type="text" placeholder="France"
                value={form.country} onChange={set("country")}
                className={`${styles.input} ${fieldErrors.country ? styles.inputError : ""}`} />
              {fieldErrors.country && <p className={styles.error}>{fieldErrors.country}</p>}
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="addressType">Type</label>
              <select id="addressType" value={form.addressType} onChange={set("addressType")}
                className={styles.input}>
                <option value="SHIPPING">Livraison</option>
                <option value="BILLING">Facturation</option>
              </select>
            </div>
          </div>

          <label className={styles.checkboxLabel}>
            <input type="checkbox" checked={form.isDefault}
              onChange={set("isDefault")} className={styles.checkbox} />
            Définir comme adresse par défaut
          </label>

          <div className={styles.actions}>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? <span className={styles.spinner} /> : "Enregistrer"}
            </button>
            <button type="button" className={styles.cancelBtn} onClick={onCancel}>
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}