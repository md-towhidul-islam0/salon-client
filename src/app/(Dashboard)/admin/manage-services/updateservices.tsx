"use client";

import {
  CircleCheck,
  Clock3,
  ImagePlus,
  Pencil,
  Save,
  Upload,
  X,
} from "lucide-react";
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

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

export type UpdateService = {
  _id: string;
  name: string;
  category: string;
  description?: string;
  price: number;
  durationMinutes: number;
  image?: string;
  status: ServiceStatus;
};

type UpdateServiceForm = {
  name: string;
  category: string;
  description: string;
  price: string;
  durationMinutes: string;
  status: ServiceStatus;
};

type FieldErrors = Partial<
  Record<"name" | "description" | "price" | "durationMinutes", string>
>;

type UpdateServicePayload = {

  name: string;
  category: string;
  description: string;
  price: number;
  durationMinutes: number;
  status: ServiceStatus;
  image: string | File | null;

};

type UpdateServicesProps = {
  service: UpdateService;
  onUpdated?: (payload: UpdateServicePayload) => void;
};

const inputClass =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20";

const labelClass = "mb-1.5 block text-xs font-semibold text-foreground";

function getInitialForm(service: UpdateService): UpdateServiceForm {
  return {
    name: service.name ?? "",
    category: service.category ?? "Hair",
    description: service.description ?? "",
    price: service.price != null ? String(service.price) : "",
    durationMinutes:
      service.durationMinutes != null ? String(service.durationMinutes) : "",
    status: service.status ?? "active",
  };
}

