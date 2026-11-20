"use client";

import {
  ArrowRight,
  Info,
  LoaderCircle,
  LockKeyhole,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import AuthShell from "@/components/Global/AuthShell";
import GoogleButton from "@/components/Global/GoogleButton";
import PasswordInput from "@/components/Global/PasswordInput";
import TextField from "@/components/Global/TextField";
import { signIn } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn.email({ email, password, rememberMe });
      if (result.error) {
        setError(result.error.message ?? "Invalid email or password.");
        return;
      }
      router.push("/");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to pick up right where you left off."
      footer={
        <>
          New to HairSalon?{" "}
          <Link
            href="/SignUp"
            className="font-semibold text-accent hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      {error ? (
        <div
          role="alert"
          className="mb-5 flex items-start gap-3 rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger-foreground"
        >
          <Info className="mt-0.5 size-4 shrink-0" />
          <p>{error}</p>
        </div>
      ) : null}

      <div className="space-y-5">
        <GoogleButton mode="signin" disabled={loading} onError={setError} />
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-border" aria-hidden="true" />
          <span className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
            or continue with email
          </span>
          <span className="h-px flex-1 bg-border" aria-hidden="true" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        <TextField
          id="email"
          label="Email address"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          icon={Mail}
        />

        <div className="space-y-3">
          <PasswordInput
            id="password"
            label="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Your password"
            autoComplete="current-password"
            icon={LockKeyhole}
          />
          <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="size-4 accent-[#c48981]"
            />
            Keep me signed in
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:bg-[#a96f66] hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
}
