import {
  CirclePlus,
  Clock,
  Eye,
  ImageIcon,
  Scissors,
  Sparkles,
} from "lucide-react";

import { DashboardPage, DashboardPanel } from "../../component/dashboard-ui";
import ServiceForm from "./service-form";

const tips = [
  "Use a service name customers already search for.",
  "Keep pricing transparent — surprise fees hurt conversion.",
  "Add a duration so the booking calendar stays accurate.",
  "Feature 2–3 signature treatments rather than everything.",
];

export default function AddUpdateServicePage() {
  return (
    <DashboardPage
      eyebrow="Service catalogue"
      title="Add or update a service"
      description="Create a new treatment or refine an existing one. The live preview on the right shows how it will appear to customers."
    >
      <div className="grid gap-4 xl:grid-cols-3">
        <DashboardPanel
          className="xl:col-span-2"
          title="Service details"
          description="Required fields are marked by the browser before saving."
          action={
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-semibold text-accent">
              <CirclePlus className="size-3" aria-hidden="true" />
              New service
            </span>
          }
        >
          <ServiceForm />
        </DashboardPanel>

        <div className="space-y-4">
          <DashboardPanel
            title="Live preview"
            description="Customer-facing card"
          >
            <div className="rounded-2xl border border-border bg-gradient-to-br from-accent/10 via-transparent to-transparent p-5">
              <div className="flex items-start justify-between">
                <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-white shadow-md shadow-accent/25">
                  <Scissors className="size-5" aria-hidden="true" />
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-background/70 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-accent uppercase">
                  <Sparkles className="size-3" aria-hidden="true" />
                  Featured
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold">Signature Haircut</h3>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                A tailored cut, wash, and finish designed around your hair type
                and daily routine.
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-3 text-sm">
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3.5" aria-hidden="true" />
                  45 min
                </span>
                <span className="font-bold text-accent">৳ 800</span>
              </div>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Eye className="size-3.5" aria-hidden="true" />
              Preview updates when this form is connected to live data.
            </p>
          </DashboardPanel>

          <DashboardPanel title="Publishing checklist">
            <ul className="space-y-3">
              {tips.map((tip) => (
                <li
                  key={tip}
                  className="flex items-start gap-2.5 text-xs leading-5 text-muted-foreground"
                >
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                  {tip}
                </li>
              ))}
            </ul>
          </DashboardPanel>

          <div className="flex items-start gap-3 rounded-2xl border border-dashed border-border p-4">
            <ImageIcon
              className="mt-0.5 size-4 shrink-0 text-accent"
              aria-hidden="true"
            />
            <p className="text-xs leading-5 text-muted-foreground">
              Service imagery is optional. Add a 4:3 photo to make the card
              stand out on the services page.
            </p>
          </div>
        </div>
      </div>
    </DashboardPage>
  );
}
