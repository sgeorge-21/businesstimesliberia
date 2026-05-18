import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import Layout from "@/components/lbh/Layout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({ component: AuthPage });

function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin", data: { display_name: name } },
        });
        if (error) throw error;
      }
      nav({ to: "/admin" });
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Layout hideFooter>
      <div className="admin-login">
        <div className="admin-login-box">
          <div className="admin-logo">
            <div className="big">The Liberian Business Hour</div>
            <span className="sub">Administrator Portal</span>
          </div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: ".3rem" }}>{mode === "signin" ? "Sign In" : "Create Account"}</h2>
          <p style={{ fontSize: 13, color: "var(--text-mid)", marginBottom: "1.5rem" }}>Access is restricted to authorized administrators only.</p>
          {err && <div style={{ background: "#fde8e8", color: "#c0392b", fontSize: 13, padding: "8px 12px", borderRadius: 3, marginBottom: "1rem" }}>{err}</div>}
          <form onSubmit={submit}>
            {mode === "signup" && (
              <div className="form-group"><label>Display Name</label><input value={name} onChange={(e) => setName(e.target.value)} required /></div>
            )}
            <div className="form-group"><label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
            <div className="form-group"><label>Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} /></div>
            <button className="btn-send" disabled={busy} type="submit" style={{ marginTop: ".5rem" }}>{busy ? "..." : mode === "signin" ? "Sign In →" : "Create Account →"}</button>
          </form>
          <p style={{ fontSize: 12, color: "var(--text-light)", textAlign: "center", marginTop: "1rem" }}>
            {mode === "signin" ? "No account?" : "Have an account?"}{" "}
            <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} style={{ background: "none", border: "none", color: "var(--green-dark)", cursor: "pointer", fontWeight: 600 }}>
              {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </Layout>
  );
}
