"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import { useState } from "react";
import { CrmSidebar } from "./crm-sidebar";

export function CrmLayout({ children }: { children: React.ReactNode }) {
	const isMobile = useIsMobile();
	const [isOpen, setIsOpen] = useState(false);

	// For mobile: use Sheet component to show sidebar
	if (isMobile) {
		return (
			<div className="flex min-h-screen flex-col">
				<header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
					<Sheet open={isOpen} onOpenChange={setIsOpen}>
						<SheetTrigger asChild>
							<Button variant="outline" size="icon" className="md:hidden">
								<Menu className="h-5 w-5" />
								<span className="sr-only">Toggle menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="w-72 p-0">
							<CrmSidebar setIsOpen={setIsOpen} />
						</SheetContent>
					</Sheet>
					<div className="flex-1">
						<h1 className="text-xl font-semibold">CRM Dashboard</h1>
					</div>
				</header>
				<main className="flex-1 p-4 md:p-6">{children}</main>
			</div>
		);
	}

	// For desktop: use regular sidebar layout
	return (
		<SidebarProvider>
			<div className="flex min-h-screen">
				<Sidebar className="hidden border-r lg:block">
					<CrmSidebar />
				</Sidebar>
				<div className="flex w-full flex-col">
					<header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
						<div className="flex-1">
							<h1 className="text-xl font-semibold">CRM Dashboard</h1>
						</div>
					</header>
					<main className="flex-1 p-6">{children}</main>
				</div>
			</div>
		</SidebarProvider>
	);
}
