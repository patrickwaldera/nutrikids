import { fail, redirect, type Actions } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
import { AuthService } from "$lib/core/services/AuthService";
import { ENVIRONMENT } from "$env/static/private";

export const load: PageServerLoad = async ({ locals }: any) => { 
	if(locals.token) {
	  throw redirect(303, "/")
	}
}

export const actions: Actions = {
	login: async ({ request, locals, cookies }: any) => {
		const data = Object.fromEntries(await request.formData());
		const { username, password } = data;

		try {
			const response = await AuthService.login(username, password);
			
			const secure = ENVIRONMENT === "production" ? true : false;

			locals.user = response.user;
			cookies.set("user", JSON.stringify(response.user), { path: "/", sameSite: "strict", maxAge: 60 * 60 * 24 * 7, secure: secure });
			locals.token = response.token;
			cookies.set("token", response.token, { path: "/", sameSite: "strict", maxAge: 60 * 60 * 24 * 7, secure: secure });
			
		} catch (error: any) {
			if (error.response.status === 400 || error.response.status === 401) {
				return fail(400, { error: "Credenciais inválidas. Tente novamente." });
			} else {
				return fail(500, { error: "Erro inesperado. Tente novamente." });
			}
		}
	}
}