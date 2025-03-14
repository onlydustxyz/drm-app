import { Repository, RepositorySort } from "@/lib/services/repositories-service";
import { RepositorySublist } from "@/lib/services/repository-sublists-service";
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";

// Filter interface for repositories
export interface RepositoryFilter {
	names?: string[];
	search?: string;
}

// Query keys for repositories
const repositoryKeys = {
	all: ["repositories"] as const,
	lists: () => [...repositoryKeys.all, "list"] as const,
	list: (filters: RepositoryFilter) => [...repositoryKeys.lists(), filters] as const,
	details: (repositoryId: string) => [...repositoryKeys.all, "detail", repositoryId] as const,
	segment: (segmentId: string) => [...repositoryKeys.all, "segment", segmentId] as const,
};

// Query keys for repository sublists
const repositorySublistKeys = {
	all: ["repository-sublists"] as const,
	lists: () => [...repositorySublistKeys.all, "list"] as const,
	list: (filters: any) => [...repositorySublistKeys.lists(), filters] as const,
	details: (sublistId: string) => [...repositorySublistKeys.all, "detail", sublistId] as const,
};

// API Client functions
async function fetchRepositories(filter: RepositoryFilter = {}, sort?: RepositorySort): Promise<Repository[]> {
	// Build URL with query parameters
	const url = new URL("/api/repositories", window.location.origin);

	// Add filter parameters
	if (filter.names && filter.names.length > 0) {
		url.searchParams.append("names", filter.names.join(","));
	}

	if (filter.search) {
		url.searchParams.append("search", filter.search);
	}

	// Add sort parameters
	if (sort) {
		url.searchParams.append("sortBy", sort.field);
		url.searchParams.append("sortDirection", sort.direction);
	}

	const response = await fetch(url.toString());
	if (!response.ok) {
		throw new Error("Failed to fetch repositories");
	}
	return response.json();
}

// Fetch repositories by segment ID
async function fetchRepositoriesBySegmentId(segmentId: string, sort?: RepositorySort): Promise<Repository[]> {
	if (!segmentId) {
		return [];
	}
	
	// Build URL with query parameters
	const url = new URL(`/api/segments/${segmentId}/repositories`, window.location.origin);

	// Add sort parameters
	if (sort) {
		url.searchParams.append("sortBy", sort.field);
		url.searchParams.append("sortDirection", sort.direction);
	}

	const response = await fetch(url.toString());
	if (!response.ok) {
		throw new Error(`Failed to fetch repositories for segment ${segmentId}`);
	}
	return response.json();
}

async function fetchRepository(id: string): Promise<Repository> {
	const response = await fetch(`/api/repositories/${id}`);
	if (!response.ok) {
		throw new Error(`Failed to fetch repository with id ${id}`);
	}
	return response.json();
}

async function createRepositoryMutation(repository: Omit<Repository, "id">): Promise<Repository> {
	const response = await fetch("/api/repositories", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(repository),
	});

	if (!response.ok) {
		throw new Error("Failed to create repository");
	}

	return response.json();
}

async function updateRepositoryMutation({
	id,
	data,
}: {
	id: string;
	data: Partial<Omit<Repository, "id">>;
}): Promise<Repository> {
	const response = await fetch(`/api/repositories/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		throw new Error(`Failed to update repository with id ${id}`);
	}

	return response.json();
}

async function deleteRepositoryMutation(id: string): Promise<{ success: boolean }> {
	const response = await fetch(`/api/repositories/${id}`, {
		method: "DELETE",
	});

	if (!response.ok) {
		throw new Error(`Failed to delete repository with id ${id}`);
	}

	return response.json();
}

// Repository sublist API client functions
async function fetchRepositorySublists(): Promise<RepositorySublist[]> {
	const response = await fetch("/api/repositories/sublists");
	if (!response.ok) {
		throw new Error("Failed to fetch repository sublists");
	}
	return response.json();
}

async function fetchRepositorySublist(id: string): Promise<RepositorySublist> {
	const response = await fetch(`/api/repositories/sublists/${id}`);
	if (!response.ok) {
		throw new Error(`Failed to fetch repository sublist with id ${id}`);
	}
	return response.json();
}

async function createRepositorySublistMutation(
	sublist: Omit<RepositorySublist, "id" | "createdAt" | "updatedAt">
): Promise<RepositorySublist> {
	const response = await fetch("/api/repositories/sublists", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(sublist),
	});

	if (!response.ok) {
		throw new Error("Failed to create repository sublist");
	}

	return response.json();
}

// Hooks
export function useRepositories(filter?: RepositoryFilter, sort?: RepositorySort) {
	return useQuery({
		queryKey: [...repositoryKeys.lists(), filter, sort],
		queryFn: () => fetchRepositories(filter, sort),
	});
}

export function useRepositoriesBySegmentId(segmentId: string, sort?: RepositorySort) {
	return useQuery({
		queryKey: [...repositoryKeys.segment(segmentId), sort],
		queryFn: () => fetchRepositoriesBySegmentId(segmentId, sort),
		enabled: !!segmentId,
	});
}

export function useRepository(
	id: string,
	options?: Omit<
		UseQueryOptions<Repository, Error, Repository, ReturnType<typeof repositoryKeys.details>>,
		"queryKey" | "queryFn"
	>
) {
	return useQuery({
		queryKey: repositoryKeys.details(id),
		queryFn: () => fetchRepository(id),
		enabled: !!id,
		...options,
	});
}

export function useCreateRepository() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createRepositoryMutation,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: repositoryKeys.lists() });
		},
	});
}

export function useUpdateRepository() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateRepositoryMutation,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: repositoryKeys.details(data.id) });
			queryClient.invalidateQueries({ queryKey: repositoryKeys.lists() });
		},
	});
}

export function useDeleteRepository() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteRepositoryMutation,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: repositoryKeys.details(variables) });
			queryClient.invalidateQueries({ queryKey: repositoryKeys.lists() });
		},
	});
}

export function useRepositorySublists() {
	return useQuery({
		queryKey: repositorySublistKeys.lists(),
		queryFn: fetchRepositorySublists,
	});
}

export function useRepositorySublist(id: string) {
	return useQuery({
		queryKey: repositorySublistKeys.details(id),
		queryFn: () => fetchRepositorySublist(id),
		enabled: !!id,
	});
}

export function useCreateRepositorySublist() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createRepositorySublistMutation,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: repositorySublistKeys.lists() });
		},
	});
}
