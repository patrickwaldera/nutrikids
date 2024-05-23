import type { User } from "$lib/core/entities/User";

export type LoginResponse = {
	user: User;
	token: string;
};