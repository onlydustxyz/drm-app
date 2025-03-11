"use client";

import { createClient } from "@/lib/supabase/browser";
import { useState } from "react";

export default function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

	const supabase = createClient();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage(null);

		try {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				setMessage({ type: "error", text: error.message });
				return;
			}

			// Successful login will redirect via middleware
		} catch (error) {
			setMessage({ type: "error", text: "An unexpected error occurred" });
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{message && (
				<div
					className={`p-3 rounded ${
						message.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
					}`}
				>
					{message.text}
				</div>
			)}

			<div>
				<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
					Email
				</label>
				<input
					id="email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
				/>
			</div>

			<div>
				<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
					Password
				</label>
				<input
					id="password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
				/>
			</div>

			<button
				type="submit"
				disabled={loading}
				className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
			>
				{loading ? "Signing in..." : "Sign In"}
			</button>
		</form>
	);
}
