import { fail, redirect, type Actions } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
import { AuthService } from "$lib/core/services/AuthService";

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
			locals.token = response.token;
			cookies.set("token", response.token, { path: "/", sameSite: "strict", maxAge: 60 * 60 * 24 * 7 });
			const user = {
				id: response.record.id,
				name: response.record.name,
				username: response.record.username,
				email: response.record.email,
				role: response.record.role
			};
			cookies.set("user", JSON.stringify(user), { path: "/", sameSite: "strict", maxAge: 60 * 60 * 24 * 7 });
			
		} catch (error: any) {
			if (error.response.status === 400 || error.response.status === 401) {
				return fail(400, { error: "Credenciais inválidas. Tente novamente." });
			} else {
				return fail(500, { error: "Erro inesperado. Tente novamente." });
			}
		}
	}
}