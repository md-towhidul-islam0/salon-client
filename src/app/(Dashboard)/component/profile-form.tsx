"use client";

import { CircleCheck, Save } from "lucide-react";
import { type FormEvent, useState } from "react";

const inputClass =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground";

const labelClass = "mb-1.5 block text-xs font-semibold text-foreground";

type ProfileFormProps = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

export default function ProfileForm({
  name: initialName,
  email,
  phone: initialPhone,
  address: initialAddress,
}: ProfileFormProps) {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [address, setAddress] = useState(initialAddress);
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {saved ? (
        <output className="flex items-start gap-2.5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600">
          <CircleCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>
            Profile changes captured. Connect this form to your account API to
            save them permanently.
          </p>
        </output>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="profile-name" className={labelClass}>
            Full name
          </label>
          <input
            id="profile-name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="profile-email" className={labelClass}>
            Email address
          </label>
          <input
            id="profile-email"
            type="email"
            value={email}
            disabled
            className={inputClass}
          />
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            Contact support to change your sign-in email.
          </p>
        </div>

        <div>
          <label htmlFor="profile-phone" className={labelClass}>
            Phone number
          </label>
          <input
            id="profile-phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+880 1XXX-XXXXXX"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="profile-address" className={labelClass}>
            Address
          </label>
          <input
            id="profile-address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="Area, city"
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-border pt-5">
        <button
          type="submit"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-accent px-4 text-sm font-semibold text-white shadow-sm shadow-accent/25 transition-colors hover:bg-[#a96f66]"
        >
          <Save className="size-4" aria-hidden="true" />
          Save changes
        </button>
        <button
          type="button"
          onClick={() => {
            setName(initialName);
            setPhone(initialPhone);
            setAddress(initialAddress);
            setSaved(false);
          }}
          className="inline-flex h-9 items-center rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-muted"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
