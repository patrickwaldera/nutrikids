import type { Class } from "../entities/Class";
import type { School } from "../entities/School";

export interface ISchoolRepository {
	getOneById(token: string, id: string): Promise<School>;
	getClassesBySchoolId(token: string, schoolId: string): Promise<Class[]>;
}