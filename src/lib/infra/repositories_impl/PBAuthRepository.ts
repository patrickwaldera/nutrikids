import type { IAuthRepository } from "$lib/core/repositories/AuthRepository";
import axios from "axios";
import { API_BASE_URL } from "./pocketbase";

export class PBAuthRepository implements IAuthRepository {
	public async login(username: string, password: string) {
		try {
			const response = await axios.post(`${API_BASE_URL}/collections/users/auth-with-password`, {
				identity: username,
				password: password,
			});
			return response.data;
		} catch (error) {
			throw error;
		}
	}
}