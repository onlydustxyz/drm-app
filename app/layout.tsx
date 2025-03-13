import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { TanstackQueryProvider } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "DRM App",
	description: "Next.js app with Supabase Auth",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<TanstackQueryProvider>
					<main className="min-h-screen bg-gray-50">{children}</main>
					<Toaster />
				</TanstackQueryProvider>
			</body>
		</html>
	);
}
