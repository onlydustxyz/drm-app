"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSegment } from "@/lib/react-query/segments";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SegmentPage({ params }: { params: { id: string } }) {
	const { data: segment, isLoading, error } = useSegment(params.id);

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
			<div className="grid gap-6">
				<Card>
					<CardContent>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<h3 className="text-lg font-semibold mb-2">Contributors</h3>
								{segment.github_user_logins && segment.github_user_logins.length > 0 ? (
									<ul className="list-disc pl-5">
										{segment.github_user_logins.map((githubLogin: string) => (
											<li key={githubLogin}>
												<a
													href={`https://github.com/${githubLogin}`}
													target="_blank"
													rel="noopener noreferrer"
													className="text-blue-600 hover:underline flex items-center"
												>
													<img
														src={`https://github.com/${githubLogin}.png`}
														alt={`${githubLogin}'s avatar`}
														className="w-6 h-6 rounded-full mr-2"
													/>
													@{githubLogin}
												</a>
											</li>
										))}
									</ul>
								) : (
									<p className="text-muted-foreground">No contributors added yet</p>
								)}
							</div>
							<div>
								<h3 className="text-lg font-semibold mb-2">Repositories</h3>
								{segment.repositories && segment.repositories.length > 0 ? (
									<ul className="list-disc pl-5">
										{segment.repositories.map((repoId: string) => (
											<li key={repoId}>Repository ID: {repoId}</li>
										))}
									</ul>
								) : (
									<p className="text-muted-foreground">No repositories added yet</p>
								)}
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
