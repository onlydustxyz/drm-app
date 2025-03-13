"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000, // 1 minute
				refetchOnWindowFocus: false,
			},
		},
	});
}

let clientQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
	if (typeof window === "undefined") {
		// Server: always make a new query client
		return makeQueryClient();
	}
	// Browser: make a new query client if we don't already have one
	if (!clientQueryClient) clientQueryClient = makeQueryClient();

	return clientQueryClient;
}

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
	const queryClient = getQueryClient();

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
