import axios from "axios";
import { API_BASE_URL } from "./pocketbase";
import type { IAuthRepository } from "$lib/core/repositories/AuthRepository";
import type { LoginResponse } from "$lib/core/dtos/LoginResponse";

export class PBAuthRepository implements IAuthRepository {
	public async login(username: string, password: string): Promise<LoginResponse> {
		try {
			const response = await axios.post(`${API_BASE_URL}/collections/users/auth-with-password`, {
				identity: username,
				password: password,
			});		
			const data = response.data;

			const user = {
				id: data.record.id,
				name: data.record.name,
				username: data.record.username,
				email: data.record.email,
				role: data.record.role,
				schoolId: data.record.school_id,
			};

			const token = response.data.token;

			if (!token) {
				throw new Error("Invalid token");
			}

			return { user, token };

		} catch (error) {
			throw error;
		}
	}
}