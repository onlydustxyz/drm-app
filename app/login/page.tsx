import { login, signup } from "./actions";

export default async function LoginPage({
	searchParams,
}: {
	searchParams: Promise<{ confirmed?: string; error?: string }>;
}) {
	const { confirmed, error } = await searchParams;

	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-4">
			<div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
				<h1 className="text-2xl font-bold mb-6 text-center">DRM App Login</h1>

				{confirmed === "false" && (
					<div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
						Please check your email for a confirmation link before logging in.
					</div>
				)}

				{error === "invalid_credentials" && (
					<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
						Invalid email or password. If you just signed up, check your email for a confirmation link.
					</div>
				)}

				{error === "password_too_short" && (
					<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
						Password should be at least 6 characters.
					</div>
				)}

				<form className="space-y-4">
					<div className="space-y-2">
						<label htmlFor="email" className="block text-sm font-medium">
							Email:
						</label>
						<input id="email" name="email" type="email" required className="w-full p-2 border rounded" />
					</div>

					<div className="space-y-2">
						<label htmlFor="password" className="block text-sm font-medium">
							Password:
						</label>
						<input
							id="password"
							name="password"
							type="password"
							required
							className="w-full p-2 border rounded"
						/>
					</div>

					<div className="flex gap-2">
						<button
							formAction={login}
							className="flex-1 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
						>
							Log in
						</button>
						<button
							formAction={signup}
							className="flex-1 py-2 px-4 bg-gray-600 text-white rounded hover:bg-gray-700"
						>
							Sign up
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
