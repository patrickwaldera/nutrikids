import type { Record } from "$lib/core/entities/Record";
import type { IRecordRepository } from "$lib/core/repositories/RecordRepository";
import axios from "axios";
import { API_BASE_URL } from "./pocketbase";
import { formatDateToYYYYMMDD } from "$lib/core/utils/Date";

export class PBRecordsRepository implements IRecordRepository {
	public async getRecordsBySchoolIdAndMonth(token: string, schoolId: string, month: number): Promise<Record[]> {
		try {
			const currentYear =new Date().getFullYear();
			const startOfMonth = formatDateToYYYYMMDD(new Date(currentYear, month - 1, 1));
			const endOfMonth = formatDateToYYYYMMDD(new Date(currentYear, month, 0));
			const response = await axios.get(`${API_BASE_URL}/collections/measurements_records/records?expand=student_id,student_id.class_id,student_id.class_id.school_id&filter=(student_id.class_id.school_id='${schoolId}'%26%26date>='${startOfMonth}'%26%26date<='${endOfMonth}')`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const data = response.data;
			
			const records = data.items.map((item: any) => {
				return {
					id: item.id,
					studentId: item.student_id,
					studentName: item.expand.student_id.name,
					classId: item.expand.student_id.class_id,
					className: item.expand.student_id.expand.class_id.name,
					date: new Date(item.date),
					ageAtMeasurement: item.age_at_measurement,
					weight: item.weight,
					height: item.height,
					bmi: item.bmi,
					notes: item.notes,
				};
			});	

			return records as Record[];
		} catch (error) {
			throw error;
		}
	}
}