import {
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
  CalendarX2,
  Scissors,
} from "lucide-react";
import { Suspense } from "react";

import {
  EachUserbookingsfuncbyId,
  getSessionByserver,
} from "@/lib/core/Importantfunction";

import { ActionLink, DashboardPage, StatCard } from "../component/dashboard-ui";

type Appointment = {
  _id: string;
  serviceId: string;
  customerId: string;
  appointmentDate: string;
  timeSlot: string;
  message?: string;
  servicePrice: number;
  paymentStatus: "paid" | "unpaid";
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
};

async function CustomerGreeting() {
  const session = await getSessionByserver();
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";
  return <>Hello, {firstName}</>;
}

export default async function CustomerOverviewPage() {
  const session = await getSessionByserver();

  let appointments: Appointment[] = [];
  try {
    if (session?.user?.id) {
      const res = await EachUserbookingsfuncbyId(session.user.id);
      const data = await res.json();
      appointments = Array.isArray(data) ? (data as Appointment[]) : [];
    }
  } catch {
    appointments = [];
  }

  const totalAppointmentRequests = appointments.length;
  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "pending",
  ).length;
  const confirmedAppointments = appointments.filter(
    (appointment) => appointment.status === "confirmed",
  ).length;
  const cancelledAppointments = appointments.filter(
    (appointment) => appointment.status === "cancelled",
  ).length;

  return (
    <DashboardPage
      eyebrow="Dashboard overview"
      title={
        <Suspense fallback="Hello">
          <CustomerGreeting />
        </Suspense>
      }
      description="Track your appointment requests and their current status at a glance."
      actions={
        <ActionLink href="/services" icon={Scissors}>
          Book a service
        </ActionLink>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total appointment requests"
          value={String(totalAppointmentRequests)}
          hint="All your booking requests"
          icon={CalendarDays}
          tone="accent"
        />
        <StatCard
          label="Pending appointments"
          value={String(pendingAppointments)}
          hint="Awaiting confirmation"
          icon={CalendarClock}
          tone="amber"
        />
        <StatCard
          label="Confirmed appointments"
          value={String(confirmedAppointments)}
          hint="Approved and scheduled"
          icon={CalendarCheck2}
          tone="sky"
        />
        <StatCard
          label="Cancelled appointments"
          value={String(cancelledAppointments)}
          hint="Cancelled booking requests"
          icon={CalendarX2}
          tone="rose"
        />
      </div>
    </DashboardPage>
  );
}
