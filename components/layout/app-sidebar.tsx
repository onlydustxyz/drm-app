"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Boxes, LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
	setIsOpen?: (open: boolean) => void;
}

export function AppSidebar({ className, setIsOpen, ...props }: SidebarNavProps) {
	const pathname = usePathname();
	const { signOut, user } = useAuth();

	const navItems = [
		{
			name: "Dashboard",
			href: "/dashboard",
			icon: LayoutDashboard,
		},
		{
			name: "Segments",
			href: "/segments",
			icon: Boxes,
		},
	];

	const handleClick = () => {
		if (setIsOpen) {
			setIsOpen(false);
		}
	};

	const handleSignOut = async () => {
		await signOut();
	}

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

							{/* {item.subItems && item.subItems.length > 0 && (
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
							)} */}
						</div>
					))}
				</div>
			</div>
			<div className="mt-auto px-3 py-2">
				{user && (
					<div className="mb-4 flex items-center gap-2 px-2">
						<div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
							{user.user_metadata?.avatar_url ? (
								<img 
									src={user.user_metadata.avatar_url} 
									alt={user.user_metadata?.name || user.email || "User"} 
									className="h-full w-full object-cover"
								/>
							) : (
								<div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary/80">
									{(user.user_metadata?.name?.[0] || user.email?.[0] || "U").toUpperCase()}
								</div>
							)}
						</div>
						<div className="truncate text-sm">
							<div className="font-medium">{user.user_metadata?.name || user.email}</div>
							{user.email && <div className="text-xs text-muted-foreground">{user.email}</div>}
						</div>
					</div>
				)}
				<Button
					variant="ghost"
					className="w-full justify-start hover:bg-destructive/10"
					onClick={() => {
						handleSignOut();
						handleClick();
					}}
				>
					<LogOut className="mr-2 h-4 w-4" />
					Logout
				</Button>
			</div>
		</div>
	);
}
