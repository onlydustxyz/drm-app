import { useToast } from "@/components/ui/use-toast";
import { repositoryKeys } from "@/lib/react-query/repositories";
import { Repository } from "@/lib/services/repositories-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function createSegmentMutation(repository: Omit<Repository, "id">): Promise<Repository> {
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

export function useCreateSegment() {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	return useMutation({
		mutationFn: createSegmentMutation,
		onSuccess: () => {
			toast({
				title: "Segment created successfully",
			});
			queryClient.invalidateQueries({ queryKey: repositoryKeys.lists() });
		},
	});
}
