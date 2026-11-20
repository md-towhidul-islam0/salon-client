import ServicesBrowser, { type ServiceItem } from "./services-browser";

async function getServices(): Promise<ServiceItem[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) return [];

  try {
    const response = await fetch(`${baseUrl}/services`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    if (!Array.isArray(data)) return [];

    return data.filter(
      (service): service is ServiceItem =>
        service && typeof service === "object" && service.status === "active",
    );
  } catch {
    return [];
  }
}

export default async function Servicerdata() {
  const services = await getServices();
  return <ServicesBrowser services={services} />;
}
