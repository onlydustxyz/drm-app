"use client";

import { EditSegmentDialog } from "@/components/segments/edit-segment-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteSegment, useSegments } from "@/lib/react-query/segments";
import { Segment } from "@/lib/services/segments-service";
import { Edit, Eye, Trash } from "lucide-react";
import Link from "next/link";

export function SegmentsList() {
	const { data: segments, isLoading, error } = useSegments();
	const deleteSegmentMutation = useDeleteSegment();

	const handleDeleteSegment = (id: string) => {
		if (confirm("Are you sure you want to delete this segment?")) {
			deleteSegmentMutation.mutate(id);
		}
	};

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{[...Array(3)].map((_, i) => (
					<Card key={i} className="overflow-hidden">
						<CardHeader className="pb-2">
							<Skeleton className="h-6 w-3/4 mb-2" />
							<Skeleton className="h-4 w-full" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-4 w-full mb-2" />
							<Skeleton className="h-4 w-3/4" />
						</CardContent>
						<CardFooter>
							<Skeleton className="h-9 w-20 mr-2" />
							<Skeleton className="h-9 w-20" />
						</CardFooter>
					</Card>
				))}
			</div>
		);
	}

	if (error) {
		return <div className="text-red-500">Error loading segments: {error.message}</div>;
	}

	if (!segments || segments.length === 0) {
		return (
			<Card className="text-center p-6">
				<CardTitle className="mb-2">No segments found</CardTitle>
				<CardDescription>
					Create your first segment to start tracking contributors and repositories.
				</CardDescription>
			</Card>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{segments.map((segment: Segment) => (
				<SegmentCard key={segment.id} segment={segment} onDelete={() => handleDeleteSegment(segment.id)} />
			))}
		</div>
	);
}

interface SegmentCardProps {
	segment: Segment;
	onDelete: () => void;
}

function SegmentCard({ segment, onDelete }: SegmentCardProps) {
	const contributorsCount = segment.github_user_logins?.length || 0;
	const repositoriesCount = segment.repositories?.length || 0;

	return (
		<Card>
			<CardHeader>
				<CardTitle>{segment.name}</CardTitle>
				<CardDescription>{segment.description}</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col space-y-2">
					<div className="flex justify-between">
						<span className="text-sm text-muted-foreground">Contributors:</span>
						<span className="font-medium">{contributorsCount}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-sm text-muted-foreground">Repositories:</span>
						<span className="font-medium">{repositoriesCount}</span>
					</div>
				</div>
			</CardContent>
			<CardFooter className="flex justify-end space-x-2">
				<Link href={`/segments/${segment.id}`} passHref>
					<Button variant="outline" size="sm">
						<Eye className="h-4 w-4 mr-2" />
						View
					</Button>
				</Link>

				<EditSegmentDialog segment={segment}>
					<Button variant="outline" size="sm">
						<Edit className="h-4 w-4 mr-2" />
						Edit
					</Button>
				</EditSegmentDialog>

				<Button variant="outline" size="sm" onClick={onDelete}>
					<Trash className="h-4 w-4 mr-2" />
					Delete
				</Button>
			</CardFooter>
		</Card>
	);
}
