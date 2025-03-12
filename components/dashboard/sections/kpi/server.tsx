import { getDashboardKPIs } from "@/lib/services/dashboard-service";
import { FilterableKPICards } from "./filterable-kpi-cards";

export async function ServerKPISection() {
	// Fetch the KPI data on the server
	const kpis = await getDashboardKPIs();

	return <FilterableKPICards kpis={kpis} />;
}
