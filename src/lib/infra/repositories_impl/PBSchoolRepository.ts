import axios from "axios";
import { API_BASE_URL } from "./pocketbase";
import type { School } from "$lib/core/entities/School";
import type { ISchoolRepository } from "$lib/core/repositories/SchoolRepository";
import type { Class } from "$lib/core/entities/Class";

export class PBSchoolRepository implements ISchoolRepository {
	public async getOneById(token: string, id: string): Promise<School> {
		try {
			const response = await axios.get(`${API_BASE_URL}/collections/schools/records/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const data = response.data;
			const school = {
				id: data.id,
				name: data.name,
				alias: data.alias,
				city: data.city,
				state: data.state,
				country: data.country,
			};
			return school;
		} catch (error) {
			throw error;
		}
	}

	public async getClassesBySchoolId(token: string, schoolId: string): Promise<Class[]> {
		try {
			const response = await axios.get(`${API_BASE_URL}/collections/classes/records?filter=(school_id='${schoolId}')`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const data = response.data;
			
			const classes = data.items.map((item: any) => {
				return {
					id: item.id,
					name: item.name,
					alias: item.alias,
					schoolId: item.school_id,
				};
			});

			return classes as Class[];
		} catch (error) {
			throw error;
		}
	}
}