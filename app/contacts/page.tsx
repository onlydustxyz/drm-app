import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ContactsPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
				<p className="text-muted-foreground">Manage your contacts and their information.</p>
			</div>
			<Separator />

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Phone</TableHead>
							<TableHead>Company</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{Array.from({ length: 5 }, (_, i) => (
							<TableRow key={i}>
								<TableCell className="font-medium">John Doe {i + 1}</TableCell>
								<TableCell>john.doe{i + 1}@example.com</TableCell>
								<TableCell>+1 (555) 123-456{i}</TableCell>
								<TableCell>Acme Corp</TableCell>
								<TableCell>
									<span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
										Active
									</span>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
