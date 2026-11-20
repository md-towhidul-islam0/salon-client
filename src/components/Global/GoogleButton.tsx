"use client";

import { LoaderCircle } from "lucide-react";
import { useState } from "react";

import { signIn } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type GoogleButtonProps = {
  /** Controls the button label: "Sign in" or "Sign up". */
  mode?: "signin" | "signup";
  /** Where Better Auth sends the user after a successful sign-in. */
  callbackURL?: string;
  /** Where Better Auth sends users whose Google account was just created. */
  newUserCallbackURL?: string;
  /** Lets the parent form surface Google errors in its own alert. */
  onError?: (message: string) => void;
  /** Disables the button while the email form is submitting. */
  disabled?: boolean;
  className?: string;
};

const labels = {
  signin: "Sign in with Google",
  signup: "Sign up with Google",
} as const;

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label="Google"
      className={className}
    >
      <title>Google</title>
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.86c2.26-2.09 3.56-5.17 3.56-8.87Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.28v3.09A11.99 11.99 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.28a12 12 0 0 0 0 10.76l3.99-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.7 0 3.99 2.47 1.28 6.62l3.99 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

export default function GoogleButton({
  mode = "signin",
  callbackURL = "/",
  newUserCallbackURL,
  onError,
  disabled = false,
  className,
}: GoogleButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    onError?.("");

    try {
      const result = await signIn.social({
        provider: "google",
        callbackURL,
        newUserCallbackURL,
      });

      if (result.error) {
        onError?.(
          result.error.message ?? "Google sign-in could not be completed.",
        );
        setLoading(false);
      }
      // On success Better Auth redirects to Google, so the button stays busy
      // until the browser leaves the page.
    } catch {
      onError?.("Could not reach Google. Please try again.");
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn(
        "group relative inline-flex h-12 w-full items-center justify-center gap-3 overflow-hidden rounded-full border border-border bg-background px-6 text-sm font-semibold text-foreground shadow-sm transition-all",
        "hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md hover:shadow-accent/10",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        "disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-sm",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <span className="relative flex size-7 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5">
        {loading ? (
          <LoaderCircle className="size-4 animate-spin text-accent" />
        ) : (
          <GoogleIcon className="size-4" />
        )}
      </span>
      <span className="relative">
        {loading ? "Connecting to Google..." : labels[mode]}
      </span>
    </button>
  );
}
