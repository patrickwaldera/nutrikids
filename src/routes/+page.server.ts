import { redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
import { SchoolService } from "$lib/core/services/SchoolService";

export const prerender = true;

export const load: PageServerLoad = async (event) => {
	if(!event.locals.token) {
	  throw redirect(303, "/login")
	}

	const schoolId = event.locals.user?.school_id;
	if (schoolId) {
		const school = await SchoolService.getOneById(event.locals.token, schoolId);
		return { school };
	}

	return { error: "School not found" };
  }