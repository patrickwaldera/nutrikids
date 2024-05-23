
import { AuthService } from "$lib/core/services/AuthService";
import type { LayoutServerLoad } from "./$types";
import { ENVIRONMENT } from "$env/static/private";

export const load: LayoutServerLoad = async ({cookies}) => {

	const tokenCookie = cookies.get("token") || null;
	if (tokenCookie !== null) {
		
		const isTokenExpired = AuthService.isTokenExpired(tokenCookie);		
		const secure = ENVIRONMENT === "production" ? true : false;
		if(isTokenExpired) {
			cookies.delete("token", { path: "/", secure: secure });
			cookies.delete("user", { path: "/", secure: secure });
		}
	}
	
	const userCookie = cookies.get("user") || null;
	const user = userCookie ? JSON.parse(userCookie) : null;
	return {
		user
	}
}