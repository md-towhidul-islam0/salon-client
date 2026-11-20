"use client";

import {
  Banknote,
  CircleCheck,
  Clock,
  ImagePlus,
  Info,
  RotateCcw,
  Save,
  ShieldCheck,
  Tag,
  Upload,
  X,
} from "lucide-react";
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

import { DashboardPanel } from "../../component/dashboard-ui";

const categories = [
  "Hair",
  "Skin",
  "Makeup",
  "Spa",
  "Grooming",
  "Nails",
  "Bridal",
] as const;

type Category = (typeof categories)[number];

type ServiceStatus = "active" | "inactive";

type ServiceFormState = {
  name: string;
  category: Category;
  description: string;
  price: string;
  duration: string;
  status: ServiceStatus;
};

type FieldErrors = Partial<
  Record<"name" | "description" | "price" | "duration", string>
>;

/** The shape handed to the caller once every rule passes. */
type ServiceSubmission = {
  name: string;
  category: Category;
  description: string;
  price: number;
  durationMinutes: number;
  image: string | undefined;
  status: ServiceStatus;
  submittedAt: string;
};

const initialForm: ServiceFormState = {
  name: "",
  category: "Hair",
  description: "",
  price: "",
  duration: "45",
  status: "active",
};

const statusOptions: {
  value: ServiceStatus;
  label: string;
  hint: string;
}[] = [
  {
    value: "active",
    label: "Active",
    hint: "Bookable on the website right away.",
  },
  {
    value: "inactive",
    label: "Inactive",
    hint: "Hidden from customers until you enable it.",
  },
];


const inputClass =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20";

const labelClass = "mb-1.5 block text-xs font-semibold text-foreground";