export default function UpdateServices({
  service,
  onUpdated,
}: UpdateServicesProps) {
  const dialogTitleId = useId();
  const dialogDescriptionId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<UpdateServiceForm>(() =>
    getInitialForm(service),
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(service.image ? null : "No image selected");
  const [mimage, setmimage] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function resetToCurrent() {
    setForm(getInitialForm(service));
    setErrors({});
    setImageError(null);
    setImageFile(null);
    setSaved(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function openDialog() {
    resetToCurrent();
    setOpen(true);
  }

  function closeDialog() {
    setOpen(false);
  }

  function update<K extends keyof UpdateServiceForm>(
    key: K,
    value: UpdateServiceForm[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setSaved(false);
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
    setmimage(data.data.url);
    console.log("handleImageChange → mimage:", mimage);
  }

  function removeSelectedImage() {
    setImageFile(null);
    setImageError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function validate(values: UpdateServiceForm): FieldErrors {
    const nextErrors: FieldErrors = {};

    if (values.name.trim().length < 3) {
      nextErrors.name = "Enter a service name with at least 3 characters.";
    }
    if (values.description.trim().length < 10) {
      nextErrors.description = "Add a description of at least 10 characters.";
    }

    const price = Number(values.price);
    if (!values.price.trim() || !Number.isFinite(price) || price <= 0) {
      nextErrors.price = "Price must be a positive number.";
    }

    const duration = Number(values.durationMinutes);
    if (
      !values.durationMinutes.trim() ||
      !Number.isFinite(duration) ||
      duration <= 0
    ) {
      nextErrors.durationMinutes =
        "Duration must be a positive number of minutes.";
    }

    return nextErrors;
  }

  // Collects the current form information (prefilled from the service) for update.
  function hendelupdate(values: UpdateServiceForm): UpdateServicePayload {
    const updatedInfo: UpdateServicePayload = {
      name: values.name.trim(),
      category: values.category.trim(),
      description: values.description.trim(),
      price: Number(values.price),
      durationMinutes: Number(values.durationMinutes),
      status: values.status,
      image: mimage,
    };

    console.log("hendelupdate → updated service info:", updatedInfo);
    return updatedInfo;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSaved(false);
      return;
    }

    const updatedInfo = hendelupdate(form);

    onUpdated?.(updatedInfo);
    setSaved(true);

    const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${service._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedInfo),
    });
    const data=await res.json();
    console.log(data);
    if(data.acknowledged===true){
   
      router.refresh();
    } 
  }

  const previewSrc = imagePreview ?? service.image ?? null;

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        aria-label={`Update ${service.name}`}
        className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
      >
        <Pencil className="size-3.5" aria-hidden="true" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <button
            type="button"
            aria-label="Close update dialog"
            onClick={closeDialog}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            aria-describedby={dialogDescriptionId}
            className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
              <div>
                <h2 id={dialogTitleId} className="text-base font-semibold">
                  Update service
                </h2>
                <p
                  id={dialogDescriptionId}
                  className="mt-1 text-xs text-muted-foreground"
                >
                  Current service information is prefilled. Edit the fields and
                  save to collect the updated data.
                </p>
              </div>
              <button
                type="button"
                onClick={closeDialog}
                aria-label="Close dialog"
                className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-5">
              {saved ? (
                <output className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-2.5 text-sm font-medium text-emerald-600">
                  <CircleCheck className="size-4 shrink-0" aria-hidden="true" />
                  Updated information collected in{" "}
                  <code className="font-mono text-xs">hendelupdate</code>.
                </output>
              ) : null}

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor={`${dialogTitleId}-name`}
                      className={labelClass}
                    >
                      Service name
                    </label>
                    <input
                      id={`${dialogTitleId}-name`}
                      value={form.name}
                      onChange={(event) => update("name", event.target.value)}
                      placeholder={service.name || "Service name"}
                      autoComplete="off"
                      aria-invalid={Boolean(errors.name)}
                      className={cn(
                        inputClass,
                        errors.name && "border-danger focus:border-danger",
                      )}
                    />
                    {errors.name ? (
                      <p className="mt-1.5 text-xs text-danger">
                        {errors.name}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label
                      htmlFor={`${dialogTitleId}-category`}
                      className={labelClass}
                    >
                      Service category
                    </label>
                    <select
                      id={`${dialogTitleId}-category`}
                      value={form.category}
                      onChange={(event) =>
                        update("category", event.target.value as Category)
                      }
                      className={inputClass}
                    >
                      {Array.from(
                        new Set(
                          [service.category, ...categories].filter(Boolean),
                        ),
                      ).map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor={`${dialogTitleId}-price`}
                      className={labelClass}
                    >
                      Price (৳)
                    </label>
                    <input
                      id={`${dialogTitleId}-price`}
                      type="number"
                      inputMode="decimal"
                      min="0.01"
                      step="0.01"
                      value={form.price}
                      onChange={(event) => update("price", event.target.value)}
                      placeholder={
                        service.price != null ? String(service.price) : "1200"
                      }
                      aria-invalid={Boolean(errors.price)}
                      className={cn(
                        inputClass,
                        errors.price && "border-danger focus:border-danger",
                      )}
                    />
                    {errors.price ? (
                      <p className="mt-1.5 text-xs text-danger">
                        {errors.price}
                      </p>
                    ) : null}
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor={`${dialogTitleId}-description`}
                      className={labelClass}
                    >
                      Description
                    </label>
                    <textarea
                      id={`${dialogTitleId}-description`}
                      rows={4}
                      value={form.description}
                      onChange={(event) =>
                        update("description", event.target.value)
                      }
                      placeholder={
                        service.description || "Describe the service..."
                      }
                      aria-invalid={Boolean(errors.description)}
                      className={cn(
                        inputClass,
                        "resize-y",
                        errors.description &&
                          "border-danger focus:border-danger",
                      )}
                    />
                    {errors.description ? (
                      <p className="mt-1.5 text-xs text-danger">
                        {errors.description}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label
                      htmlFor={`${dialogTitleId}-duration`}
                      className={labelClass}
                    >
                      Estimated duration (minutes)
                    </label>
                    <input
                      id={`${dialogTitleId}-duration`}
                      type="number"
                      inputMode="numeric"
                      min="1"
                      step="1"
                      value={form.durationMinutes}
                      onChange={(event) =>
                        update("durationMinutes", event.target.value)
                      }
                      placeholder={
                        service.durationMinutes != null
                          ? String(service.durationMinutes)
                          : "45"
                      }
                      aria-invalid={Boolean(errors.durationMinutes)}
                      className={cn(
                        inputClass,
                        errors.durationMinutes &&
                          "border-danger focus:border-danger",
                      )}
                    />
                    {errors.durationMinutes ? (
                      <p className="mt-1.5 text-xs text-danger">
                        {errors.durationMinutes}
                      </p>
                    ) : null}
                  </div>

                  <fieldset>
                    <legend className={labelClass}>Service status</legend>
                    <div className="grid grid-cols-2 gap-2">
                      {(["active", "inactive"] as const).map((status) => (
                        <label
                          key={status}
                          className="flex cursor-pointer items-center gap-2 rounded-xl border border-border p-2.5 transition-colors hover:bg-muted/40 has-[:checked]:border-accent has-[:checked]:bg-accent/5"
                        >
                          <input
                            type="radio"
                            name={`${dialogTitleId}-status`}
                            value={status}
                            checked={form.status === status}
                            onChange={() => update("status", status)}
                            className="size-4 accent-[#c48981]"
                          />
                          <span className="text-xs font-semibold capitalize">
                            {status}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div className="sm:col-span-2">
                    <span className={labelClass}>Service image</span>
                    <div className="flex flex-col gap-3 rounded-xl border border-dashed border-border bg-muted/30 p-3 sm:flex-row sm:items-center">
                      <span className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-background">
                        {previewSrc ? (
                          // biome-ignore lint/performance/noImgElement: supports local blob and remote URLs
                          <img
                            src={previewSrc}
                            alt="Service preview"
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
                        <p className="text-[11px] text-muted-foreground">
                          Current:{" "}
                          <span className="font-medium text-foreground">
                            {imageFile
                              ? imageFile.name
                              : service.image
                                ? "Existing image"
                                : "No image"}
                          </span>
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <label
                            htmlFor={`${dialogTitleId}-image`}
                            className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-xs font-semibold transition-colors hover:bg-muted"
                          >
                            <Upload className="size-3.5" aria-hidden="true" />
                            {previewSrc ? "Replace image" : "Upload image"}
                          </label>
                          {imageFile ? (
                            <button
                              type="button"
                              onClick={removeSelectedImage}
                              className="inline-flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-danger-soft hover:text-danger-foreground"
                            >
                              <X className="size-3.5" aria-hidden="true" />
                              Use current
                            </button>
                          ) : null}
                        </div>
                        <input
                          ref={fileInputRef}
                          id={`${dialogTitleId}-image`}
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="sr-only"
                          onChange={handleImageChange}
                        />
                        <p className="mt-1.5 text-[11px] text-muted-foreground">
                          {service.image
                            ? "Leave unchanged to keep the current image."
                            : "No current image set."}
                        </p>
                        {imageError ? (
                          <p className="mt-1 text-[11px] text-danger">
                            {imageError}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
                  <button
                    type="submit"
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-accent px-4 text-sm font-semibold text-white shadow-sm shadow-accent/25 transition-colors hover:bg-[#a96f66]"
                  >
                    <Save className="size-4" aria-hidden="true" />
                    Save changes
                  </button>
                  <button
                    type="button"
                    onClick={resetToCurrent}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    <Clock3 className="size-4" aria-hidden="true" />
                    Reset to current
                  </button>
                  <button
                    type="button"
                    onClick={closeDialog}
                    className="ml-auto inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
