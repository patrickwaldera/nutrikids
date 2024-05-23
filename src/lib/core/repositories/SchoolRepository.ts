import type { Class } from "$lib/core/entities/Class";
import type { School } from "$lib/core/entities/School";

export interface ISchoolRepository {
	getOneById(token: string, id: string): Promise<School>;
	getClassesBySchoolId(token: string, schoolId: string): Promise<Class[]>;
}