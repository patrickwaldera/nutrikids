import type { IStudentRepository } from "$lib/core/repositories/StudentRepository";
import axios from "axios";
import { API_BASE_URL } from "./pocketbase";
import type { Student } from "$lib/core/entities/Student";
import { convertDateToDDMMYYYY, convertDateToYYYYMMDD } from "$lib/core/utils/Date";

export class PBStudentRepository implements IStudentRepository {
	public async getManyBySchoolId(token: string, schoolId: string): Promise<Student[]> {
		try {
			const response = await axios.get(`${API_BASE_URL}/collections/students/records?expand=class_id&filter=(class_id.school_id='${schoolId}')`, {
				headers: {
					"Authorization": `Bearer ${token}`
				}
			});
			const data = response.data;
			
			const students = data.items.map((student: any) => {
				return {
					id: student.id,
					name: student.name,
					birthDate: student.birth_date ? convertDateToDDMMYYYY(new Date(student.birth_date).toISOString().split('T')[0]) : "",
					classId: student.class_id,
					className: student.expand.class_id.name,
					classAlias: student.expand.class_id.alias,
				};
			});
			
			return students;
		} catch (error) {
			throw error;
		}
	}

	public async delete(token: string, id: string): Promise<boolean> {
		try {
			await axios.delete(`${API_BASE_URL}/collections/students/records/${id}`, {
				headers: {
					"Authorization": `Bearer ${token}`
				}
			});
			return true;
		} catch (error) {
			throw error;
		}
	}

	public async update(token: string, student: Student): Promise<boolean> {
		try {
			const response = await axios.patch(`${API_BASE_URL}/collections/students/records/${student.id}`, {
				name: student.name,
				birth_date: student.birthDate ? convertDateToYYYYMMDD(student.birthDate) : "",
				class_id: student.classId
			}, {
				headers: {
					"Authorization": `Bearer ${token}`
				}
			});			
			return true;
		} catch (error) {
			throw error;
		}
	}

	public async create(token: string, student: Student): Promise<string> {
		try {
			const response = await axios.post(`${API_BASE_URL}/collections/students/records`, {
				name: student.name,
				birth_date: student.birthDate ? convertDateToYYYYMMDD(student.birthDate) : "",
				class_id: student.classId
			}, {
				headers: {
					"Authorization": `Bearer ${token}`
				}
			});

			const data = response.data;

			return data.id;
		} catch (error) {
			throw error;
		}
	}
}