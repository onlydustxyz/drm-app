"use client";

import ContributorsList from "@/components/segments/contributors-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSegment } from "@/lib/react-query/segments";
import { use } from "react";

export default function LinkedContributorsPage({ params }: { params: Promise<{ id: string }> }) {
	const resolvedParams = use(params);
	const { data: segment, isLoading, error } = useSegment(resolvedParams.id);

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

	return <ContributorsList repoIds={segment.repositories} />;
}
