// Contributors data types
export interface Contributor {
	id: string;
	name: string;
	avatar: string;
	handle: string; // GitHub handle
	type: "Full-Time" | "Part-Time" | "One-Time"; // Contributor type
	tenure: "Newcomer" | "Emerging" | "Established"; // Contributor tenure
	description: string; // Brief description of the contributor
	location: string; // Geographic location
	organizations: string[]; // Organizations the contributor is part of
	prMerged: number;
	prOpened: number;
	issuesOpened: number;
	issuesClosed: number;
	commits: number;
	lastActive: string;
	latestCommit: {
		message: string;
		date: string;
		url: string;
	}; // Latest commit information
	socialLinks: {
		github?: string;
		twitter?: string;
		linkedin?: string;
		website?: string;
	}; // Social media links
	activityScore: number; // Activity score (0-100)
	languages: Array<{ name: string; percentage: number }>; // Programming languages used
	reputationScore: number; // Reputation score (0-100)
	stars: number; // Number of stars received
	followers: number; // Number of followers
}

// Mock data implementation
const mockContributors: Contributor[] = [
	{
		id: "1",
		name: "Alice Johnson",
		handle: "alicej",
		avatar: "https://github.com/ghost.png",
		type: "Full-Time",
		tenure: "Established",
		description: "Core developer focused on backend infrastructure",
		location: "San Francisco, CA",
		organizations: ["TechCorp", "OpenSource Foundation"],
		prMerged: 24,
		prOpened: 28,
		issuesOpened: 15,
		issuesClosed: 12,
		commits: 87,
		lastActive: "2023-03-15",
		latestCommit: {
			message: "Fix pagination in API responses",
			date: "2023-03-15",
			url: "https://github.com/org/repo/commit/abc123",
		},
		socialLinks: {
			github: "https://github.com/alicej",
			twitter: "https://twitter.com/alicej",
			linkedin: "https://linkedin.com/in/alicej",
		},
		activityScore: 85,
		languages: [
			{ name: "TypeScript", percentage: 60 },
			{ name: "JavaScript", percentage: 30 },
			{ name: "Python", percentage: 10 },
		],
		reputationScore: 92,
		stars: 145,
		followers: 78,
	},
	{
		id: "2",
		name: "Bob Smith",
		handle: "bsmith",
		avatar: "https://github.com/ghost.png",
		type: "Part-Time",
		tenure: "Emerging",
		description: "Frontend specialist with focus on React components",
		location: "Berlin, Germany",
		organizations: ["WebDevs"],
		prMerged: 18,
		prOpened: 22,
		issuesOpened: 9,
		issuesClosed: 7,
		commits: 65,
		lastActive: "2023-03-14",
		latestCommit: {
			message: "Add responsive design to dashboard",
			date: "2023-03-14",
			url: "https://github.com/org/repo/commit/def456",
		},
		socialLinks: {
			github: "https://github.com/bsmith",
			website: "https://bobsmith.dev",
		},
		activityScore: 72,
		languages: [
			{ name: "JavaScript", percentage: 70 },
			{ name: "CSS", percentage: 20 },
			{ name: "HTML", percentage: 10 },
		],
		reputationScore: 78,
		stars: 87,
		followers: 42,
	},
	{
		id: "3",
		name: "Carol Williams",
		handle: "cwilliams",
		avatar: "https://github.com/ghost.png",
		type: "Full-Time",
		tenure: "Established",
		description: "DevOps engineer specializing in CI/CD pipelines",
		location: "Toronto, Canada",
		organizations: ["CloudTech", "DevOpsCollective"],
		prMerged: 32,
		prOpened: 35,
		issuesOpened: 20,
		issuesClosed: 18,
		commits: 112,
		lastActive: "2023-03-16",
		latestCommit: {
			message: "Optimize Docker build process",
			date: "2023-03-16",
			url: "https://github.com/org/repo/commit/ghi789",
		},
		socialLinks: {
			github: "https://github.com/cwilliams",
			linkedin: "https://linkedin.com/in/cwilliams",
			twitter: "https://twitter.com/cwilliams",
		},
		activityScore: 94,
		languages: [
			{ name: "Go", percentage: 40 },
			{ name: "Python", percentage: 30 },
			{ name: "YAML", percentage: 30 },
		],
		reputationScore: 95,
		stars: 210,
		followers: 124,
	},
	{
		id: "4",
		name: "Dave Brown",
		handle: "dbrown",
		avatar: "https://github.com/ghost.png",
		type: "One-Time",
		tenure: "Newcomer",
		description: "Documentation contributor",
		location: "London, UK",
		organizations: [],
		prMerged: 15,
		prOpened: 19,
		issuesOpened: 8,
		issuesClosed: 6,
		commits: 54,
		lastActive: "2023-03-13",
		latestCommit: {
			message: "Update installation docs",
			date: "2023-03-13",
			url: "https://github.com/org/repo/commit/jkl012",
		},
		socialLinks: {
			github: "https://github.com/dbrown",
		},
		activityScore: 45,
		languages: [
			{ name: "Markdown", percentage: 90 },
			{ name: "JavaScript", percentage: 10 },
		],
		reputationScore: 62,
		stars: 23,
		followers: 15,
	},
	{
		id: "5",
		name: "Eve Davis",
		handle: "edavis",
		avatar: "https://github.com/ghost.png",
		type: "Part-Time",
		tenure: "Emerging",
		description: "Security researcher and bug hunter",
		location: "Sydney, Australia",
		organizations: ["SecureCode"],
		prMerged: 28,
		prOpened: 30,
		issuesOpened: 17,
		issuesClosed: 15,
		commits: 95,
		lastActive: "2023-03-15",
		latestCommit: {
			message: "Fix XSS vulnerability in form input",
			date: "2023-03-15",
			url: "https://github.com/org/repo/commit/mno345",
		},
		socialLinks: {
			github: "https://github.com/edavis",
			twitter: "https://twitter.com/edavis",
			website: "https://evedavis.security",
		},
		activityScore: 88,
		languages: [
			{ name: "JavaScript", percentage: 50 },
			{ name: "Python", percentage: 30 },
			{ name: "Ruby", percentage: 20 },
		],
		reputationScore: 89,
		stars: 156,
		followers: 92,
	},
];

// Contributors service interface
export interface ContributorsService {
	getContributors(): Promise<Contributor[]>;
	getContributor(id: string): Promise<Contributor | undefined>;
}

// Mock implementation of the contributors service
export class MockContributorsService implements ContributorsService {
	async getContributors(): Promise<Contributor[]> {
		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Return mock data for now
		return mockContributors;
	}

	async getContributor(id: string): Promise<Contributor | undefined> {
		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 300));

		// Find and return the contributor with the matching ID
		return mockContributors.find((contributor) => contributor.id === id);
	}
}

// Create an instance of the service
const contributorsService = new MockContributorsService();

// Export functions that use the service
export async function getContributors(): Promise<Contributor[]> {
	return contributorsService.getContributors();
}

export async function getContributor(id: string): Promise<Contributor | undefined> {
	return contributorsService.getContributor(id);
}
