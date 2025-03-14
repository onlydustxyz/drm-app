import { Contributor } from "@/lib/services/contributors-service";
import { useQuery } from "@tanstack/react-query";

// API fetch function
export const fetchContributors = async (): Promise<Contributor[]> => {
	const response = await fetch("/api/contributors");
	if (!response.ok) {
		throw new Error("Failed to fetch contributors");
	}
	return response.json();
};

// React Query hook for contributors
export const useContributors = () => {
	return useQuery({
		queryKey: ["contributors"],
		queryFn: fetchContributors,
	});
};
