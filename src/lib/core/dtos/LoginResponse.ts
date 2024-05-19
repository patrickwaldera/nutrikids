import type { User } from "../entities/User";

export type LoginResponse = {
	user: User;
	token: string;
};