import {
  Banknote,
  CreditCard,
  Download,
  ReceiptText,
  TrendingUp,
  Wallet,
} from "lucide-react";

import {
  DashboardPage,
  DashboardPanel,
  StatCard,
  StatusPill,
  TableShell,
} from "../../component/dashboard-ui";

const transactions = [
  {
    id: "TXN-90821",
    customer: "Nusrat Jahan",
    service: "Balayage & Gloss",
    method: "bKash",
    date: "19 Nov 2026 · 10:42 AM",
    status: "paid" as const,
    amount: "৳ 4,200",
  },
  {
    id: "TXN-90820",
    customer: "Tanvir Ahmed",
    service: "Signature Haircut",
    method: "Cash",
    date: "19 Nov 2026 · 9:15 AM",
    status: "paid" as const,
    amount: "৳ 800",
  },
  {
    id: "TXN-90819",
    customer: "Mehjabin Chowdhury",
    service: "Luxury Facial",
    method: "Card",
    date: "18 Nov 2026 · 5:20 PM",
    status: "paid" as const,
    amount: "৳ 1,600",
  },
  {
    id: "TXN-90818",
    customer: "Ishrat Jahan",
    service: "Bridal Makeover",
    method: "bKash",
    date: "18 Nov 2026 · 1:05 PM",
    status: "pending" as const,
    amount: "৳ 6,500",
  },
  {
    id: "TXN-90817",
    customer: "Sadia Rahman",
    service: "Hair Spa & Gloss",
    method: "Card",
    date: "17 Nov 2026 · 4:48 PM",
    status: "refunded" as const,
    amount: "৳ 1,900",
  },
  {
    id: "TXN-90816",
    customer: "Farhan Kabir",
    service: "Beard Sculpt & Trim",
    method: "Cash",
    date: "17 Nov 2026 · 12:10 PM",
    status: "paid" as const,
    amount: "৳ 650",
  },
];

export default function TransactionsPage() {
  return (
    <DashboardPage
      eyebrow="Payments"
      title="Transactions"
      description="Every payment, refund, and pending charge in one ledger. Export records for accounting at any time."
      actions={
        <button
          type="button"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          <Download className="size-4" aria-hidden="true" />
          Export CSV
        </button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total revenue"
          value="৳ 4,82,350"
          hint="All time"
          icon={Wallet}
          tone="accent"
        />
        <StatCard
          label="This month"
          value="৳ 48,250"
          hint="vs. ৳ 39,900 last month"
          trend="+20.9%"
          icon={TrendingUp}
          tone="emerald"
        />
        <StatCard
          label="Pending charges"
          value="৳ 9,800"
          hint="4 invoices awaiting payment"
          icon={ReceiptText}
          tone="amber"
        />
        <StatCard
          label="Refunded"
          value="৳ 3,400"
          hint="3 refunds this month"
          icon={Banknote}
          tone="rose"
        />
      </div>

      <DashboardPanel
        title="Payment ledger"
        description="Most recent transactions across all payment methods."
        bodyClassName="p-0"
        action={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-500">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Live
          </span>
        }
      >
        <TableShell>
          <thead>
            <tr className="text-[11px] tracking-wider text-muted-foreground uppercase">
              <th className="px-5 py-3 font-medium">Transaction</th>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Service</th>
              <th className="px-5 py-3 font-medium">Method</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-t border-border transition-colors hover:bg-muted/40"
              >
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground">
                    <CreditCard
                      className="size-3.5 text-accent"
                      aria-hidden="true"
                    />
                    {transaction.id}
                  </span>
                </td>
                <td className="px-5 py-3.5 font-medium">
                  {transaction.customer}
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">
                  {transaction.service}
                </td>
                <td className="px-5 py-3.5">
                  <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
                    {transaction.method}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-xs text-muted-foreground">
                  {transaction.date}
                </td>
                <td className="px-5 py-3.5">
                  <StatusPill status={transaction.status} />
                </td>
                <td className="px-5 py-3.5 text-right font-semibold">
                  {transaction.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </TableShell>

        <div className="flex flex-col gap-2 border-t border-border px-5 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Showing 6 of 1,284 transactions</p>
          <p>Page 1 of 214</p>
        </div>
      </DashboardPanel>
    </DashboardPage>
  );
}
