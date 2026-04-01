"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Sign in failed");
        setLoading(false);
        return;
      }

      // Session cookie created server-side — redirect to dashboard
      window.location.href = "/dashboard";
    } catch {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  }

  function handleSocial(connection: string) {
    window.location.href = `/api/auth/social?connection=${connection}`;
  }

  return (
    <div className="flex flex-1 items-center justify-center py-20 px-4">
      <div className="card bg-base-200 shadow-lg w-full max-w-sm">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl mb-4">Sign In</h2>

          {error && (
            <div className="alert alert-error text-sm">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-sm" /> : "Sign In"}
            </button>
          </form>

          <div className="divider text-xs">OR</div>

          <div className="flex flex-col gap-2">
            <button className="btn btn-outline w-full" onClick={() => handleSocial("google-oauth2")}>
              Continue with Google
            </button>
            <button className="btn btn-outline w-full" onClick={() => handleSocial("apple")}>
              Continue with Apple
            </button>
            <button className="btn btn-outline w-full" onClick={() => handleSocial("github")}>
              Continue with GitHub
            </button>
          </div>

          <p className="text-center text-sm mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="link link-primary">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
