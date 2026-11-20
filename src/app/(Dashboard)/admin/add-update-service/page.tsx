import { DashboardPage } from "../../component/dashboard-ui";
import ServiceForm from "./service-form";

export default function AddUpdateServicePage() {
  return (
    <DashboardPage
      eyebrow="Service catalogue"
      title="Add / update service"
      description="Create a new treatment or refresh an existing one. Everything is validated on this page before the service data is captured."
    >
      <ServiceForm />
    </DashboardPage>
  );
}
