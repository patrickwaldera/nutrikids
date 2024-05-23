import type { Class } from "$lib/core/entities/Class";
import type { School } from "$lib/core/entities/School";
import type { ISchoolRepository } from "$lib/core/repositories/SchoolRepository";
import { PBSchoolRepository } from "$lib/infra/repositories_impl/PBSchoolRepository";

export class SchoolService {
	private static schoolRepository: ISchoolRepository = new PBSchoolRepository();

	public static async getOneById(token: string, id: string): Promise<School> {
		try {
			return await SchoolService.schoolRepository.getOneById(token, id);
		} catch (error) {
			throw error;
		}
	}

	public static async getClassesBySchoolId(token: string, schoolId: string): Promise<Class[]> {
		try {
			return await SchoolService.schoolRepository.getClassesBySchoolId(token, schoolId);
		} catch (error) {
			throw error;
		}
	}
}