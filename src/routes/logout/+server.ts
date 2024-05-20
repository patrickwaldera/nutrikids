import { ENVIRONMENT } from "$env/static/private";
import { redirect } from "@sveltejs/kit";

export const POST = async ({ locals, cookies }: any) => {
	const secure = ENVIRONMENT === "production" ? true : false;

	locals.token = null;
	cookies.delete("token", { path: "/", secure: secure });
	locals.user = null;
	cookies.delete("user", { path: "/", secure: secure });

	throw redirect(303, "/login")
}