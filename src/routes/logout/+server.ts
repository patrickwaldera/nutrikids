import { redirect } from "@sveltejs/kit";

export const POST = async ({ locals }: any) => {
	locals.user = undefined;
	locals.pb.authStore.clear();
	
	throw redirect(303, "/login")
}