import { Contributor } from "@/lib/services/contributors-service";
import { useQuery } from "@tanstack/react-query";

// API fetch function with search and sort options
export const fetchContributors = async (
	search?: string,
	sortBy?: keyof Contributor,
	sortOrder?: "asc" | "desc"
): Promise<Contributor[]> => {
	// Build URL with query parameters
	const url = new URL("/api/contributors", window.location.origin);

	// Add search parameter if provided
	if (search) {
		url.searchParams.append("search", search);
	}

	// Add sort parameters if provided
	if (sortBy) {
		url.searchParams.append("sortBy", sortBy as string);
	}

	if (sortOrder) {
		url.searchParams.append("sortOrder", sortOrder);
	}

	const response = await fetch(url.toString());
	if (!response.ok) {
		throw new Error("Failed to fetch contributors");
	}
	return response.json();
};

// React Query hook for contributors with search and sort
export const useContributors = (search?: string, sortBy?: keyof Contributor, sortOrder?: "asc" | "desc") => {
	return useQuery({
		queryKey: ["contributors", search, sortBy, sortOrder],
		queryFn: () => fetchContributors(search, sortBy, sortOrder),
	});
};
