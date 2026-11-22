import { EachbookingsfuncbyId } from "@/lib/core/Importantfunction";
import TransactionsTable from "./TransactionsTable";

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
  id: string;
  EachTran: Itransactionstype;
}

const EachServices = async ({ id, EachTran }: IProps) => {
  const res = await EachbookingsfuncbyId(id);

  if (!res.ok) {
    return (
      <tr className="border-t border-border">
        <td
          className="px-4 py-4 text-sm text-muted-foreground sm:px-5"
          colSpan={8}
        >
          Booking not found for transaction {EachTran._id}
        </td>
      </tr>
    );
  }

  const EachbookingData: IbookingType = await res.json();

  return <TransactionsTable EachTran={EachTran} Eachbook={EachbookingData} />;
};

export default EachServices;
