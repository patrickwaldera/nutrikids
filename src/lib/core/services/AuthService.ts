import { PBAuthRepository } from "$lib/infra/repositories_impl/PBAuthRepository";
import type { IAuthRepository } from "../repositories/AuthRepository";

export class AuthService {
	private static authRepository: IAuthRepository = new PBAuthRepository();

	public static async login(username: string, password: string): Promise<any> {
		try {
			return await AuthService.authRepository.login(username, password);
		} catch (error) {
			throw error;
		}
	}

	public static isTokenExpired(token: string): boolean {
		const decodedToken = AuthService.decodeToken(token);
		const expiration = decodedToken.exp;
		const currentTime = Math.floor(Date.now() / 1000);
		return expiration < currentTime;
	}

	public static decodeToken(token: string): any {
		return JSON.parse(atob(token.split(".")[1]));
	}
}