"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContributor } from "@/lib/react-query/contributors";
import { formatDate } from "@/lib/utils";
import {
	AlertCircle,
	Building,
	Calendar,
	ExternalLink,
	FolderGit,
	GitBranch,
	GitCommit,
	GitPullRequest,
	Link as LinkIcon,
	MapPin,
	Star,
	Users,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface ContributorDetailPanelProps {
	contributorId: string | null;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

// Define types for the activity data
interface WeeklyActivity {
	week: number;
	commits: number;
	prs: number;
}

export function ContributorDetailPanel({ contributorId, isOpen, onOpenChange }: ContributorDetailPanelProps) {
	// Fetch selected contributor details
	const { data: selectedContributor, isLoading: isLoadingDetails } = useContributor(contributorId ?? "", {
		enabled: !!contributorId && isOpen,
	});

	// Sample weekly activity data - replace with actual data from API when available
	const weeklyActivityData: WeeklyActivity[] = [
		{ week: 1, commits: 12, prs: 3 },
		{ week: 2, commits: 8, prs: 2 },
		{ week: 3, commits: 15, prs: 4 },
		{ week: 4, commits: 10, prs: 1 },
		{ week: 5, commits: 5, prs: 2 },
		{ week: 6, commits: 7, prs: 2 },
		{ week: 7, commits: 13, prs: 3 },
		{ week: 8, commits: 9, prs: 1 },
	];

	// Sample pull requests data - replace with actual data from API
	const pullRequestsData = [
		{
			id: "pr1",
			title: "Add new authentication flow",
			status: "merged",
			repository: "auth-service",
			createdAt: "2023-05-15T10:30:00Z",
			url: "#",
		},
		{
			id: "pr2",
			title: "Fix pagination bug in dashboard",
			status: "open",
			repository: "frontend-app",
			createdAt: "2023-06-02T14:20:00Z",
			url: "#",
		},
		{
			id: "pr3",
			title: "Update API documentation",
			status: "merged",
			repository: "api-docs",
			createdAt: "2023-04-28T09:15:00Z",
			url: "#",
		},
	];

	// Sample issues data - replace with actual data from API
	const issuesData = [
		{
			id: "issue1",
			title: "Server crashes when handling large file uploads",
			status: "open",
			repository: "file-service",
			createdAt: "2023-05-20T11:45:00Z",
			url: "#",
		},
		{
			id: "issue2",
			title: "Mobile view has layout issues on small screens",
			status: "closed",
			repository: "frontend-app",
			createdAt: "2023-05-05T08:30:00Z",
			url: "#",
		},
		{
			id: "issue3",
			title: "Authentication token expires too quickly",
			status: "open",
			repository: "auth-service",
			createdAt: "2023-06-10T16:20:00Z",
			url: "#",
		},
	];

	return (
		<Sheet open={isOpen} onOpenChange={onOpenChange}>
			<SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
				{isLoadingDetails ? (
					<>
						<SheetTitle className="sr-only">Loading...</SheetTitle>
						<div className="flex flex-col gap-4 mt-8">
							<div className="h-6 bg-muted rounded animate-pulse w-2/3"></div>
							<div className="h-4 bg-muted rounded animate-pulse w-full"></div>
							<div className="h-20 bg-muted rounded animate-pulse w-full mt-4"></div>
							<div className="grid grid-cols-2 gap-4 mt-4">
								<div className="h-16 bg-muted rounded animate-pulse"></div>
								<div className="h-16 bg-muted rounded animate-pulse"></div>
							</div>
						</div>
					</>
				) : selectedContributor ? (
					<>
						<SheetHeader className="mb-6">
							<div className="flex items-center gap-3">
								<Avatar className="h-12 w-12">
									<AvatarImage src={selectedContributor.avatar} alt={selectedContributor.name} />
									<AvatarFallback>
										{selectedContributor.name.slice(0, 2).toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div>
									<SheetTitle className="text-xl flex items-center gap-2 mb-1">
										{selectedContributor.handle}
										<a
											href={`https://github.com/${selectedContributor.handle}`}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex h-5 w-5 text-muted-foreground hover:text-primary"
										>
											<ExternalLink size={18} />
										</a>
									</SheetTitle>
								</div>
							</div>
						</SheetHeader>

						{/* Contributor Stats */}
						<div className="space-y-6">
							{/* Overview Stats */}
							<div className="grid grid-cols-3 gap-3">
								<div className="bg-muted/50 rounded-lg p-3 flex flex-col items-center justify-center text-center">
									<GitCommit className="h-5 w-5 mb-1 text-primary" />
									<div className="text-xs text-muted-foreground">Commits</div>
									<div className="text-base font-semibold">{selectedContributor.commits}</div>
								</div>
								<div className="bg-muted/50 rounded-lg p-3 flex flex-col items-center justify-center text-center">
									<GitPullRequest className="h-5 w-5 mb-1 text-primary" />
									<div className="text-xs text-muted-foreground">PRs Merged</div>
									<div className="text-base font-semibold">{selectedContributor.prMerged}</div>
								</div>
								<div className="bg-muted/50 rounded-lg p-3 flex flex-col items-center justify-center text-center">
									<GitPullRequest className="h-5 w-5 mb-1 text-yellow-500" />
									<div className="text-xs text-muted-foreground">Open PRs</div>
									<div className="text-base font-semibold">
										{(selectedContributor as any)?.openPRs || 0}
									</div>
								</div>
								<div className="bg-muted/50 rounded-lg p-3 flex flex-col items-center justify-center text-center">
									<FolderGit className="h-5 w-5 mb-1 text-green-500" />
									<div className="text-xs text-muted-foreground">Repositories</div>
									<div className="text-base font-semibold">
										{selectedContributor.repositories?.length || 0}
									</div>
								</div>
								<div className="bg-muted/50 rounded-lg p-3 flex flex-col items-center justify-center text-center">
									<Star className="h-5 w-5 mb-1 text-amber-500" />
									<div className="text-xs text-muted-foreground">Stars</div>
									<div className="text-base font-semibold">{selectedContributor.stars}</div>
								</div>
								<div className="bg-muted/50 rounded-lg p-3 flex flex-col items-center justify-center text-center">
									<Calendar className="h-5 w-5 mb-1 text-blue-500" />
									<div className="text-xs text-muted-foreground">Last Active</div>
									<div className="text-xs font-medium">
										{formatDate(selectedContributor.lastActive)}
									</div>
								</div>
							</div>

							{/* Personal Information */}
							<div>
								<h3 className="text-md font-medium mb-3">Personal Information</h3>
								<div className="grid gap-3">
									{/* Location and GitHub Profile */}
									<Card className="overflow-hidden border-0 bg-muted/30">
										<CardContent className="p-3">
											<div className="grid md:grid-cols-2 gap-3">
												{selectedContributor.location && (
													<div className="flex items-center gap-2.5 p-2 rounded-md bg-muted/50">
														<div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
															<MapPin className="h-4 w-4 text-primary" />
														</div>
														<div className="flex flex-col">
															<span className="text-xs text-muted-foreground">
																Location
															</span>
															<span className="text-sm font-medium">
																{selectedContributor.location}
															</span>
														</div>
													</div>
												)}
												<div className="flex items-center gap-2.5 p-2 rounded-md bg-muted/50">
													<div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
														<ExternalLink className="h-4 w-4 text-primary" />
													</div>
													<div className="flex flex-col">
														<span className="text-xs text-muted-foreground">GitHub</span>
														<a
															href={`https://github.com/${selectedContributor.handle}`}
															target="_blank"
															rel="noopener noreferrer"
															className="text-sm font-medium text-primary hover:underline"
														>
															@{selectedContributor.handle}
														</a>
													</div>
												</div>
											</div>
										</CardContent>
									</Card>

									{/* Followers */}
									{selectedContributor.followers !== undefined && (
										<Card className="overflow-hidden border-0 bg-muted/30">
											<CardContent className="p-3">
												<div className="flex items-center gap-2.5">
													<div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500/10">
														<Users className="h-4 w-4 text-blue-500" />
													</div>
													<div className="flex flex-col">
														<span className="text-xs text-muted-foreground">Followers</span>
														<span className="text-sm font-medium">
															{selectedContributor.followers} followers
														</span>
													</div>
												</div>
											</CardContent>
										</Card>
									)}

									{/* Social Links */}
									{selectedContributor.socialLinks &&
										Object.values(selectedContributor.socialLinks).some((link) => link) && (
											<Card className="overflow-hidden border-0 bg-muted/30">
												<CardContent className="p-3">
													<div className="flex items-center gap-2.5 mb-2">
														<div className="flex items-center justify-center h-8 w-8 rounded-full bg-amber-500/10">
															<LinkIcon className="h-4 w-4 text-amber-500" />
														</div>
														<span className="text-sm font-medium">Social Links</span>
													</div>
													<div className="grid grid-cols-3 gap-2 mt-2 ml-10">
														{selectedContributor.socialLinks.twitter && (
															<a
																href={selectedContributor.socialLinks.twitter}
																target="_blank"
																rel="noopener noreferrer"
																className="text-sm text-primary hover:underline"
															>
																Twitter
															</a>
														)}
														{selectedContributor.socialLinks.linkedin && (
															<a
																href={selectedContributor.socialLinks.linkedin}
																target="_blank"
																rel="noopener noreferrer"
																className="text-sm text-primary hover:underline"
															>
																LinkedIn
															</a>
														)}
														{selectedContributor.socialLinks.website && (
															<a
																href={selectedContributor.socialLinks.website}
																target="_blank"
																rel="noopener noreferrer"
																className="text-sm text-primary hover:underline"
															>
																Website
															</a>
														)}
													</div>
												</CardContent>
											</Card>
										)}

									{/* Organizations */}
									{selectedContributor.organizations &&
										selectedContributor.organizations.length > 0 && (
											<Card className="overflow-hidden border-0 bg-muted/30">
												<CardContent className="p-3">
													<div className="flex items-center gap-2.5 mb-2">
														<div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-500/10">
															<Building className="h-4 w-4 text-green-500" />
														</div>
														<span className="text-sm font-medium">Organizations</span>
													</div>
													<div className="flex flex-wrap gap-2 mt-2 ml-10">
														{selectedContributor.organizations.map((org, index) => (
															<Badge
																key={index}
																variant="outline"
																className="px-2 py-1 bg-muted/50"
															>
																{org}
															</Badge>
														))}
													</div>
												</CardContent>
											</Card>
										)}
								</div>
							</div>

							{/* Activity Graph */}
							<div>
								<h3 className="text-md font-medium mb-3">Activity Trends</h3>
								<div className="bg-muted/30 rounded-lg p-4">
									<ResponsiveContainer width="100%" height={200}>
										<AreaChart
											data={weeklyActivityData}
											margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
										>
											<defs>
												<linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
													<stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
													<stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
												</linearGradient>
												<linearGradient id="colorPRs" x1="0" y1="0" x2="0" y2="1">
													<stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
													<stop offset="95%" stopColor="#10b981" stopOpacity={0} />
												</linearGradient>
											</defs>
											<XAxis
												dataKey="week"
												tick={{ fontSize: 12 }}
												tickFormatter={(week) => `W${week}`}
											/>
											<YAxis tick={{ fontSize: 12 }} />
											<CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
											<Tooltip
												contentStyle={{
													backgroundColor: "hsl(var(--card))",
													borderColor: "hsl(var(--border))",
													borderRadius: "0.5rem",
												}}
											/>
											<Legend
												wrapperStyle={{ paddingTop: "10px" }}
												iconType="circle"
												fontSize={12}
											/>
											<Area
												type="monotone"
												dataKey="commits"
												name="Commits"
												stroke="#3b82f6"
												fillOpacity={1}
												fill="url(#colorCommits)"
											/>
											<Area
												type="monotone"
												dataKey="prs"
												name="PRs Merged"
												stroke="#10b981"
												fillOpacity={1}
												fill="url(#colorPRs)"
											/>
										</AreaChart>
									</ResponsiveContainer>
								</div>
							</div>

							{/* Contributor Work Tabs */}
							<div>
								<h3 className="text-md font-medium mb-3">Contributor Work</h3>
								<Tabs defaultValue="repositories" className="w-full">
									<TabsList className="grid grid-cols-3 mb-4">
										<TabsTrigger value="repositories" className="text-xs">
											Repositories
										</TabsTrigger>
										<TabsTrigger value="prs" className="text-xs">
											Pull Requests
										</TabsTrigger>
										<TabsTrigger value="issues" className="text-xs">
											Issues
										</TabsTrigger>
									</TabsList>

									{/* Repositories Tab */}
									<TabsContent value="repositories" className="space-y-3">
										<div className="space-y-3 bg-muted/30 rounded-lg p-4">
											{selectedContributor.repositories &&
											selectedContributor.repositories.length > 0 ? (
												selectedContributor.repositories.map((repo) => (
													<a
														key={repo.id}
														href={repo.url}
														target="_blank"
														rel="noopener noreferrer"
														className="flex items-center justify-between gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
													>
														<div className="flex items-center gap-2">
															<GitBranch className="h-4 w-4 text-muted-foreground" />
															<div className="font-medium text-sm">{repo.name}</div>
														</div>
														<div className="flex items-center gap-2">
															<span className="text-xs text-muted-foreground">
																{repo.contributions} contributions
															</span>
														</div>
													</a>
												))
											) : (
												<div className="text-center py-6 text-sm text-muted-foreground">
													No repositories found
												</div>
											)}
										</div>
									</TabsContent>

									{/* Pull Requests Tab */}
									<TabsContent value="prs" className="space-y-3">
										<div className="space-y-3 bg-muted/30 rounded-lg p-4">
											{pullRequestsData.length > 0 ? (
												pullRequestsData.map((pr) => (
													<a
														key={pr.id}
														href={pr.url}
														target="_blank"
														rel="noopener noreferrer"
														className="flex flex-col gap-1 p-2 rounded-md hover:bg-muted/50 transition-colors"
													>
														<div className="flex justify-between items-start">
															<div className="flex items-center gap-2">
																<GitPullRequest
																	className={`h-4 w-4 ${
																		pr.status === "merged"
																			? "text-primary"
																			: "text-yellow-500"
																	}`}
																/>
																<div className="font-medium text-sm">{pr.title}</div>
															</div>
															<Badge
																variant={pr.status === "merged" ? "default" : "outline"}
																className="text-xs h-5"
															>
																{pr.status}
															</Badge>
														</div>
														<div className="ml-6 flex justify-between text-xs text-muted-foreground">
															<span>{pr.repository}</span>
															<span>{formatDate(pr.createdAt)}</span>
														</div>
													</a>
												))
											) : (
												<div className="text-center py-6 text-sm text-muted-foreground">
													No pull requests found
												</div>
											)}
										</div>
									</TabsContent>

									{/* Issues Tab */}
									<TabsContent value="issues" className="space-y-3">
										<div className="space-y-3 bg-muted/30 rounded-lg p-4">
											{issuesData.length > 0 ? (
												issuesData.map((issue) => (
													<a
														key={issue.id}
														href={issue.url}
														target="_blank"
														rel="noopener noreferrer"
														className="flex flex-col gap-1 p-2 rounded-md hover:bg-muted/50 transition-colors"
													>
														<div className="flex justify-between items-start">
															<div className="flex items-center gap-2">
																<AlertCircle
																	className={`h-4 w-4 ${
																		issue.status === "open"
																			? "text-red-500"
																			: "text-green-500"
																	}`}
																/>
																<div className="font-medium text-sm">{issue.title}</div>
															</div>
															<Badge
																variant={
																	issue.status === "open"
																		? "destructive"
																		: "secondary"
																}
																className="text-xs h-5"
															>
																{issue.status}
															</Badge>
														</div>
														<div className="ml-6 flex justify-between text-xs text-muted-foreground">
															<span>{issue.repository}</span>
															<span>{formatDate(issue.createdAt)}</span>
														</div>
													</a>
												))
											) : (
												<div className="text-center py-6 text-sm text-muted-foreground">
													No issues found
												</div>
											)}
										</div>
									</TabsContent>
								</Tabs>
							</div>

							{/* Last Active */}
							<div className="pt-4 border-t">
								<div className="flex justify-between items-center text-sm">
									<span className="text-muted-foreground">Last Active</span>
									<span>{formatDate(selectedContributor.lastActive)}</span>
								</div>
							</div>
						</div>
					</>
				) : (
					<div className="flex justify-center items-center h-40">
						<p>No contributor selected</p>
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}
