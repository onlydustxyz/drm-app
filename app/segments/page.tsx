import { CreateSegmentDialog } from "@/components/segments/create-segment-dialog";
import { SegmentsList } from "@/components/segments/segments-list";

export default function SegmentsPage() {
	return (
		<div className="container mx-auto py-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Segments</h1>
				<CreateSegmentDialog />
			</div>
			<SegmentsList />
		</div>
	);
}
