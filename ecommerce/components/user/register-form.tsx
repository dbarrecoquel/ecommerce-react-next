"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api-user";
import { UserRegistrationRequest } from "@/models/user.model";
import styles from "./register-form.module.css";

type FieldErrors = Partial<Record<keyof UserRegistrationRequest, string>>;

function validate(form: UserRegistrationRequest): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.firstName.trim()) errors.firstName = "Le prénom est requis.";
  if (!form.lastName.trim()) errors.lastName = "Le nom est requis.";
  if (!form.email.trim()) errors.email = "L'email est requis.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Email invalide.";
  if (!form.phone.trim()) errors.phone = "Le téléphone est requis.";
  if (!form.password) errors.password = "Le mot de passe est requis.";
  else if (form.password.length < 8) errors.password = "Minimum 8 caractères.";
  if (!form.confirmPassword) errors.confirmPassword = "Confirmez votre mot de passe.";
  else if (form.password !== form.confirmPassword) errors.confirmPassword = "Les mots de passe ne correspondent pas.";
  return errors;
}

const INITIAL: UserRegistrationRequest = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState<UserRegistrationRequest>(INITIAL);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const set = (field: keyof UserRegistrationRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      // Efface l'erreur du champ dès que l'utilisateur retape
      if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const errors = validate(form);
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }

    setLoading(true);
    try {
      await register(form);
      router.push("/login?registered=1");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Erreur lors de la création du compte.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h1 className={styles.title}>Créer un compte</h1>
        <p className={styles.subtitle}>Rejoignez-nous en quelques secondes.</p>
      </div>

      {serverError && (
        <div className={styles.serverError}>
          <span>❌</span> {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        {/* ── Prénom / Nom ── */}
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="firstName">Prénom</label>
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="Jean"
              value={form.firstName}
              onChange={set("firstName")}
              className={`${styles.input} ${fieldErrors.firstName ? styles.inputError : ""}`}
            />
            {fieldErrors.firstName && <p className={styles.error}>{fieldErrors.firstName}</p>}
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="lastName">Nom</label>
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Dupont"
              value={form.lastName}
              onChange={set("lastName")}
              className={`${styles.input} ${fieldErrors.lastName ? styles.inputError : ""}`}
            />
            {fieldErrors.lastName && <p className={styles.error}>{fieldErrors.lastName}</p>}
          </div>
        </div>

        {/* ── Email ── */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">Adresse email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="jean.dupont@email.com"
            value={form.email}
            onChange={set("email")}
            className={`${styles.input} ${fieldErrors.email ? styles.inputError : ""}`}
          />
          {fieldErrors.email && <p className={styles.error}>{fieldErrors.email}</p>}
        </div>

        {/* ── Téléphone ── */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="phone">Téléphone</label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="06 12 34 56 78"
            value={form.phone}
            onChange={set("phone")}
            className={`${styles.input} ${fieldErrors.phone ? styles.inputError : ""}`}
          />
          {fieldErrors.phone && <p className={styles.error}>{fieldErrors.phone}</p>}
        </div>

        {/* ── Mot de passe ── */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="password">Mot de passe</label>
          <div className={styles.passwordWrapper}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="8 caractères minimum"
              value={form.password}
              onChange={set("password")}
              className={`${styles.input} ${styles.inputPassword} ${fieldErrors.password ? styles.inputError : ""}`}
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Masquer" : "Afficher"}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {fieldErrors.password && <p className={styles.error}>{fieldErrors.password}</p>}
        </div>

        {/* ── Confirmation ── */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="confirmPassword">Confirmer le mot de passe</label>
          <div className={styles.passwordWrapper}>
            <input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Répétez votre mot de passe"
              value={form.confirmPassword}
              onChange={set("confirmPassword")}
              className={`${styles.input} ${styles.inputPassword} ${fieldErrors.confirmPassword ? styles.inputError : ""}`}
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? "Masquer" : "Afficher"}
            >
              {showConfirm ? "🙈" : "👁️"}
            </button>
          </div>
          {fieldErrors.confirmPassword && <p className={styles.error}>{fieldErrors.confirmPassword}</p>}
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? <span className={styles.spinner} /> : "Créer mon compte"}
        </button>
      </form>

      <p className={styles.loginLink}>
        Déjà un compte ?{" "}
        <a href="/login" className={styles.link}>Se connecter</a>
      </p>
    </div>
  );
}