"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth.context";
import { changePassword } from "@/lib/api-user";
import { UpdatePasswordRequest } from "@/models/user.model";
import styles from "./update-password-form.module.css";

type FieldErrors = Partial<Record<keyof UpdatePasswordRequest, string>>;
type ToastState = { type: "success" | "error"; message: string } | null;

const INITIAL: UpdatePasswordRequest = {
  oldPassword: "",
  password: "",
  confirmPassword: "",
};

function validate(form: UpdatePasswordRequest): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.oldPassword) errors.oldPassword = "Requis.";
  if (!form.password) errors.password = "Requis.";
  else if (form.password.length < 8) errors.password = "Minimum 8 caractères.";
  if (!form.confirmPassword) errors.confirmPassword = "Requis.";
  else if (form.password !== form.confirmPassword) errors.confirmPassword = "Les mots de passe ne correspondent pas.";
  return errors;
}

export default function UpdatePasswordForm() {
  const { getAuthHeaders } = useAuth();
  const [form, setForm] = useState<UpdatePasswordRequest>(INITIAL);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [toast, setToast] = useState<ToastState>(null);
  const [saving, setSaving] = useState(false);
  const [show, setShow] = useState({ old: false, new: false, confirm: false });

  const set = (field: keyof UpdatePasswordRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const toggleShow = (field: keyof typeof show) =>
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate(form);
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
    setSaving(true);
    try {
      await changePassword(form, getAuthHeaders());
      setToast({ type: "success", message: "Mot de passe modifié avec succès." });
      setForm(INITIAL);
    } catch (err) {
      setToast({ type: "error", message: err instanceof Error ? err.message : "Erreur lors du changement." });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <>
      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          <span>{toast.type === "success" ? "✅" : "❌"}</span>
          <span className={styles.toastMessage}>{toast.message}</span>
          <button className={styles.toastClose} onClick={() => setToast(null)}>✕</button>
        </div>
      )}

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h1 className={styles.title}>Changer le mot de passe</h1>
          <p className={styles.subtitle}>Choisissez un mot de passe de 8 caractères minimum.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className={styles.form}>
          {(
            [
              { id: "oldPassword", label: "Mot de passe actuel", showKey: "old" as const },
              { id: "password", label: "Nouveau mot de passe", showKey: "new" as const },
              { id: "confirmPassword", label: "Confirmer le nouveau mot de passe", showKey: "confirm" as const },
            ] as const
          ).map(({ id, label, showKey }) => (
            <div key={id} className={styles.field}>
              <label className={styles.label} htmlFor={id}>{label}</label>
              <div className={styles.passwordWrapper}>
                <input
                  id={id}
                  type={show[showKey] ? "text" : "password"}
                  value={form[id]}
                  onChange={set(id)}
                  autoComplete={id === "oldPassword" ? "current-password" : "new-password"}
                  className={`${styles.input} ${fieldErrors[id] ? styles.inputError : ""}`}
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => toggleShow(showKey)}
                  aria-label={show[showKey] ? "Masquer" : "Afficher"}
                >
                  {show[showKey] ? "🙈" : "👁️"}
                </button>
              </div>
              {fieldErrors[id] && <p className={styles.error}>{fieldErrors[id]}</p>}
            </div>
          ))}

          <button type="submit" className={styles.submitBtn} disabled={saving}>
            {saving ? <span className={styles.spinner} /> : "Mettre à jour"}
          </button>
        </form>
      </div>
    </>
  );
}