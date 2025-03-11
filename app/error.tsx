"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);

	return (
		<div className="flex items-center justify-center min-h-[70vh] p-4">
			<div className="w-full max-w-md p-6 mx-auto text-center bg-white rounded-lg shadow-md">
				<div className="flex justify-center mb-4">
					<AlertTriangle className="w-12 h-12 text-amber-500" />
				</div>
				<h2 className="mb-3 text-xl font-semibold text-gray-900">Something went wrong</h2>
				<div className="mb-4 p-3 bg-gray-50 rounded text-sm text-gray-600 overflow-auto max-h-32">
					{error.message || "An unexpected error occurred"}
					{error.digest && <p className="mt-1 text-xs text-gray-500">Error ID: {error.digest}</p>}
				</div>
				<div className="flex flex-col sm:flex-row gap-3">
					<Button onClick={() => reset()} variant="outline" className="flex-1">
						Try again
					</Button>
					<Link href="/" className="flex-1">
						<Button variant="default" className="w-full">
							Return home
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
