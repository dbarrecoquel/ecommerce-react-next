"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api-user";
import { useAuth } from "@/contexts/auth.context";
import { LoginRequest } from "@/models/user.model";
import styles from "./login-form.module.css";

const INITIAL: LoginRequest = { email: "", password: "" };

export default function LoginForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [form, setForm] = useState<LoginRequest>(INITIAL);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const set = (field: keyof LoginRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (error) setError(null);
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setLoading(true);
    try {
      const { user, token } = await login(form);
      signIn(user, token);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h1 className={styles.title}>Se connecter</h1>
        <p className={styles.subtitle}>Bon retour parmi nous.</p>
      </div>

      {error && (
        <div className={styles.errorBox}>
          <span>❌</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">Adresse email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="jean.dupont@email.com"
            value={form.email}
            onChange={set("email")}
            className={`${styles.input} ${error ? styles.inputError : ""}`}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="password">Mot de passe</label>
          <div className={styles.passwordWrapper}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Votre mot de passe"
              value={form.password}
              onChange={set("password")}
              className={`${styles.input} ${styles.inputPassword} ${error ? styles.inputError : ""}`}
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
        </div>

        <div className={styles.forgotRow}>
          <a href="/forgot-password" className={styles.forgotLink}>
            Mot de passe oublié ?
          </a>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? <span className={styles.spinner} /> : "Se connecter"}
        </button>
      </form>

      <p className={styles.registerLink}>
        Pas encore de compte ?{" "}
        <a href="/register" className={styles.link}>Créer un compte</a>
      </p>
    </div>
  );
}