"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSegment } from "@/lib/react-query/segments";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { use } from "react";

export default function SegmentDetailLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ id: string }>;
}) {
	// Use React's `use` function to handle the Promise in client component
	const resolvedParams = use(params);
	const { data: segment, isLoading } = useSegment(resolvedParams.id);
	const pathname = usePathname();
	const router = useRouter();

	// Function to determine which tab is active
	const getActiveTab = () => {
		if (pathname.endsWith(`/${resolvedParams.id}`)) return "overview";
		if (pathname.includes("/linked-contributors")) return "linked-contributors";
		if (pathname.includes("/retention")) return "retention";
		return "overview";
	};

	// Function to handle tab change
	const handleTabChange = (value: string) => {
		if (value === "overview") {
			router.push(`/segments/${resolvedParams.id}`);
		} else {
			router.push(`/segments/${resolvedParams.id}/${value}`);
		}
	};

	// Determine if this is a repository-focused segment
	const isRepositorySegment = segment?.repositories && segment.repositories.length > 0;

	return (
		<div className="container mx-auto py-6">
			{isLoading ? (
				<>
					<div className="mb-6">
						<Skeleton className="h-10 w-64 mb-2" />
						<Skeleton className="h-4 w-1/2" />
					</div>
					<Skeleton className="h-12 w-full mb-6" />
				</>
			) : segment ? (
				<>
					<div className="mb-6">
						<Link href="/segments" passHref>
							<Button variant="outline">
								<ArrowLeft className="h-4 w-4 mr-2" />
								Back to Segments
							</Button>
						</Link>
					</div>

					<div className="mb-6">
						<h1 className="text-3xl font-bold">{segment.name}</h1>
						<p className="text-muted-foreground">{segment.description}</p>
					</div>

					<Tabs value={getActiveTab()} onValueChange={handleTabChange} className="mb-6">
						<TabsList
							className="grid w-full max-w-3xl"
							style={{
								gridTemplateColumns: isRepositorySegment
									? "repeat(3, minmax(0, 1fr))"
									: "repeat(2, minmax(0, 1fr))",
							}}
						>
							<TabsTrigger value="overview">Overview</TabsTrigger>
							{isRepositorySegment && (
								<TabsTrigger value="linked-contributors">Linked Contributors</TabsTrigger>
							)}
							<TabsTrigger value="retention">Retention</TabsTrigger>
						</TabsList>
					</Tabs>
				</>
			) : (
				<div className="mb-6">
					<h1 className="text-3xl font-bold">Segment not found</h1>
				</div>
			)}

			<div>{children}</div>
		</div>
	);
}
