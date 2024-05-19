
import { AuthService } from "$lib/core/services/AuthService";
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({cookies}) => {

	const tokenCookie = cookies.get("token") || null;
	if (tokenCookie !== null) {
		const isTokenExpired = AuthService.isTokenExpired(tokenCookie);
		if(isTokenExpired) {
			cookies.delete("token", { path: "/" });
			cookies.delete("user", { path: "/" });
		}
	}
	
	const userCookie = cookies.get("user") || null;
	const user = userCookie ? JSON.parse(userCookie) : null;
	return {
		user
	}
}