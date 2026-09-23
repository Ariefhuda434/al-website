"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal masuk.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mesh flex min-h-dvh items-center justify-center px-6">
      <form onSubmit={onSubmit} className="glass w-full max-w-sm space-y-4 rounded-3xl p-8">
        <h1 className="text-2xl">Masuk Admin</h1>
        {error ? (
          <p role="alert" className="rounded-xl bg-danger/10 px-4 py-2 text-sm text-danger">{error}</p>
        ) : null}
        <input
          type="email" required autoComplete="username" placeholder="Email"
          className="field" value={email} onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password" required autoComplete="current-password" placeholder="Kata sandi"
          className="field" value={password} onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? "Memproses…" : "Masuk"}
        </button>
      </form>
    </div>
  );
}
