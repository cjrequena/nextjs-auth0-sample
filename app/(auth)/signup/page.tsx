"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Sign up failed");
        return;
      }

      setSuccess(data.message);
    } catch {
      setError("An unexpected error occurred");
    } finally {
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
          <h2 className="card-title justify-center text-2xl mb-4">Sign Up</h2>

          {error && (
            <div className="alert alert-error text-sm">
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <>
              <div className="alert alert-success text-sm">
                <span>{success}</span>
              </div>
              <Link href="/signin" className="btn btn-primary w-full mt-2">Go to Sign In</Link>
            </>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="input input-bordered w-full"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
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
                  minLength={8}
                />
                <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                  {loading ? <span className="loading loading-spinner loading-sm" /> : "Create Account"}
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
                Already have an account?{" "}
                <Link href="/signin" className="link link-primary">Sign In</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
