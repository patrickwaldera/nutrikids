// See https://kit.svelte.dev/docs/types#app

import type { User } from "$lib/core/entities/User";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			token?: string | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
