"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSegment } from "@/lib/react-query/segments";

export default function RetentionPage({ params }: { params: { id: string } }) {
	const { data: segment, isLoading, error } = useSegment(params.id);

	if (isLoading) {
		return (
			<div>
				<Card>
					<CardHeader>
						<Skeleton className="h-8 w-1/3 mb-2" />
						<Skeleton className="h-4 w-2/3" />
					</CardHeader>
					<CardContent>
						<Skeleton className="h-4 w-full mb-4" />
						<Skeleton className="h-4 w-full mb-4" />
						<Skeleton className="h-4 w-2/3" />
					</CardContent>
				</Card>
			</div>
		);
	}

	if (error || !segment) {
		return (
			<Card className="bg-red-50">
				<CardHeader>
					<CardTitle className="text-red-600">Error</CardTitle>
					<CardDescription>{error ? error.message : "Segment not found"}</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Retention Analysis</CardTitle>
				<CardDescription>Contributor retention metrics and analysis</CardDescription>
			</CardHeader>
			<CardContent>
				<p className="text-muted-foreground">Retention analysis will be displayed here in a future update.</p>

				<div className="mt-8 p-6 border border-dashed rounded-lg flex flex-col items-center justify-center">
					<div className="text-muted-foreground text-center mb-4">
						<p className="mb-2">This feature is still under development</p>
						<p>Retention analysis will show metrics about contributor engagement over time</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
