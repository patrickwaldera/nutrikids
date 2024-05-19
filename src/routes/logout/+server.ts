import { redirect } from "@sveltejs/kit";

export const POST = async ({ locals, cookies }: any) => {
	locals.token = null;
	cookies.delete("token", { path: "/" });
	cookies.delete("user", { path: "/" });
	throw redirect(303, "/login")
}