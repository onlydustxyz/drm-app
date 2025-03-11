import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-4">
			<h1 className="text-4xl font-bold mb-8">Welcome to DRM App</h1>
			<div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
				<h2 className="text-2xl font-semibold mb-4">User Information</h2>
				<p className="mb-2">
					<span className="font-medium">Email:</span> {user.email}
				</p>
				<p className="mb-2">
					<span className="font-medium">ID:</span> {user.id}
				</p>
				<p className="mb-4">
					<span className="font-medium">Last Sign In:</span>{" "}
					{new Date(user.last_sign_in_at || "").toLocaleString()}
				</p>

				<form action="/auth/signout" method="post">
					<button
						type="submit"
						className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors"
					>
						Sign Out
					</button>
				</form>
			</div>
		</div>
	);
}
