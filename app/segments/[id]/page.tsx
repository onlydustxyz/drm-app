export default async function SegmentPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	return <div>Segment {id}</div>;
}
