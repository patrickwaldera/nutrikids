import { PBSchoolRepository } from "$lib/infra/repositories_impl/PBSchoolRepository";
import type { School } from "../entities/School";
import type { ISchoolRepository } from "../repositories/SchoolRepository";

export class SchoolService {
	private static schoolRepository: ISchoolRepository = new PBSchoolRepository();

	public static async getOneById(token: string, id: string): Promise<School> {
		try {
			return await SchoolService.schoolRepository.getOneById(token, id);
		} catch (error) {
			throw error;
		}
	}
}