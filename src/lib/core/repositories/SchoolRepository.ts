import type { School } from "../entities/School";

export interface ISchoolRepository {
	getOneById(token: string, id: string): Promise<School>;
}