import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TanstackQueryProvider } from "./providers";
import { AuthProvider } from "@/hooks/use-auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "DRM App",
	description: "DRM App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<TanstackQueryProvider>
					<AuthProvider>
						<main className="min-h-screen bg-gray-50">{children}</main>
						<Toaster />
					</AuthProvider>
				</TanstackQueryProvider>
			</body>
		</html>
	);
}
