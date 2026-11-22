import {
  CalendarDays,
  CreditCard,
  Mail,
  ReceiptText,
  User,
} from "lucide-react";
import { Eachservicesfunc, EachUserbyId } from "@/lib/core/Importantfunction";
import { StatusPill } from "../../component/dashboard-ui";

export type TransactionPaymentStatus = "paid" | "pending" | "refunded";

interface IbookingType {
  _id: string;
  serviceId: string;
  customerId: string;
  appointmentDate: string;
  timeSlot: string;
  message: string;
  servicePrice: number;
  paymentStatus: string;
  status: string;
  createdAt: string;
}

interface Itransactionstype {
  _id: string;
  sessionId: string;
  status: string;
  payment_status: string;
  customer_email: string;
  userId: string;
  serviceID: string;
  payment_intent: string;
  currency: string;
  trdate: string | null;
}

interface IProps {
  Eachbook: IbookingType;
  EachTran: Itransactionstype;
}

function formatDate(value: string | undefined | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value: string | undefined | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatAmount(
  amount: number | string | undefined,
  currency: string | undefined,
) {
  const value =
    typeof amount === "number"
      ? amount
      : typeof amount === "string" && amount.trim() !== ""
        ? Number(amount)
        : undefined;
  if (!Number.isFinite(value)) return "—";
  const curr = (currency || "BDT").toUpperCase();
  if (curr === "BDT") return `৳ ${Number(value).toLocaleString("en-BD")}`;
  return `${curr} ${Number(value).toLocaleString()}`;
}

function shortenId(value: string | undefined, start = 12, end = 8) {
  if (!value) return "—";
  if (value.length <= start + end + 3) return value;
  return `${value.slice(0, start)}...${value.slice(-end)}`;
}

function normalizePaymentStatus(
  status: string | undefined,
): TransactionPaymentStatus {
  const value = (status || "").toLowerCase();
  if (value === "paid" || value === "complete" || value === "completed") {
    return "paid";
  }
  if (value === "refunded") return "refunded";
  return "pending";
}

function getUserInfo(userData: unknown, fallbackEmail: string) {
  const user = Array.isArray(userData) ? userData[0] : userData;
  const obj =
    user && typeof user === "object" ? (user as Record<string, unknown>) : {};
  const name = typeof obj.name === "string" ? obj.name : undefined;
  const email =
    typeof obj.email === "string" ? obj.email : fallbackEmail || undefined;
  return {
    name: name || email || "Unknown customer",
    email: email || "—",
  };
}

export async function TransactionsTable({ Eachbook, EachTran }: IProps) {
  const userData = await EachUserbyId(EachTran.userId);

  const resForservice = await Eachservicesfunc(Eachbook.serviceId);
  const EachservideData = await resForservice.json();

  const customer = getUserInfo(userData, EachTran.customer_email);
  const serviceName =
    (EachservideData && typeof EachservideData.name === "string"
      ? EachservideData.name
      : undefined) || "Unknown service";
  const amount = Eachbook.servicePrice ?? EachservideData?.price;
  const currency = (EachTran.currency || "BDT").toUpperCase();
  const paymentStatus = normalizePaymentStatus(EachTran.payment_status);
  const transactionDate = EachTran.trdate || Eachbook.createdAt;

  return (
    <tr className="border-t border-border transition-colors hover:bg-muted/40">
      <td className="px-4 py-4 sm:px-5">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 hidden size-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent sm:flex">
            <User className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="font-medium text-foreground">{customer.name}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Mail className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{customer.email}</span>
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground sm:hidden">
              {formatDate(Eachbook.appointmentDate)}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4 sm:px-5">
        <div className="flex items-center gap-2 text-foreground">
          <ReceiptText
            className="hidden size-4 shrink-0 text-accent sm:block"
            aria-hidden="true"
          />
          <span className="font-medium">{serviceName}</span>
        </div>
        <p className="mt-1 hidden text-xs text-muted-foreground lg:block">
          Service ID: {Eachbook.serviceId || "—"}
        </p>
      </td>

      <td className="hidden px-5 py-4 text-muted-foreground whitespace-nowrap md:table-cell">
        <div className="flex items-center gap-2">
          <CalendarDays
            className="size-4 shrink-0 text-accent"
            aria-hidden="true"
          />
          <span>{formatDate(Eachbook.appointmentDate)}</span>
        </div>
        {Eachbook.timeSlot ? (
          <p className="mt-1 text-xs text-muted-foreground">
            {Eachbook.timeSlot}
          </p>
        ) : null}
      </td>

      <td className="px-4 py-4 font-semibold whitespace-nowrap text-foreground sm:px-5">
        {formatAmount(amount, currency)}
        <p className="mt-1 text-[11px] font-normal text-muted-foreground md:hidden">
          {currency}
        </p>
      </td>

      <td className="hidden px-5 py-4 md:table-cell">
        <span className="inline-flex rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground uppercase">
          {currency}
        </span>
      </td>

      <td className="hidden px-5 py-4 lg:table-cell">
        <span
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground"
          title={EachTran.sessionId || "No session ID"}
        >
          <CreditCard
            className="size-3.5 shrink-0 text-accent"
            aria-hidden="true"
          />
          {shortenId(EachTran.sessionId)}
        </span>
        {EachTran.payment_intent ? (
          <p
            className="mt-1 font-mono text-[11px] text-muted-foreground"
            title={EachTran.payment_intent}
          >
            Intent: {shortenId(EachTran.payment_intent, 10, 6)}
          </p>
        ) : null}
      </td>

      <td className="px-4 py-4 sm:px-5">
        <StatusPill status={paymentStatus} />
        <p className="mt-1 hidden text-[11px] text-muted-foreground capitalize sm:block">
          {EachTran.status || EachTran.payment_status || "—"}
        </p>
      </td>

      <td className="hidden px-5 py-4 text-muted-foreground whitespace-nowrap xl:table-cell">
        {formatDateTime(transactionDate)}
      </td>
    </tr>
  );
}

export default TransactionsTable;
