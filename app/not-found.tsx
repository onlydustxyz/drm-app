import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-50">
			<div className="w-full max-w-md p-8 mx-auto text-center bg-white rounded-lg shadow-md">
				<div className="flex justify-center mb-4">
					<FileQuestion className="w-16 h-16 text-blue-500" />
				</div>
				<h1 className="mb-2 text-3xl font-bold text-gray-900">404</h1>
				<h2 className="mb-4 text-xl font-medium text-gray-700">Page Not Found</h2>
				<p className="mb-6 text-gray-600">
					The page you are looking for might have been removed, had its name changed, or is temporarily
					unavailable.
				</p>
				<Link href="/">
					<Button variant="default" className="w-full">
						Return to Home
					</Button>
				</Link>
			</div>
		</div>
	);
}
