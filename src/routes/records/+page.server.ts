import { redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "../$types";

import { getMonthName } from "$lib/core/utils/dateUtil";
import { RecordService } from "$lib/core/services/RecordService";
import { SchoolService } from "$lib/core/services/SchoolService";
import { StudentService } from "$lib/core/services/StudentService";

export const prerender = true;

export const load: PageServerLoad = async (event) => {
	if(!event.locals.token) {
	  throw redirect(303, "/login")
	}

	const months = [];
	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth() + 1;
  
	for (let month = 1; month <= currentMonth; month++) {
	  months.push({ value: month, label: getMonthName(currentYear, month) });
	}

	try {

		const records = await RecordService.getRecordsBySchoolIdAndMonth(event.locals.token, event.locals.user?.schoolId!, currentMonth);
		const sortedRecords = records.sort((a, b) => b.bmi - a.bmi);

		const classes = await SchoolService.getClassesBySchoolId(event.locals.token, event.locals.user?.schoolId!);
		const sortedClasses = classes.sort((a, b) => a.name.localeCompare(b.name));

		const students = await StudentService.getManyBySchoolId(event.locals.token, event.locals.user?.schoolId!);
		const sortedStudents = students.sort((a, b) => a.name.localeCompare(b.name));

		return {
			currentYear,
			months,
			currentMonth,
			records: sortedRecords,
			classes: sortedClasses,
			students: sortedStudents,
			token: event.locals.token
		}
		
	} catch (error) {
		return { error: "Ocorreu um erro ao buscar os registros." };
	}
  }