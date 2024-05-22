import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import { SchoolService } from "$lib/core/services/SchoolService";
import { StudentService } from "$lib/core/services/StudentService";

export const load: PageServerLoad = async (event) => {
	if(!event.locals.token) {
	  throw redirect(303, "/login")
	}

	try {
		const classes = await SchoolService.getClassesBySchoolId(event.locals.token, event.locals.user?.schoolId!);
		const students = await StudentService.getManyBySchoolId(event.locals.token, event.locals.user?.schoolId!);
		const sortedStudents = students.sort((a, b) => a.name.localeCompare(b.name));
		return {
			classes, students: sortedStudents, token: event.locals.token
		}
	} catch (error) {
		return { error: "Ocorreu um erro ao buscar os alunos." };
	}
}