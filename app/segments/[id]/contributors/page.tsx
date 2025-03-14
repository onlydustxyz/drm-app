"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSegment } from "@/lib/react-query/segments";

export default function ContributorsPage({ params }: { params: { id: string } }) {
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
				<CardTitle>Contributors</CardTitle>
				<CardDescription>List of contributors in this segment</CardDescription>
			</CardHeader>
			<CardContent>
				{segment.github_user_logins && segment.github_user_logins.length > 0 ? (
					<ul className="space-y-2">
						{segment.github_user_logins.map((githubLogin: string) => (
							<li
								key={githubLogin}
								className="p-3 border rounded-md hover:bg-muted transition-colors flex items-center"
							>
								<img
									src={`https://github.com/${githubLogin}.png`}
									alt={`${githubLogin}'s avatar`}
									className="w-10 h-10 rounded-full mr-3"
								/>
								<div className="font-medium">@{githubLogin}</div>
							</li>
						))}
					</ul>
				) : (
					<p className="text-muted-foreground">No contributors have been added to this segment yet.</p>
				)}
			</CardContent>
		</Card>
	);
}
