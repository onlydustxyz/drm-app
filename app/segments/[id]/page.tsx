"use client";

import ContributorsList from "@/components/segments/contributors-list";
import { RepositoriesList } from "@/components/segments/repositories-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSegment } from "@/lib/react-query/segments";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";

export default function SegmentPage({ params }: { params: Promise<{ id: string }> }) {
	const resolvedParams = use(params);
	const { data: segment, isLoading, error } = useSegment(resolvedParams.id);

	const isRepositorySegment = segment?.repositories && segment.repositories.length > 0;

	const names = segment?.repositories
		?.map((repositoryUrl) => {
			try {
				const url = new URL(repositoryUrl);
				return url.pathname;
			} catch (error) {
				console.error("Invalid URL format:", repositoryUrl, error);
				return "";
			}
		})
		.filter(Boolean);

	if (isLoading) {
		return (
			<div className="container mx-auto py-6">
				<div className="mb-6">
					<Skeleton className="h-10 w-40" />
				</div>
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
			<div className="container mx-auto py-6">
				<div className="mb-6">
					<Link href="/segments" passHref>
						<Button variant="outline">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Segments
						</Button>
					</Link>
				</div>
				<Card className="bg-red-50">
					<CardHeader>
						<CardTitle className="text-red-600">Error</CardTitle>
						<CardDescription>{error ? error.message : "Segment not found"}</CardDescription>
					</CardHeader>
				</Card>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-6">
			{isRepositorySegment ? <RepositoriesList names={names} /> : <ContributorsList />}
		</div>
	);
}
