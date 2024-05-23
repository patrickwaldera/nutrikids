import type { Student } from "$lib/core/entities/Student";
import type { IStudentRepository } from "$lib/core/repositories/StudentRepository";
import { PBStudentRepository } from "$lib/infra/repositories_impl/PBStudentRepository";

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

	public static create(token: string, student: Student): Promise<string> {
		try {
			return StudentService.studentRepository.create(token, student);
		} catch (error) {
			throw error;
		}
	}
}