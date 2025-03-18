"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
	const supabase = await createClient();

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	const { error } = await supabase.auth.signInWithPassword(data);

	if (error) {
		// Redirect with the error code to show the appropriate error message
		if (error.message.includes("Invalid login credentials")) {
			redirect("/login?error=invalid_credentials");
		}
		redirect("/error");
	}

	revalidatePath("/", "layout");
	redirect("/");
}

export async function signup(formData: FormData) {
	const supabase = await createClient();

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	const { data: test, error } = await supabase.auth.signUp(data);

	if (error) {
		// Redirect with the error code to show the appropriate error message
		if (error.message.includes("Password should be at least")) {
			redirect("/login?error=password_too_short");
		}
		redirect("/error");
	}

	// Check if email confirmation is required
	if (test?.user && !test.user.email_confirmed_at) {
		// Redirect to a confirmation page instead
		redirect("/login?confirmed=false");
	}

	revalidatePath("/", "layout");
	redirect("/");
}