export default function ServiceForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<ServiceFormState>(initialForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState<ServiceSubmission | null>(null);
  const [mimage, setmimage] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile]);

  function update<K extends keyof ServiceFormState>(
    key: K,
    value: ServiceFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setSubmitted(null);
  }

  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Choose an image file such as PNG, JPG, or WebP.");
      event.target.value = "";
      return;
    }
    // if (file.size > 2 * 1024 * 1024) {
    //   setImageError("Image must be 2 MB or smaller.");
    //   event.target.value = "";
    //   return;
    // }
    const formData=new FormData();
    formData.append("image", file);
    const imagebb=`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGEBB_API_KEY}`;
    const res=await fetch(imagebb,{
      method:"POST",
      body:formData
    });
    const data=await res.json();
    console.log(data);
    console.log("handleImageChange → file:", file);
    console.log(data.data.url);
    setImageError(null);
    setImageFile(file);
    setSubmitted(null);
    setmimage(data.data.url);
    console.log("handleImageChange → mimage:", mimage);
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
    setImageError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function validate(state: ServiceFormState): FieldErrors {
    const nextErrors: FieldErrors = {};

    if (state.name.trim().length < 3) {
      nextErrors.name = "Enter a service name with at least 3 characters.";
    }
    if (state.description.trim().length < 10) {
      nextErrors.description = "Add a description of at least 10 characters.";
    }

    const price = Number(state.price);
    if (!state.price.trim() || !Number.isFinite(price) || price <= 0) {
      nextErrors.price = "Price must be a positive number.";
    }

    const duration = Number(state.duration);
    if (!state.duration.trim() || !Number.isFinite(duration) || duration <= 0) {
      nextErrors.duration = "Duration must be a positive number of minutes.";
    }

    return nextErrors;
  }

  // Nothing is sent to the server. The validated service data is collected here
  // so it can later be handed to an API route or server action.
  async function handleSubmission(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitted(null);
      return;
    }

    const service: ServiceSubmission = {
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      price: Number(form.price),
      durationMinutes: Number(form.duration),
      image: mimage,
      status: form.status,
      submittedAt: new Date().toLocaleString(),
    };
      console.log("handleSubmission → service data:", service);
    const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(service),
    });
    const data=await res.json();
    console.log("handleSubmission → service data:", service);
    console.log("handleSubmission → response data:", data);
    setSubmitted(service);
  }

  function resetForm() {
    setForm(initialForm);
    setErrors({});
    setSubmitted(null);
    removeImage();
  }
  // console.log(imageFile);
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <DashboardPanel
        className="xl:col-span-2"
        title="Service details"
        description="Every field is validated locally before the data is captured."
      >
        {submitted ? (
          <output className="mb-5 block rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3.5">
            <p className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
              <CircleCheck className="size-4 shrink-0" aria-hidden="true" />
              Service data captured
            </p>
            <dl className="mt-3 grid gap-x-6 gap-y-1.5 text-xs sm:grid-cols-2">
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Name</dt>
                <dd className="truncate font-medium">{submitted.name}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Category</dt>
                <dd className="font-medium">{submitted.category}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Price</dt>
                <dd className="font-medium">৳ {submitted.price}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Duration</dt>
                <dd className="font-medium">
                  {submitted.durationMinutes} minutes
                </dd>
              </div>
              {/* <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Image</dt>
                <dd className="truncate font-medium">
                  {submitted.image?.name ?? "Not provided"}
                </dd>
              </div> */}
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Status</dt>
                <dd className="font-medium capitalize">{submitted.status}</dd>
              </div>
            </dl>
        
          </output>
        ) : null}

        <form onSubmit={handleSubmission} noValidate className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="service-name" className={labelClass}>
                Service name
              </label>
              <input
                id="service-name"
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                placeholder="e.g. Signature Haircut"
                autoComplete="off"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={
                  errors.name ? "service-name-error" : undefined
                }
                className={cn(
                  inputClass,
                  errors.name && "border-danger focus:border-danger",
                )}
              />
              {errors.name ? (
                <p
                  id="service-name-error"
                  className="mt-1.5 text-xs text-danger"
                >
                  {errors.name}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="service-category" className={labelClass}>
                Service category
              </label>
              <select
                id="service-category"
                value={form.category}
                onChange={(event) =>
                  update("category", event.target.value as Category)
                }
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
              <label htmlFor="service-price" className={labelClass}>
                Price (৳)
              </label>
              <input
                id="service-price"
                type="number"
                inputMode="decimal"
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={(event) => update("price", event.target.value)}
                placeholder="1200"
                aria-invalid={Boolean(errors.price)}
                aria-describedby={
                  errors.price ? "service-price-error" : undefined
                }
                className={cn(
                  inputClass,
                  errors.price && "border-danger focus:border-danger",
                )}
              />
              {errors.price ? (
                <p
                  id="service-price-error"
                  className="mt-1.5 text-xs text-danger"
                >
                  {errors.price}
                </p>
              ) : null}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="service-description" className={labelClass}>
                Description
              </label>
              <textarea
                id="service-description"
                rows={4}
                value={form.description}
                onChange={(event) => update("description", event.target.value)}
                placeholder="Describe the experience, what's included, and who it's for."
                aria-invalid={Boolean(errors.description)}
                aria-describedby={
                  errors.description ? "service-description-error" : undefined
                }
                className={cn(
                  inputClass,
                  "resize-y",
                  errors.description && "border-danger focus:border-danger",
                )}
              />
              {errors.description ? (
                <p
                  id="service-description-error"
                  className="mt-1.5 text-xs text-danger"
                >
                  {errors.description}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Keep it under 160 characters so it reads well in service
                  cards.
                </p>
              )}
            </div>

            <div>
              <label htmlFor="service-duration" className={labelClass}>
                Estimated duration (minutes)
              </label>
              <input
                id="service-duration"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                value={form.duration}
                onChange={(event) => update("duration", event.target.value)}
                placeholder="45"
                aria-invalid={Boolean(errors.duration)}
                aria-describedby={
                  errors.duration ? "service-duration-error" : undefined
                }
                className={cn(
                  inputClass,
                  errors.duration && "border-danger focus:border-danger",
                )}
              />
              {errors.duration ? (
                <p
                  id="service-duration-error"
                  className="mt-1.5 text-xs text-danger"
                >
                  {errors.duration}
                </p>
              ) : null}
            </div>

            <fieldset>
              <legend className={labelClass}>Service status</legend>
              <div className="grid gap-2">
                {statusOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-border p-2.5 transition-colors hover:bg-muted/40 has-[:checked]:border-accent has-[:checked]:bg-accent/5"
                  >
                    <input
                      type="radio"
                      name="service-status"
                      value={option.value}
                      checked={form.status === option.value}
                      onChange={() => update("status", option.value)}
                      className="mt-0.5 size-4 accent-[#c48981]"
                    />
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold">
                        {option.label}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-4 text-muted-foreground">
                        {option.hint}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="sm:col-span-2">
              <span className={labelClass}>
                Service image{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </span>
              <div className="flex flex-col gap-3 rounded-xl border border-dashed border-border bg-muted/30 p-3 sm:flex-row sm:items-center">
                <span className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-background">
                  {imagePreview ? (
                    // biome-ignore lint/performance/noImgElement: local blob preview
                    <img
                      src={imagePreview}
                      alt="Selected service preview"
                      className="size-full object-cover"
                    />
                  ) : (
                    <ImagePlus
                      className="size-6 text-muted-foreground"
                      aria-hidden="true"
                    />
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <label
                      htmlFor="service-image"
                      className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-xs font-semibold transition-colors hover:bg-muted"
                    >
                      <Upload className="size-3.5" aria-hidden="true" />
                      {imageFile ? "Replace image" : "Upload image"}
                    </label>
                    {imageFile ? (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="inline-flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-danger-soft hover:text-danger-foreground"
                      >
                        <X className="size-3.5" aria-hidden="true" />
                        Remove
                      </button>
                    ) : null}
                  </div>
                  <input
                    ref={fileInputRef}
                    id="service-image"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    onChange={handleImageChange}
                  />
                  <p className="mt-1.5 truncate text-[11px] text-muted-foreground">
                    {imageFile
                      ? `${imageFile.name} · ${(imageFile.size / 1024).toFixed(0)} KB`
                      : "Upload from your device (PNG, JPG, or WebP). A URL is not accepted."}
                  </p>
                  {imageError ? (
                    <p className="mt-1 text-[11px] text-danger">{imageError}</p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-5">
            <button
              type="submit"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-accent px-4 text-sm font-semibold text-white shadow-sm shadow-accent/25 transition-colors hover:bg-[#a96f66]"
            >
              <Save className="size-4" aria-hidden="true" />
              Save service
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-muted"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Reset
            </button>
          </div>
        </form>
      </DashboardPanel>

      <div className="space-y-4">
        <DashboardPanel
          title="Service card preview"
          description="Updates as you fill in the form."
        >
          <div className="overflow-hidden rounded-xl border border-border">
            <div className="relative flex aspect-[4/3] items-center justify-center bg-muted/50">
              {imagePreview ? (
                // biome-ignore lint/performance/noImgElement: local blob preview
                <img
                  src={imagePreview}
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                />
              ) : (
                <span className="flex flex-col items-center gap-1 text-muted-foreground">
                  <ImagePlus className="size-7" aria-hidden="true" />
                  <span className="text-[11px]">No image selected</span>
                </span>
              )}
              <span
                className={cn(
                  "absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                  form.status === "active"
                    ? "bg-emerald-500/15 text-emerald-600"
                    : "bg-background/85 text-muted-foreground",
                )}
              >
                {form.status}
              </span>
            </div>
            <div className="p-3.5">
              <p className="text-[11px] font-semibold tracking-wide text-accent uppercase">
                {form.category}
              </p>
              <p className="mt-1 truncate text-sm font-bold">
                {form.name.trim() || "Service name"}
              </p>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                {form.description.trim() ||
                  "Your description will appear here once you start typing."}
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5 text-xs">
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Clock className="size-3.5" aria-hidden="true" />
                  {form.duration || "0"} min
                </span>
                <span className="font-bold text-accent">
                  ৳ {form.price || "0"}
                </span>
              </div>
            </div>
          </div>
        </DashboardPanel>
      </div>
    </div>
  );
}
