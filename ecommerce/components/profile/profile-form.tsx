"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth.context";
import { getProfile, updateProfile } from "@/lib/api-user";
import { User } from "@/models/user.model";
import styles from "./profile-form.module.css";

type ToastState = { type: "success" | "error"; message: string } | null;

const EMPTY: User = {
  firstName: "",
  lastName: "",
  email: "",
  phone: ""
};

export default function ProfileForm() {
  const { getAuthHeaders, signOut } = useAuth();
  const [form, setForm] = useState<User>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  // Chargement du profil
  useEffect(() => {
    (async () => {
      try {
        const data = await getProfile(getAuthHeaders());
        setForm(data);
      } catch (e) {
        setToast({ type: "error", message: e instanceof Error ? e.message : "Erreur de chargement" });
      } finally {
        setLoading(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-fermeture du toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const set = (field: keyof User) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateProfile(form, getAuthHeaders());
      setForm(updated);
      setToast({ type: "success", message: "Profil mis à jour avec succès." });
    } catch (err) {
      setToast({ type: "error", message: err instanceof Error ? err.message : "Erreur lors de la sauvegarde" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.skeletonWrapper}>
        <div className={styles.skeleton} style={{ width: "40%", height: 28 }} />
        <div className={styles.skeleton} style={{ height: 44 }} />
        <div className={styles.skeleton} style={{ height: 44 }} />
        <div className={styles.skeleton} style={{ height: 44 }} />
        <div className={styles.skeleton} style={{ height: 44 }} />
      </div>
    );
  }

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
          <div className={styles.avatar}>
            {form.firstName?.[0]?.toUpperCase()}{form.lastName?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className={styles.title}>Mon profil</h1>
            <p className={styles.email}>{form.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="firstName">Prénom</label>
              <input
                id="firstName"
                type="text"
                value={form.firstName}
                onChange={set("firstName")}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="lastName">Nom</label>
              <input
                id="lastName"
                type="text"
                value={form.lastName}
                onChange={set("lastName")}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={set("email")}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="phone">Téléphone</label>
            <input
              id="phone"
              type="tel"
              value={form.phone ?? ""}
              onChange={set("phone")}
              className={styles.input}
            />
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? <span className={styles.spinner} /> : "Enregistrer"}
            </button>
            <button type="button" onClick={signOut} className={styles.signOutBtn}>
              Se déconnecter
            </button>
          </div>
        </form>
      </div>
    </>
  );
}