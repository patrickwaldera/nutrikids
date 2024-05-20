import { redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
import { SchoolService } from "$lib/core/services/SchoolService";

export const prerender = true;

export const load: PageServerLoad = async (event) => {
	if(!event.locals.token) {
	  throw redirect(303, "/login")
	}

	try {
		const schoolId = event.locals.user?.schoolId;
		if (schoolId) {
			const school = await SchoolService.getOneById(event.locals.token, schoolId);
			const classes = await SchoolService.getClassesBySchoolId(event.locals.token, schoolId);
			return { school, classes };
		}
	} catch (error) {
		return { error: "Ocorreu um erro ao buscar as informações da escola." };
	}

	return { error: "Informações da escola não encontradas." };
  }