import type { LucideIcon } from "lucide-react";
import type { ChangeEvent } from "react";

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: "text" | "email";
  autoComplete?: string;
  icon?: LucideIcon;
};

export default function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
  icon: Icon,
}: TextFieldProps) {
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
          type={type}
          required
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full rounded-xl border border-border bg-background py-3 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-[#c48981]/20 ${
            Icon ? "pr-4 pl-11" : "px-4"
          }`}
        />
      </div>
    </div>
  );
}
