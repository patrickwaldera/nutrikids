import { redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "../$types";
import { getMonthName } from "$lib/core/utils/Date";
import { RecordsService } from "$lib/core/services/RecordsService";

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

		const records = await RecordsService.getRecordsBySchoolIdAndMonth(event.locals.token, event.locals.user?.schoolId!, currentMonth);
		return {
			currentYear,
			months,
			selectedMonth: currentMonth,
			records,
			token: event.locals.token
		}
	} catch (error) {
		return { error: "Ocorreu um erro ao buscar os registros." };
	}
  }