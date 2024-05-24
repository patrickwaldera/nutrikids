import { redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

import { SchoolService } from "$lib/core/services/SchoolService";
import { RecordService } from "$lib/core/services/RecordService";
import { initializePieChartData } from "$lib/core/utils/chartJsUtil";

export const load: PageServerLoad = async (event) => {
	if(!event.locals.token) {
	  throw redirect(303, "/login")
	}

	try {

		const schoolId = event.locals.user?.schoolId;
		const currentMonth = new Date().getMonth() + 1;

		if (schoolId) {
			const school = await SchoolService.getOneById(event.locals.token, schoolId);
			const classes = await SchoolService.getClassesBySchoolId(event.locals.token, schoolId);
			const records = await RecordService.getRecordsBySchoolIdAndMonth(event.locals.token, event.locals.user?.schoolId!, currentMonth);
			const pieChartData = initializePieChartData(classes, records);			

			return { school, pieChartData };
		}
		
	} catch (error) {
		return { error: "Ocorreu um erro ao buscar as informações da escola." };
	}

	return { error: "Informações da escola não foram encontradas." };
}
