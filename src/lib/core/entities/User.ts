export type User = {
	id: string;
	name: string;
	username: string;
	email: string;
	role: "nutritionist" | "teacher";
	school_id?: string;
};