import { AlltransactionsGet } from "@/lib/core/Importantfunction";

import {
  DashboardPage,
  DashboardPanel,
  TableShell,
} from "../../component/dashboard-ui";
import EachServices from "./EachServices";

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

const page = async () => {
  const res = await AlltransactionsGet();
  const transactionsdata: Itransactionstype[] = await res.json();

  return (
    <DashboardPage
      eyebrow="Payments"
      title="Transactions"
      description="Review payment transactions, related services, and customer information."
    >
      <DashboardPanel
        title="Payment transactions"
        description="All recorded payment transactions."
        bodyClassName="p-0"
      >
        {transactionsdata.length === 0 ? (
          <div className="p-5 text-sm text-muted-foreground">
            No transactions found.
          </div>
        ) : (
          <TableShell className="min-w-full lg:min-w-[980px] xl:min-w-[1080px]">
            <thead>
              <tr className="text-[11px] tracking-wider text-muted-foreground uppercase">
                <th className="px-4 py-3 font-medium sm:px-5">Customer</th>
                <th className="px-4 py-3 font-medium sm:px-5">
                  Related Service
                </th>
                <th className="hidden px-5 py-3 font-medium md:table-cell">
                  Appointment Date
                </th>
                <th className="px-4 py-3 font-medium sm:px-5">Amount</th>
                <th className="hidden px-5 py-3 font-medium md:table-cell">
                  Currency
                </th>
                <th className="hidden px-5 py-3 font-medium lg:table-cell">
                  Stripe Session
                </th>
                <th className="px-4 py-3 font-medium sm:px-5">
                  Payment Status
                </th>
                <th className="hidden px-5 py-3 font-medium xl:table-cell">
                  Transaction Date
                </th>
              </tr>
            </thead>
            <tbody>
              {transactionsdata.map((v) => (
                <EachServices key={v._id} id={v.serviceID} EachTran={v} />
              ))}
            </tbody>
          </TableShell>
        )}
      </DashboardPanel>
    </DashboardPage>
  );
};

export default page;
