import { getAllRepositories } from "@/lib/drizzle/queries";

export default async function TestPage() {
	const test = await getAllRepositories();

	console.log(test);

	return <div>Test</div>;
}
