"use client";

import { CircleCheck, Save, Sparkles } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useState } from "react";

const inputClass =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20";

const labelClass = "mb-1.5 block text-xs font-semibold text-foreground";

const categories = [
  "Hair",
  "Skin",
  "Makeup",
  "Spa",
  "Grooming",
  "Nails",
  "Bridal",
];

type ServiceState = {
  name: string;
  category: string;
  duration: string;
  price: string;
  description: string;
  status: "active" | "draft";
  featured: boolean;
};

const initialState: ServiceState = {
  name: "",
  category: "Hair",
  duration: "45",
  price: "",
  description: "",
  status: "active",
  featured: false,
};

export default function ServiceForm() {
  const [form, setForm] = useState<ServiceState>(initialState);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof ServiceState>(
    key: K,
    value: ServiceState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

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
            Service details captured. Connect this form to your API or server
            action to persist the changes.
          </p>
        </output>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="service-name" className={labelClass}>
            Service name
          </label>
          <input
            id="service-name"
            required
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            placeholder="e.g. Signature Haircut"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="service-category" className={labelClass}>
            Category
          </label>
          <select
            id="service-category"
            value={form.category}
            onChange={(event) => update("category", event.target.value)}
            className={inputClass}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="service-duration" className={labelClass}>
            Duration (minutes)
          </label>
          <input
            id="service-duration"
            type="number"
            min="5"
            step="5"
            required
            value={form.duration}
            onChange={(event) => update("duration", event.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="service-price" className={labelClass}>
            Price (৳)
          </label>
          <input
            id="service-price"
            type="number"
            min="0"
            step="50"
            required
            value={form.price}
            onChange={(event) => update("price", event.target.value)}
            placeholder="1200"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="service-status" className={labelClass}>
            Visibility
          </label>
          <select
            id="service-status"
            value={form.status}
            onChange={(event) =>
              update("status", event.target.value as ServiceState["status"])
            }
            className={inputClass}
          >
            <option value="active">Active — visible on website</option>
            <option value="draft">Draft — hidden from customers</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="service-description" className={labelClass}>
            Short description
          </label>
          <textarea
            id="service-description"
            rows={4}
            value={form.description}
            onChange={(event) => update("description", event.target.value)}
            placeholder="Describe the experience, what's included, and who it's for."
            className={`${inputClass} resize-y`}
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Keep it under 160 characters so it reads well in service cards.
          </p>
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3.5 transition-colors hover:bg-muted/40">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(event) => update("featured", event.target.checked)}
          className="mt-0.5 size-4 accent-[#c48981]"
        />
        <span>
          <span className="flex items-center gap-1.5 text-sm font-medium">
            <Sparkles className="size-3.5 text-accent" aria-hidden="true" />
            Feature on the home page
          </span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Featured services appear in the highlight section of the website.
          </span>
        </span>
      </label>

      <div className="flex flex-wrap items-center gap-2 border-t border-border pt-5">
        <button
          type="submit"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-accent px-4 text-sm font-semibold text-white shadow-sm shadow-accent/25 transition-colors hover:bg-[#a96f66]"
        >
          <Save className="size-4" aria-hidden="true" />
          Save service
        </button>
        <Link
          href="/admin/manage-services"
          className="inline-flex h-9 items-center rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-muted"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
