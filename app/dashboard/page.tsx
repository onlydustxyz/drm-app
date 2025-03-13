import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ServerCommitsByDevTypeSection } from "@/components/dashboard/sections/commits-by-dev-type";
import { ServerDevActivitySection } from "@/components/dashboard/sections/dev-activity";
import { ServerDeveloperActivitySection } from "@/components/dashboard/sections/developer-activity";
import { ServerDeveloperLocationsSection } from "@/components/dashboard/sections/developer-locations";
import { KPICards, KPICardsSkeleton } from "@/components/dashboard/sections/kpi-cards";
import { ServerMonthlyCommitsSection } from "@/components/dashboard/sections/monthly-commits";
import { ServerMonthlyPRsMergedSection } from "@/components/dashboard/sections/monthly-prs-merged";
import { Suspense } from "react";

function ChartLoading() {
	return <div className="h-80 animate-pulse bg-muted rounded-lg"></div>;
}

export default function DashboardPage() {
	return (
		<DashboardLayout>
			<Suspense fallback={<KPICardsSkeleton />}>
				<KPICards />
			</Suspense>

			<div className="grid gap-4 md:grid-cols-2 w-full">
				<Suspense fallback={<ChartLoading />}>
					<ServerDeveloperActivitySection />
				</Suspense>
				<Suspense fallback={<ChartLoading />}>
					<ServerDeveloperLocationsSection />
				</Suspense>
			</div>

			<div className="grid gap-4 md:grid-cols-2 w-full">
				<Suspense fallback={<ChartLoading />}>
					<ServerCommitsByDevTypeSection />
				</Suspense>
				<Suspense fallback={<ChartLoading />}>
					<ServerMonthlyCommitsSection />
				</Suspense>
			</div>

			<div className="grid gap-4 md:grid-cols-2 w-full">
				<Suspense fallback={<ChartLoading />}>
					<ServerMonthlyPRsMergedSection />
				</Suspense>
				<Suspense fallback={<ChartLoading />}>
					<ServerDevActivitySection />
				</Suspense>
			</div>
		</DashboardLayout>
	);
}
