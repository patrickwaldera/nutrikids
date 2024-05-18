import type { IAuthRepository } from "$lib/core/repositories/AuthRepository";
import { pb } from "./pocketbase";

export class PBAuthRepository implements IAuthRepository {

	public async login(username: string, password: string) {
		await pb.collection("users").authWithPassword(username, password);
	}

	public logout(): any {
		pb.authStore.clear();
	}
}