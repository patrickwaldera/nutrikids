import { PBAuthRepository } from "$lib/infra/repositories_impl/PBAuthRepository";
import type { IAuthRepository } from "../repositories/AuthRepository";

export class AuthService {
	private static authRepository: IAuthRepository = new PBAuthRepository();

	public static async login(username: string, password: string) {
		await AuthService.authRepository.login(username, password);
	}

	public static logout() {
		AuthService.authRepository.logout();
	}
}