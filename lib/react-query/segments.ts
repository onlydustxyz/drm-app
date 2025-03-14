import { useToast } from "@/components/ui/use-toast";
import { Segment } from "@/lib/services/segments-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys for segments
export const segmentKeys = {
	all: ["segments"] as const,
	lists: () => [...segmentKeys.all, "list"] as const,
	list: (filters: string) => [...segmentKeys.lists(), { filters }] as const,
	details: () => [...segmentKeys.all, "detail"] as const,
	detail: (id: string) => [...segmentKeys.details(), id] as const,
};

// Fetch functions
async function fetchSegments(): Promise<Segment[]> {
	const response = await fetch("/api/segments");
	if (!response.ok) {
		throw new Error("Failed to fetch segments");
	}
	return response.json();
}

async function fetchSegment(id: string): Promise<Segment> {
	const response = await fetch(`/api/segments/${id}`);
	if (!response.ok) {
		throw new Error(`Failed to fetch segment with ID ${id}`);
	}
	return response.json();
}

// Mutation functions
async function createSegmentMutation(segment: Omit<Segment, "id" | "created_at" | "updated_at">): Promise<Segment> {
	const response = await fetch("/api/segments", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(segment),
	});

	if (!response.ok) {
		throw new Error("Failed to create segment");
	}

	return response.json();
}

async function updateSegmentMutation({ id, ...segment }: { id: string; } & Partial<Omit<Segment, "id" | "created_at" | "updated_at">>): Promise<Segment> {
	const response = await fetch(`/api/segments/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(segment),
	});

	if (!response.ok) {
		throw new Error(`Failed to update segment with ID ${id}`);
	}

	return response.json();
}

async function deleteSegmentMutation(id: string): Promise<boolean> {
	const response = await fetch(`/api/segments/${id}`, {
		method: "DELETE",
	});

	if (!response.ok) {
		throw new Error(`Failed to delete segment with ID ${id}`);
	}

	return true;
}

async function addContributorToSegmentMutation({ segmentId, contributorGithubLogin }: { segmentId: string; contributorGithubLogin: string }): Promise<boolean> {
	const response = await fetch(`/api/segments/${segmentId}/contributors`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ contributorGithubLogin }),
	});

	if (!response.ok) {
		throw new Error(`Failed to add contributor to segment`);
	}

	return true;
}

async function removeContributorFromSegmentMutation({ segmentId, contributorGithubLogin }: { segmentId: string; contributorGithubLogin: string }): Promise<boolean> {
	const response = await fetch(`/api/segments/${segmentId}/contributors`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ contributorGithubLogin }),
	});

	if (!response.ok) {
		throw new Error(`Failed to remove contributor from segment`);
	}

	return true;
}

async function addRepositoryToSegmentMutation({ segmentId, repositoryUrl }: { segmentId: string; repositoryUrl: string }): Promise<boolean> {
	const response = await fetch(`/api/segments/${segmentId}/repositories`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ repositoryUrl }),
	});

	if (!response.ok) {
		throw new Error(`Failed to add repository to segment`);
	}

	return true;
}

async function removeRepositoryFromSegmentMutation({ segmentId, repositoryUrl }: { segmentId: string; repositoryUrl: string }): Promise<boolean> {
	const response = await fetch(`/api/segments/${segmentId}/repositories?repositoryUrl=${encodeURIComponent(repositoryUrl)}`, {
		method: "DELETE",
	});

	if (!response.ok) {
		throw new Error(`Failed to remove repository from segment`);
	}

	return true;
}

// Hooks
export function useSegments() {
	return useQuery({
		queryKey: segmentKeys.lists(),
		queryFn: fetchSegments,
	});
}

export function useSegment(id: string) {
	return useQuery({
		queryKey: segmentKeys.detail(id),
		queryFn: () => fetchSegment(id),
		enabled: !!id,
	});
}

export function useCreateSegment() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: createSegmentMutation,
		onSuccess: () => {
			toast({
				title: "Segment created successfully",
			});
			queryClient.invalidateQueries({ queryKey: segmentKeys.lists() });
		},
	});
}

export function useUpdateSegment() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: updateSegmentMutation,
		onSuccess: (data) => {
			toast({
				title: "Segment updated successfully",
			});
			queryClient.invalidateQueries({ queryKey: segmentKeys.detail(data.id) });
			queryClient.invalidateQueries({ queryKey: segmentKeys.lists() });
		},
	});
}

export function useDeleteSegment() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: deleteSegmentMutation,
		onSuccess: (_, variables) => {
			toast({
				title: "Segment deleted successfully",
			});
			queryClient.invalidateQueries({ queryKey: segmentKeys.lists() });
			queryClient.removeQueries({ queryKey: segmentKeys.detail(variables) });
		},
	});
}

export function useAddContributorToSegment() {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: addContributorToSegmentMutation,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["segment", variables.segmentId] });
		},
	});
}

export function useRemoveContributorFromSegment() {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: removeContributorFromSegmentMutation,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["segment", variables.segmentId] });
		},
	});
}

export function useAddRepositoryToSegment() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: addRepositoryToSegmentMutation,
		onSuccess: (_, variables) => {
			toast({
				title: "Repository added to segment",
			});
			queryClient.invalidateQueries({ queryKey: segmentKeys.detail(variables.segmentId) });
		},
	});
}

export function useRemoveRepositoryFromSegment() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: removeRepositoryFromSegmentMutation,
		onSuccess: (_, variables) => {
			toast({
				title: "Repository removed from segment",
			});
			queryClient.invalidateQueries({ queryKey: segmentKeys.detail(variables.segmentId) });
		},
	});
}