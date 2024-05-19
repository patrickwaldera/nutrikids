import axios from "axios";
import { API_BASE_URL } from "./pocketbase";
import type { School } from "$lib/core/entities/School";
import type { ISchoolRepository } from "$lib/core/repositories/SchoolRepository";

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
}