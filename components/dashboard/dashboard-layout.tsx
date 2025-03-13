import { Separator } from "@/components/ui/separator";
import { ReactNode } from "react";

interface DashboardLayoutProps {
	children: ReactNode;
}

function DashboardHeader() {
	return (
		<>
			<div className="flex justify-between items-center">
				<div>
					<div className="flex items-center gap-3">
						<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
					</div>
					<p className="text-muted-foreground">Metrics for your developer ecosystem.</p>
				</div>
			</div>
			<Separator />
		</>
	);
}

function DashboardContent({ children }: { children: ReactNode }) {
	return (
		<div className="space-y-6 w-full max-w-full">
			<DashboardHeader />
			<div className="space-y-6 w-full max-w-full">{children}</div>
		</div>
	);
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
	return <DashboardContent>{children}</DashboardContent>;
}
