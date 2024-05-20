import type { Record } from "$lib/core/entities/Record";

export interface IRecordRepository {
	getRecordsBySchoolIdAndMonth(token: string,	schoolId: string, month: number): Promise<Record[]>;
}