import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { CommitsByDevTypeSection } from "@/components/dashboard/sections/commits-by-dev-type";
import { DevActivitySection } from "@/components/dashboard/sections/dev-activity";
import { DeveloperActivitySection } from "@/components/dashboard/sections/developer-activity";
import { KPICards } from "@/components/dashboard/sections/kpi-cards";
import { MonthlyCommitsSection } from "@/components/dashboard/sections/monthly-commits";
import { MonthlyPRsMergedSection } from "@/components/dashboard/sections/monthly-prs-merged";

export default function DashboardPage() {
	return (
		<DashboardLayout>
			<KPICards />

			<div className="grid gap-4 md:grid-cols-2 w-full">
				<DeveloperActivitySection />
				<DevActivitySection />
			</div>

			<div className="grid gap-4 md:grid-cols-2 w-full">
				<CommitsByDevTypeSection />
				<MonthlyCommitsSection />
			</div>

			<div className="grid gap-4 md:grid-cols-2 w-full">
				<MonthlyPRsMergedSection />
			</div>
		</DashboardLayout>
	);
}
