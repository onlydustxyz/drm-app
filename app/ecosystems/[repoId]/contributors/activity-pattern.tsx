"use client";

interface ActivityPeriod {
	start: string;
	end: string;
	intensity: string;
}

interface InactivePeriod {
	start: string;
	end: string;
	reason: string;
}

interface Contributor {
	activePeriods: ActivityPeriod[];
	inactivePeriods: InactivePeriod[];
}

export default function ActivityPattern({ contributor }: { contributor: Contributor }) {
	const totalMonths = contributor.activePeriods.reduce((total: number, period: ActivityPeriod) => {
		const startDate = new Date(period.start + "-01");
		const endDate = new Date(period.end + "-01");
		const months =
			(endDate.getFullYear() - startDate.getFullYear()) * 12 + endDate.getMonth() - startDate.getMonth() + 1;
		return total + months;
	}, 0);

	const inactiveMonths = contributor.inactivePeriods.reduce((total: number, period: InactivePeriod) => {
		const startDate = new Date(period.start + "-01");
		const endDate = new Date(period.end + "-01");
		const months =
			(endDate.getFullYear() - startDate.getFullYear()) * 12 + endDate.getMonth() - startDate.getMonth() + 1;
		return total + months;
	}, 0);

	const activePercentage = Math.round((totalMonths / (totalMonths + inactiveMonths)) * 100);

	return (
		<div className="flex flex-col space-y-1">
			<div className="flex items-center gap-2">
				<div className="h-2 bg-gray-200 rounded-full w-full overflow-hidden">
					<div className="h-full bg-green-500 rounded-full" style={{ width: `${activePercentage}%` }} />
				</div>
				<span className="text-xs text-muted-foreground">{activePercentage}% active</span>
			</div>

			<div className="text-xs text-muted-foreground">
				{contributor.inactivePeriods.length > 0 ? (
					<span>
						Last inactive:{" "}
						{
							contributor.inactivePeriods.sort(
								(a: InactivePeriod, b: InactivePeriod) =>
									new Date(b.end).getTime() - new Date(a.end).getTime()
							)[0].end
						}
					</span>
				) : (
					<span>Consistently active</span>
				)}
			</div>
		</div>
	);
}
