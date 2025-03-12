import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ServerCommitsByDevTypeSection } from "@/components/dashboard/sections/commits-by-dev-type/server";
import { ServerDevActivitySection } from "@/components/dashboard/sections/dev-activity/server";
import { ServerDeveloperActivitySection } from "@/components/dashboard/sections/developer-activity/server";
import { ServerDeveloperLocationsSection } from "@/components/dashboard/sections/developer-locations/server";
import { ServerDevelopersByChainSection } from "@/components/dashboard/sections/developers-by-chain/server";
import { ServerKPISection } from "@/components/dashboard/sections/kpi/server";
import { ServerMonthlyCommitsSection } from "@/components/dashboard/sections/monthly-commits/server";
import { ServerMonthlyPRsMergedSection } from "@/components/dashboard/sections/monthly-prs-merged/server";
import { Suspense } from "react";

// Loading placeholders
function KPILoading() {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full h-24 animate-pulse bg-muted rounded-lg"></div>
	);
}

function ChartLoading() {
	return <div className="h-80 animate-pulse bg-muted rounded-lg"></div>;
}

export default function DashboardPage() {
	return (
		<DashboardLayout>
			<Suspense fallback={<KPILoading />}>
				<ServerKPISection />
			</Suspense>

			<div className="grid gap-4 md:grid-cols-2 w-full">
				<Suspense fallback={<ChartLoading />}>
					<ServerDeveloperActivitySection />
				</Suspense>
				<Suspense fallback={<ChartLoading />}>
					<ServerDevelopersByChainSection />
				</Suspense>
			</div>

			<div className="grid gap-4 md:grid-cols-2 w-full">
				<Suspense fallback={<ChartLoading />}>
					<ServerDeveloperLocationsSection />
				</Suspense>
				<Suspense fallback={<ChartLoading />}>
					<ServerCommitsByDevTypeSection />
				</Suspense>
			</div>

			<div className="grid gap-4 md:grid-cols-2 w-full">
				<Suspense fallback={<ChartLoading />}>
					<ServerMonthlyCommitsSection />
				</Suspense>
				<Suspense fallback={<ChartLoading />}>
					<ServerMonthlyPRsMergedSection />
				</Suspense>
			</div>

			<div className="w-full">
				<Suspense fallback={<ChartLoading />}>
					<ServerDevActivitySection />
				</Suspense>
			</div>
		</DashboardLayout>
	);
}
