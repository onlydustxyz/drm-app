export default async function SegmentDataPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	return <div>Segment Data {id}</div>;
}
