"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
    } else {
      router.replace("/admin");
    }
  }

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "100vh", background: "var(--brun-dark)",
    }}>
      <div style={{
        background: "#fff", borderRadius: "var(--radius-lg)",
        padding: "48px 40px", width: "100%", maxWidth: 400,
        boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--brun)" }}>
            La Bièregerie
          </div>
          <div style={{ fontFamily: "var(--font-script)", fontSize: 36, color: "var(--orange)", lineHeight: 1.1 }}>
            d&apos;Henri
          </div>
          <div style={{
            fontSize: 11, color: "var(--encre-soft)", marginTop: 10,
            letterSpacing: "0.18em", textTransform: "uppercase",
          }}>
            Back-office
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <div className="field" style={{ marginBottom: 18 }}>
            <label>Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="ton@mail.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field" style={{ marginBottom: 28 }}>
            <label>Mot de passe</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div style={{ color: "#C25A3F", fontSize: 14, marginBottom: 18, textAlign: "center", fontWeight: 500 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
            disabled={loading}
          >
            {loading ? "Connexion…" : <>Se connecter <span className="arrow">→</span></>}
          </button>
        </form>
      </div>
    </div>
  );
}
