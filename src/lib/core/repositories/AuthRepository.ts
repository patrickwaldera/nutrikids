import type { LoginResponse } from "../dtos/LoginResponse";

export interface IAuthRepository {
	login(username: string, password: string): Promise<LoginResponse>;
}