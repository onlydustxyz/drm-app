"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useContributor } from "@/lib/react-query/contributors";
import { formatDate } from "@/lib/utils";
import {
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
							{/* Type and Tenure */}
							<div className="flex gap-3">
								<Badge variant="secondary" className="text-sm py-1.5">
									{selectedContributor.type}
								</Badge>
								<Badge variant="outline" className="text-sm py-1.5">
									{selectedContributor.tenure}
								</Badge>
							</div>

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

							{/* Personal Information */}
							<div>
								<h3 className="text-md font-medium mb-3">Personal Information</h3>
								<div className="space-y-3 bg-muted/30 rounded-lg p-4">
									{selectedContributor.location && (
										<div className="flex items-center gap-2">
											<MapPin className="h-4 w-4 text-muted-foreground" />
											<span className="text-sm">{selectedContributor.location}</span>
										</div>
									)}

									<div className="flex items-center gap-2">
										<ExternalLink className="h-4 w-4 text-muted-foreground" />
										<a
											href={`https://github.com/${selectedContributor.handle}`}
											target="_blank"
											rel="noopener noreferrer"
											className="text-sm text-primary hover:underline"
										>
											GitHub Profile
										</a>
									</div>

									{selectedContributor.socialLinks && (
										<div className="flex items-start gap-2">
											<LinkIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
											<div className="flex flex-col gap-1">
												{selectedContributor.socialLinks.github && (
													<a
														href={selectedContributor.socialLinks.github}
														target="_blank"
														rel="noopener noreferrer"
														className="text-sm text-primary hover:underline"
													>
														GitHub
													</a>
												)}
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
										</div>
									)}

									{selectedContributor.organizations &&
										selectedContributor.organizations.length > 0 && (
											<div className="flex items-start gap-2">
												<Building className="h-4 w-4 text-muted-foreground mt-0.5" />
												<div className="flex flex-col gap-1">
													{selectedContributor.organizations.map((org, index) => (
														<span key={index} className="text-sm">
															{org}
														</span>
													))}
												</div>
											</div>
										)}

									{selectedContributor.followers !== undefined && (
										<div className="flex items-center gap-2">
											<Users className="h-4 w-4 text-muted-foreground" />
											<span className="text-sm">{selectedContributor.followers} followers</span>
										</div>
									)}
								</div>
							</div>

							{/* Repositories */}
							{selectedContributor.repositories && (
								<div>
									<h3 className="text-md font-medium mb-3">Active Repositories</h3>
									<div className="space-y-3 bg-muted/30 rounded-lg p-4">
										{selectedContributor.repositories.map((repo) => (
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
										))}
									</div>
								</div>
							)}

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
