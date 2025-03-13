"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { BarChart3, Building2, CalendarDays, ContactIcon, Code2, LogOut, PanelLeft, Settings, Users, GitPullRequest, ListFilter } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
	setIsOpen?: (open: boolean) => void;
}

export function CrmSidebar({ className, setIsOpen, ...props }: SidebarNavProps) {
	const pathname = usePathname();

	const navItems = [
		{
			name: "Dashboard",
			href: "/dashboard",
			icon: PanelLeft,
		},
		{
			name: "Contributors",
			href: "/contributors",
			icon: GitPullRequest,
			subItems: [
				{
					name: "Sublists",
					href: "/contributors/sublists",
					icon: ListFilter,
				},
			],
		},
		{
			name: "Repositories",
			href: "/ecosystems",
			icon: Code2,
			subItems: [
				{
					name: "Sublists",
					href: "/repositories/sublists",
					icon: ListFilter,
				},
			],
		},
	];

	const handleClick = () => {
		if (setIsOpen) {
			setIsOpen(false);
		}
	};

	return (
		<div className="flex h-full w-full flex-col space-y-2 p-4">
			<div className="px-3 py-2">
				<h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">DRM CRM</h2>
				<div className="space-y-1">
					{navItems.map((item) => (
						<div key={item.href} className="space-y-1">
							<Button
								variant={pathname === item.href ? "secondary" : "ghost"}
								className={cn(
									"w-full justify-start",
									pathname === item.href ? "bg-secondary" : "hover:bg-secondary/20"
								)}
								asChild
								onClick={handleClick}
							>
								<Link href={item.href}>
									<item.icon className="mr-2 h-4 w-4" />
									{item.name}
								</Link>
							</Button>
							
							{item.subItems && item.subItems.length > 0 && (
								<div className="ml-6 space-y-1">
									{item.subItems.map((subItem) => (
										<Button
											key={subItem.href}
											variant={pathname === subItem.href ? "secondary" : "ghost"}
											className={cn(
												"w-full justify-start",
												pathname === subItem.href ? "bg-secondary" : "hover:bg-secondary/20"
											)}
											asChild
											onClick={handleClick}
										>
											<Link href={subItem.href}>
												<subItem.icon className="mr-2 h-4 w-4" />
												{subItem.name}
											</Link>
										</Button>
									))}
								</div>
							)}
						</div>
					))}
				</div>
			</div>
			<div className="mt-auto px-3 py-2">
				<Button
					variant="ghost"
					className="w-full justify-start hover:bg-destructive/10"
					asChild
					onClick={handleClick}
				>
					<button
						onClick={async () => {
							await fetch('/auth/signout', { method: 'POST' });
							window.location.href = '/login';
						}}
					>
						<LogOut className="mr-2 h-4 w-4" />
						Logout
					</button>
				</Button>
			</div>
		</div>
	);
}
