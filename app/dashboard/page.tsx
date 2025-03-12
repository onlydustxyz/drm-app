import { 
	getCommitsByDevType, 
	getDashboardKPIs, 
	getDevActivity, 
	getDeveloperActivity, 
	getDeveloperLocations, 
	getDevelopersByChain, 
	getMonthlyCommits, 
	getMonthlyPRsMerged 
} from "@/lib/dashboard-service";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default async function DashboardPage() {
	// Fetch data for the dashboard
	const kpis = await getDashboardKPIs();
	const developerActivity = await getDeveloperActivity();
	const developersByChain = await getDevelopersByChain();
	const developerLocations = await getDeveloperLocations();
	const commitsByDevType = await getCommitsByDevType();
	const monthlyCommits = await getMonthlyCommits();
	const monthlyPRsMerged = await getMonthlyPRsMerged();
	const devActivity = await getDevActivity();

	return (
		<DashboardClient 
			kpis={kpis}
			developerActivity={developerActivity}
			developersByChain={developersByChain}
			developerLocations={developerLocations}
			commitsByDevType={commitsByDevType}
			monthlyCommits={monthlyCommits}
			monthlyPRsMerged={monthlyPRsMerged}
			devActivity={devActivity}
		/>
	);
}
