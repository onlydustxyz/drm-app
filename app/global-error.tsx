"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);

	return (
		<html>
			<body>
				<div className="flex items-center justify-center min-h-screen bg-gray-50">
					<div className="w-full max-w-md p-8 mx-auto text-center bg-white rounded-lg shadow-md">
						<div className="flex justify-center mb-4">
							<AlertTriangle className="w-16 h-16 text-red-500" />
						</div>
						<h1 className="mb-4 text-2xl font-bold text-gray-900">Something went wrong!</h1>
						<p className="mb-6 text-gray-600">
							We apologize for the inconvenience. The error has been logged and we're working on fixing
							it.
						</p>
						<div className="flex flex-col gap-3">
							<Button onClick={() => reset()} variant="outline" className="w-full">
								Try again
							</Button>
							<Link href="/" className="w-full">
								<Button variant="default" className="w-full">
									Return home
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</body>
		</html>
	);
}
