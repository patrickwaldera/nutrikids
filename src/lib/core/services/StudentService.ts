import { PBStudentRepository } from "$lib/infra/repositories_impl/PBStudentRepository";
import type { Student } from "../entities/Student";
import type { IStudentRepository } from "../repositories/StudentRepository";

export class StudentService {
	private static studentRepository: IStudentRepository = new PBStudentRepository();

	public static async getManyBySchoolId(token: string, schoolId: string): Promise<Student[]> {
		try {
			return await StudentService.studentRepository.getManyBySchoolId(token, schoolId);
		} catch (error) {
			throw error;
		}
	}

	public static async delete(token: string, id: string): Promise<boolean> {
		try {
			return StudentService.studentRepository.delete(token, id);
		} catch (error) {
			throw error;
		}
	}

	public static async update(token: string, student: Student): Promise<boolean> {
		try {
			return StudentService.studentRepository.update(token, student);
		} catch (error) {
			throw error;
		}
	}	
}