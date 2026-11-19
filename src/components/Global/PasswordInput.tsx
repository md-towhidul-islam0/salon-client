"use client";

import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { type ChangeEvent, useState } from "react";

type PasswordInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoComplete?: string;
  minLength?: number;
  icon?: LucideIcon;
};

export default function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  minLength,
  icon: Icon,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        {Icon ? (
          <Icon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
        ) : null}
        <input
          id={id}
          type={visible ? "text" : "password"}
          required
          minLength={minLength}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full rounded-xl border border-border bg-background py-3 pr-12 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-[#c48981]/20 ${
            Icon ? "pl-11" : "pl-4"
          }`}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          title={visible ? "Hide password" : "Show password"}
          className="absolute top-1/2 right-2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </div>
  );
}
