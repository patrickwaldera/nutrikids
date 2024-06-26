import type { Student } from "$lib/core/entities/Student";

export interface IStudentRepository {
	getManyBySchoolId(token: string, schoolId: string): Promise<Student[]>;
	delete(token: string, id: string): Promise<boolean>;
	update(token: string, student: Student): Promise<boolean>;
	create(token: string, student: Student): Promise<string>;
}