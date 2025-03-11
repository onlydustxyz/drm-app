"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { BarChart3, Building2, CalendarDays, ContactIcon, Code2, LogOut, PanelLeft, Settings, Users, GitPullRequest } from "lucide-react";
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
			name: "Contacts",
			href: "/contacts",
			icon: ContactIcon,
		},
		{
			name: "Companies",
			href: "/companies",
			icon: Building2,
		},
		{
			name: "Deals",
			href: "/deals",
			icon: Users,
		},
		{
			name: "Calendar",
			href: "/calendar",
			icon: CalendarDays,
		},
		{
			name: "Reports",
			href: "/reports",
			icon: BarChart3,
		},
		{
			name: "Contributors",
			href: "/contributors",
			icon: GitPullRequest,
		},
		{
			name: "Ecosystem Repos",
			href: "/ecosystems",
			icon: Code2,
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
						<Button
							key={item.href}
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
					))}
				</div>
			</div>
			<Separator />
			<div className="px-3 py-2">
				<h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Settings</h2>
				<div className="space-y-1">
					<Button
						variant={pathname === "/settings" ? "secondary" : "ghost"}
						className={cn(
							"w-full justify-start",
							pathname === "/settings" ? "bg-secondary" : "hover:bg-secondary/20"
						)}
						asChild
						onClick={handleClick}
					>
						<Link href="/settings">
							<Settings className="mr-2 h-4 w-4" />
							Settings
						</Link>
					</Button>
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
