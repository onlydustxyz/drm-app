import { Repository } from "@/lib/services/repositories-service";
import { RepositorySublist } from "@/lib/services/repository-sublists-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Keys for React Query caching
export const repositoryKeys = {
	all: ["repositories"] as const,
	lists: () => [...repositoryKeys.all, "list"] as const,
	list: (filters: string) => [...repositoryKeys.lists(), { filters }] as const,
	details: (id: string) => [...repositoryKeys.all, "detail", id] as const,
	sublists: {
		all: ["repository-sublists"] as const,
		lists: () => [...repositoryKeys.sublists.all, "list"] as const,
		list: (filters: string) => [...repositoryKeys.sublists.lists(), { filters }] as const,
		details: (id: string) => [...repositoryKeys.sublists.all, "detail", id] as const,
		activity: (id: string) => [...repositoryKeys.sublists.all, "activity", id] as const,
		retention: (id: string) => [...repositoryKeys.sublists.all, "retention", id] as const,
	},
};

// API Client functions
async function fetchRepositories(): Promise<Repository[]> {
	const response = await fetch("/api/repositories");
	if (!response.ok) {
		throw new Error("Failed to fetch repositories");
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
export function useRepositories() {
	return useQuery({
		queryKey: repositoryKeys.lists(),
		queryFn: fetchRepositories,
	});
}

export function useRepository(id: string) {
	return useQuery({
		queryKey: repositoryKeys.details(id),
		queryFn: () => fetchRepository(id),
		enabled: !!id,
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
		queryKey: repositoryKeys.sublists.lists(),
		queryFn: fetchRepositorySublists,
	});
}

export function useRepositorySublist(id: string) {
	return useQuery({
		queryKey: repositoryKeys.sublists.details(id),
		queryFn: () => fetchRepositorySublist(id),
		enabled: !!id,
	});
}

export function useCreateRepositorySublist() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createRepositorySublistMutation,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: repositoryKeys.sublists.lists() });
		},
	});
}
