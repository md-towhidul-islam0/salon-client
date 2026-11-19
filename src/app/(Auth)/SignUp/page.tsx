"use client";

import {
  ArrowRight,
  Camera,
  Check,
  Info,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ChangeEvent, type FormEvent, useRef, useState } from "react";

import AuthShell from "@/components/Global/AuthShell";
import PasswordInput from "@/components/Global/PasswordInput";
import TextField from "@/components/Global/TextField";
import { signUp } from "@/lib/auth-client";

type FormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  isBlocked: boolean;
};

const initialForm: FormState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "user",
  isBlocked: false,
};

export default function SignUpPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [image, setImage] = useState<string>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  function readImage(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be smaller than 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setImage(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    setError("");
    readImage(event.target.files?.[0]);
  }

  function removeImage() {
    setImage(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const result = await signUp.email({
        name: form.name,
        email: form.email,
        password: form.password,
        image,
        role: "Customer",
        isBlocked: false,
      });
      if (result.error) {
        setError(result.error.message ?? "Could not create your account.");
        return;
      }
      router.push("/");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const passwordChecks = [
    { label: "8+ characters", valid: form.password.length >= 8 },
    { label: "Uppercase letter", valid: /[A-Z]/.test(form.password) },
    { label: "Number", valid: /\d/.test(form.password) },
  ];
  const passwordScore = passwordChecks.filter((check) => check.valid).length;
  return (
    <AuthShell
      title="Create your account"
      subtitle="Join us and book your favourite services in seconds."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/SignIn"
            className="font-semibold text-accent hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="name"
            label="Full name"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Your name"
            autoComplete="name"
            icon={UserRound}
          />
          <TextField
            id="email"
            label="Email address"
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            icon={Mail}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <PasswordInput
            id="password"
            label="Password"
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            minLength={8}
            icon={LockKeyhole}
          />
          <PasswordInput
            id="confirmPassword"
            label="Confirm password"
            value={form.confirmPassword}
            onChange={(event) =>
              updateField("confirmPassword", event.target.value)
            }
            placeholder="Repeat password"
            autoComplete="new-password"
            minLength={8}
            icon={LockKeyhole}
          />
        </div>

      

        {/* <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="role" className="mb-2 block text-sm font-medium">
              Role
            </label>
            <select
              id="role"
              value={form.role}
              onChange={(event) => updateField("role", event.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border px-4 py-3 text-sm">
            <input
              type="checkbox"
              checked={form.isBlocked}
              onChange={(event) =>
                updateField("isBlocked", event.target.checked)
              }
              className="size-4 accent-[#c48981]"
            />
            Block this account
          </label>
        </div> */}

        <div>
          <p className="mb-2 text-sm font-medium">
            Profile image{" "}
            <span className="text-muted-foreground">(optional)</span>
          </p>
          <div className="relative">
            <label
              htmlFor="image"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                setError("");
                readImage(event.dataTransfer.files[0]);
              }}
              className="flex cursor-pointer flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-muted/40 p-5 text-center transition-colors hover:border-accent/60 sm:flex-row sm:text-left"
            >
              <input
                ref={fileInputRef}
                id="image"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleImageChange}
              />
              <span className="relative flex size-20 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-background shadow-sm ring-2 ring-accent/20">
                {image ? (
                  <Image
                    src={image}
                    alt="Selected profile preview"
                    width={80}
                    height={80}
                    unoptimized
                    className="size-full object-cover"
                  />
                ) : (
                  <UserRound className="size-8 text-muted-foreground" />
                )}
                <span className="absolute right-0 bottom-0 flex size-6 items-center justify-center rounded-full bg-accent text-white shadow">
                  <Camera className="size-3" />
                </span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">
                  Add a profile photo
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  Click here or drag an image to upload.
                </span>
                <span className="mt-1 block text-[11px] text-muted-foreground">
                  PNG or JPG · Max 2 MB
                </span>
              </span>
            </label>
            {image ? (
              <button
                type="button"
                onClick={removeImage}
                aria-label="Remove profile photo"
                title="Remove photo"
                className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-danger hover:text-danger"
              >
                <X className="size-4" />
              </button>
            ) : null}
          </div>
        </div>

        {error ? (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger-foreground"
          >
            <Info className="mt-0.5 size-4 shrink-0" />
            <p>{error}</p>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:bg-[#a96f66] hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              Create account
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>

        <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5" />
          Your details stay private and secure.
        </p>
      </form>
    </AuthShell>
  );
}
