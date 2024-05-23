import type { LoginResponse } from "$lib/core/dtos/LoginResponse";

export interface IAuthRepository {
	login(username: string, password: string): Promise<LoginResponse>;
}